import { razorpay } from "../app.js";
import User from "../models/user.model.js";
import crypto from "crypto";
import ErrorHandler from "../utils/error.js";
import PaymentHistory from "../models/paymentHistory.model.js";
import ReceiptHistory from "../models/receiptHistory.model.js";
import sendEmail from "../utils/emailSender.js";
import receiptTemplate from "../utils/receiptTemplate.js";
import { generateReceiptPdf } from "../utils/generateReceiptPdf.js";
import { uploadPdfToCloudinary } from "../utils/uploadPdfToCloudinary.js";

export const paymentOrderCreate = async (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    return next(new ErrorHandler("user Not Found", 400));
  }
  try {
    const user = await User.findById(id);
    if (!user) {
      return next(new ErrorHandler("user Not Found", 400));
    }
    const order = await razorpay.orders.create({
      amount: Math.round(user.dueAmount * 100),
      currency: "INR",
      receipt: `rent_${id.slice(-6)}_${Date.now()}`,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

// this api use for payment verify tenant succesfully pay or not
export const verifyPayment = async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const { id } = req.user;

  // console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature);

  let user;
  let pendingMonth;

  try {
    user = await User.findById(id);
    const dueAmountPreserve = user.dueAmount;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    const filterMonth = user.rentHistory.filter(
      (value) => value.paymentStatus === "Unpaid",
    );

    pendingMonth = filterMonth.map((month) => month.month);

    const receiptMonths = filterMonth.map((item) => ({
      month: item.month,
      amount: item.dueAmount,
    }));

    if (generatedSignature !== razorpay_signature) {
      let payment = PaymentHistory.create({
        tenant: id,
        amount: dueAmountPreserve,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        month: pendingMonth,
        status: "Failed",
      });

      return next(new ErrorHandler("payment not verify ", 400));
    }

    // console.log("generatedSignature<<", generatedSignature);

    const paymentMode = await razorpay.payments.fetch(razorpay_payment_id);
    // console.log("paymentMode>>", paymentMode);

    let payment = await PaymentHistory.create({
      tenant: id,
      amount: dueAmountPreserve,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      month: pendingMonth,
      status: "success",
    });

    // console.log("payment>>", payment);

    let receipt = await ReceiptHistory.create({
      tenantId: id,
      paymentId: payment?._id,
      receipt: `rent_${id.slice(-6)}_${Date.now()}`,
      months: receiptMonths,
      totalAmount: user.dueAmount,
      paymentMethod: paymentMode.method,
    });

    // console.log("receipt>>>>", receipt);

    user.paymentStatus = "Paid";
    user.dueAmount = 0;

    // form here to send email its for sending receipt to email

    const receiptData = {
      fullName: user.fullName,
      months: receiptMonths, // in array 2 object month 2026 and amount
      totalAmount: payment.amount,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      roomNumber: user.roomNumber,
      building: user.building,
      paymentDate: new Date(receipt.createdAt),
    };

    let result = null;
    let pdfBuffer;

    try {
      pdfBuffer = await generateReceiptPdf(receiptData);
      console.log("PDF generated successfully");

      result = await uploadPdfToCloudinary(pdfBuffer);
      console.log("Cloudinary upload success:", result);

      receipt.pdf.public_id = result.public_id;
      receipt.pdf.secure_url = result.secure_url;
    } catch (error) {
      console.error("PDF/Cloudinary Error:", error);
    }
    // console.log("result>>>", result);

    // start email
    const email = user.email;
    const subject = "Your This Month Rent reciept ";
    const message = receiptTemplate(receiptData);

    try {
      await sendEmail({
        email,
        subject,
        message,
        pdfBuffer,
      });

      console.log("Receipt email sent successfully");
    } catch (err) {
      console.error("Receipt email failed:", err.message);
    }

    console.log("Email function started");

    // end email

    // updating status in rent history
    // start updating status
    user.rentHistory.forEach((status) => {
      if (status.paymentStatus === "Unpaid" && status.paidOn === null) {
        status.paymentStatus = "Paid";
        status.paidOn = Date.now();
      }
    });
    // end updating status

    await user.save();
    await receipt.save();

    res.status(200).json({
      success: true,
      message: "payment successfully done",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount: payment.amount,
    });
  } catch (error) {
    const payment = PaymentHistory.create({
      tenant: id,
      amount: user.dueAmount,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      month: pendingMonth,
      status: "Failed",
    });
    await user.save();
    return next(new ErrorHandler(error.message, 500));
  }
};

// this api use for every check use is paid or not
export const paymentCheck = async (req, res, next) => {
  const { id } = req.user;

  try {
    const tenant = await User.findById(id);

    // this is for current date month and year
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // here is all month name to help to maintrain a record of paid aur unpaid of each month
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // this is for only first month
    let dateOfJoining = tenant.joiningDate.getDate();
    let monthOfJoining = tenant.joiningDate.getMonth() + 1;
    let yearOfJoining = tenant.joiningDate.getFullYear();

    const monthDifference =
      (currentYear - yearOfJoining) * 12 + (currentMonth - monthOfJoining);

    const nextMonthReached =
      currentYear > yearOfJoining ||
      (currentYear === yearOfJoining && currentMonth > monthOfJoining);

    if (!nextMonthReached) {
      return next(new ErrorHandler("existing month joining", 400));
    }

    if (!tenant.nextRentGeneratedMonth && nextMonthReached) {
      const totalDaysInMonth = new Date(
        yearOfJoining,
        monthOfJoining,
        0,
      ).getDate();

      const remainingDays = totalDaysInMonth - dateOfJoining;
      const calculateDueAmount = Math.round(
        (tenant.rentPrice / totalDaysInMonth) * (remainingDays + 1),
      );
      tenant.dueAmount = Math.round(calculateDueAmount);
      tenant.lastRentAmount = tenant.dueAmount;

      tenant.nextRentGeneratedMonth = `${monthOfJoining === 12 ? yearOfJoining + 1 : yearOfJoining}-${monthOfJoining === 12 ? 1 : monthOfJoining + 1}`;

      tenant.rentHistory.push({
        month: `${monthNames[monthOfJoining - 1]} ${yearOfJoining}`,
        dueAmount: tenant.dueAmount,
        paymentStatus: "Unpaid",
      });

      if (monthDifference >= 2) {
        const everyMonthRent = tenant.rentPrice * (monthDifference - 1);
        tenant.dueAmount = calculateDueAmount + everyMonthRent;

        for (let i = 0; i < monthDifference - 1; i++) {
          let monthIndex = monthOfJoining % 12;

          if (monthOfJoining === 12) {
            monthOfJoining = 0;
            yearOfJoining++;
          }

          tenant.rentHistory.push({
            month: `${monthNames[monthIndex]} ${yearOfJoining}`,
            dueAmount: tenant.rentPrice,
            paymentStatus: "Unpaid",
          });

          tenant.lastRentAmount = tenant.rentPrice;
          monthOfJoining++;
        }

        tenant.nextRentGeneratedMonth = `${yearOfJoining}-${monthOfJoining + 1}`;
      }

      await tenant.save();
      return res.status(200).json({
        success: true,
        message: "tenant due added by joining date successfully",
        tenant,
      });
    }

    // this structure for only lastRentGeneratedMonth

    let [lastRentYear, lastRentMonth] = tenant.nextRentGeneratedMonth
      .split("-")
      .map(Number);

    // this nextMonthReached for lastRentGenerated
    const nextMonthReachedRentGenerated =
      currentYear > lastRentYear ||
      (currentYear === lastRentYear && currentMonth > lastRentMonth);

    if (!nextMonthReachedRentGenerated) {
      return next(new ErrorHandler("existing month for generated month", 400));
    }

    if (tenant.nextRentGeneratedMonth && nextMonthReachedRentGenerated) {
      const monthDifference =
        (currentYear - lastRentYear) * 12 + (currentMonth - lastRentMonth);

      for (let i = 0; i < monthDifference; i++) {
        let monthIndex = (lastRentMonth - 1) % 12;

        tenant.rentHistory.push({
          month: `${monthNames[monthIndex]} ${lastRentYear}`,
          dueAmount: tenant.rentPrice,
          paymentStatus: "Unpaid",
        });
        lastRentMonth++;

        tenant.paymentStatus = "Unpaid";
        tenant.lastRentAmount = tenant.rentPrice;

        if (lastRentMonth > 12) {
          lastRentMonth = 1;
          lastRentYear++;
        }
      }

      const totalRent = monthDifference * tenant.rentPrice;
      tenant.dueAmount += totalRent;
      tenant.nextRentGeneratedMonth = `${currentYear}-${currentMonth}`;
      await tenant.save();
    }

    res.status(200).json({
      success: true,
      message:
        "tenant due added by nextMonthReachedRentGenerated date successfully",
      tenant,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const paymentHistory = async (req, res, next) => {
  const { id } = req.user;

  try {
    const paymentHistoryByUser = await PaymentHistory.find({ tenant: id });
    res.status(200).json({
      success: true,
      message: "here all the payment history",
      paymentHistoryByUser,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
