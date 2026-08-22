import cloudinary from "../config/cloudinary.connect.js";
import User from "../models/user.model.js";
import decrypt from "../utils/decrypt.js";
import sendEmail from "../utils/emailSender.js";
import ErrorHandler from "../utils/error.js";
import otpGenerator from "../utils/otpGenerator.js";
import fs from "fs/promises";
import otpTemplate from "../utils/optTemplate.js";
import Room from "../models/room.model.js";
import ReceiptHistory from "../models/receiptHistory.model.js";
import PaymentHistory from "../models/paymentHistory.model.js";

export const userRegistration = async (req, res, next) => {
  const {
    fullName,
    aadhaarNumber,
    mobileNumber,
    dob,
    password,
    roomNumber,
    building,
    email,
    rentPrice,
    joiningDate,
  } = req.body;
  const { profileImage, aadhaarFront, aadhaarBack } = req.files;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=[\]{};':"\\|,.<>/?`~])[A-Za-z\d@$!%*?&^#()_+\-=[\]{};':"\\|,.<>/?`~]{8,}$/;

  if (!passwordRegex.test(password)) {
    return next(
      new ErrorHandler(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        400,
      ),
    );
  }

  if (req.body.role) {
    return next(new ErrorHandler("cannot enter role field", 400));
  }
  if (
    !fullName ||
    !email ||
    !aadhaarNumber ||
    !mobileNumber ||
    !dob ||
    !password ||
    !roomNumber ||
    !building ||
    !rentPrice ||
    !joiningDate ||
    !profileImage ||
    !aadhaarFront ||
    !aadhaarBack
  ) {
    return next(new ErrorHandler("all filed is required", 400));
  }

  let profileResult;
  let aadhaarFrontResult;
  let aadhaarBackResult;

  if (req.files) {
    try {
      [profileResult, aadhaarFrontResult, aadhaarBackResult] =
        await Promise.all([
          cloudinary.uploader.upload(req.files.profileImage[0].path, {
            folder: "rentflow/profile",
          }),
          cloudinary.uploader.upload(req.files.aadhaarFront[0].path, {
            folder: "rentflow/aadhaar",
            type: "private",
          }),
          cloudinary.uploader.upload(req.files.aadhaarBack[0].path, {
            folder: "rentflow/aadhaar",
            type: "private",
          }),
        ]);

      await fs.unlink(req.files.profileImage[0].path);
      await fs.unlink(req.files.aadhaarFront[0].path);
      await fs.unlink(req.files.aadhaarBack[0].path);
    } catch (err) {}
  }

  try {
    const user = await User.create({
      fullName,
      aadhaarNumber,
      mobileNumber,
      dob,
      password,
      roomNumber,
      building,
      email,
      rentPrice,
      joiningDate,
      profileImage: {
        public_id: profileResult.public_id,
        secure_url: profileResult.secure_url,
        imageFormat: profileResult.format,
      },
      aadhaarFront: {
        public_id: aadhaarFrontResult.public_id,
        imageFormat: aadhaarFrontResult.format,
      },
      aadhaarBack: {
        public_id: aadhaarBackResult.public_id,
        imageFormat: aadhaarBackResult.format,
      },
    });

    if (!user) {
      return next(
        new ErrorHandler("Account not created please try again", 400),
      );
    }
    user.password = undefined;

    const roomAvailabilityUpdate = await Room.findOne({
      buildingName: building,
      room: roomNumber,
    });

    if (roomAvailabilityUpdate) {
      roomAvailabilityUpdate.Avaliablity = false;
      roomAvailabilityUpdate.tenantsId.push(user._id);
      await roomAvailabilityUpdate.save();
    }

    res.status(200).json({
      success: true,
      message: "User Registered successfully",
      user,
    });
  } catch (error) {
    await fs.unlink(req?.files?.profileImage?.[0]?.path).catch(() => {});
    await fs.unlink(req?.files?.aadhaarFront?.[0]?.path).catch(() => {});
    await fs.unlink(req?.files?.aadhaarBack?.[0]?.path).catch(() => {});

    if (error.code === 11000) {
      let field = Object.keys(error.keyValue)[0];
      if (field === "hashAadhaar") {
        field = "Aadhaar";
      }
      return next(new ErrorHandler(`${field} already exists`, 400));
    }

    return next(new ErrorHandler(error.message, 500));
  }
};

export const userUpdate = async (req, res, next) => {
  const allowedFiled = [
    "fullName",
    "aadhaarNumber",
    "mobileNumber",
    "dob",
    "password",
    "roomNumber",
    "building",
    "email",
    "paymentStatus",
    "dueAmount",
    "joiningDate",
    "rentPrice",
    "nextRentMonthGenerated",
    "aadhaarFront",
    "aadhaarBack",
  ];

  const { id } = req.params;

  const validation = Object.keys(req.body);

  const notAllowedFiled = validation.filter(
    (value) => !allowedFiled.includes(value),
  );

  if (notAllowedFiled.length > 0) {
    return next(
      new ErrorHandler(
        `You cannot changes this filed ${notAllowedFiled.join(" and ")}`,
      ),
    );
  }

  const filter = {};

  allowedFiled.map((value) => {
    if (req.body[value]) {
      filter[value] = req.body[value];
    }
  });

  const forNoChanges = Object.keys(req.body).length === 0;

  if (forNoChanges && Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("There is no changes in your data"));
  }

  const filterValueForMessage = Object.keys(filter).join(" and ");

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=[\]{};':"\\|,.<>/?`~])[A-Za-z\d@$!%*?&^#()_+\-=[\]{};':"\\|,.<>/?`~]{8,}$/;
  if (req.body.password && !passwordRegex.test(req?.body?.password)) {
    return next(
      new ErrorHandler(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        400,
      ),
    );
  }
  try {
    const user = await User.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!user) {
      return next(new ErrorHandler("user Not found", 400));
    }

    if (req.body.properties) {
      user.properties.push(req.body.properties);
    }

    if (req.files && Object.keys(req.files).length > 0) {
      try {
        if (req.files?.profileImage) {
          await cloudinary.uploader.destroy(user.profileImage.public_id);
          const profileImageResult = await cloudinary.uploader.upload(
            req.files.profileImage[0].path,
            {
              folder: "rentflow/aadhaar",
            },
          );

          if (profileImageResult) {
            user.profileImage.public_id = profileImageResult.public_id;
            user.profileImage.secure_url = profileImageResult.secure_url;
          }
          await fs.unlink(req.files.profileImage[0].path);
        }
        if (req.files?.aadhaarFront) {
          await cloudinary.uploader.destroy(user.aadhaarFront.public_id);
          const aadhaarFrontResult = await cloudinary.uploader.upload(
            req.files.aadhaarFront[0].path,
            {
              folder: "rentflow/aadhaar",
              type: "private",
            },
          );

          if (aadhaarFrontResult) {
            user.aadhaarFront.public_id = aadhaarFrontResult.public_id;
          }
          await fs.unlink(req.files.aadhaarFront[0].path);
        }
        if (req.files?.aadhaarBack) {
          await cloudinary.uploader.destroy(user.aadhaarBack.public_id);
          const aadhaarBackResult = await cloudinary.uploader.upload(
            req.files.aadhaarBack[0].path,
            {
              folder: "rentflow/aadhaar",
              type: "private",
            },
          );

          if (aadhaarBackResult) {
            user.aadhaarBack.public_id = aadhaarBackResult.public_id;
          }
          await fs.unlink(req.files.aadhaarBack[0].path);
        }
      } catch (err) {}
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${filterValueForMessage} updated successfully `,
      user,
    });
  } catch (error) {
    await fs.unlink(req?.files?.profileImage?.[0]?.path).catch(() => {});
    await fs.unlink(req?.files?.aadhaarFront?.[0]?.path).catch(() => {});
    await fs.unlink(req?.files?.aadhaarBack?.[0]?.path).catch(() => {});

    if (error.code === 11000) {
      let field = Object.keys(error.keyValue)[0];
      if (field === "hashAadhaar") {
        field = "Aadhaar";
      }
      return next(new ErrorHandler(`${field} already exists`, 400));
    }
    return next(new ErrorHandler(error.message, 500));
  }
};

export const userDelete = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    user.leavingDate = Date.now();
    user.isActive = false;

    // update room availability
    const userRoomDetails = {
      buildingName: user.building,
      room: user.roomNumber,
    };
    const room = await Room.findOne(userRoomDetails);
    room.Avaliablity = true;
    await room.save();
    await user.save();
    res.status(200).json({
      success: true,
      message: `User Delete SuccessFully`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const getAllUser = async (req, res, next) => {
  const filter = { isActive: true };

  if (req.query.building) {
    filter.building = req.query.building;
  }
  if (req.query.paymentStatus) {
    filter.paymentStatus = req.query.paymentStatus;
  }
  try {
    const user = await User.find(filter);
    res.status(200).json({
      success: true,
      message: `Here your all data by ${!Object.keys(filter).join("") ? " tenants" : Object.keys(filter).join(" and ")}`,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

export const getOneUser = async (req, res, next) => {
  try {
    const field = Object.keys(req.body).join("");

    let user;

    if (field === "_id") {
      user = await User.findById(req.body._id);
    } else {
      user = await User.findOne({
        [field]: { $regex: req.body[field], $options: "i" },
      });
    }

    if (!user) {
      return next(
        new ErrorHandler(
          `No tenant found with ${field}: ${req.body[field]}`,
          404,
        ),
      );
    }

    const encryptedValue = decrypt(user.aadhaarNumber);
    user.aadhaarNumber = encryptedValue;

    res.status(200).json({
      success: true,
      message: `Matching tenant records found for ${field}.`,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return next(new ErrorHandler("user not found", 500));
    }

    // this is for user aadhaarNumber
    const encryptedValue = decrypt(user.aadhaarNumber);
    user.aadhaarNumber = encryptedValue;

    // this is for user member aadhaarNumber
    user.member.forEach(
      (value) => (value.aadhaarNumber = decrypt(value.aadhaarNumber)),
    );

    res.status(200).json({
      success: true,
      message: "here is your user data",
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

export const getAllUserByBuilding = async (req, res, next) => {
  const { building, roomNumber } = req.query;

  const filter = {};
  if (building) {
    ((filter.buildingName = building), (filter.Avaliablity = true));
  }
  if (roomNumber) {
    filter.room = roomNumber;
  }

  try {
    const building = await Room.find(filter);

    if (building.length === 0) {
      return;
    }

    res.status(200).json({
      success: true,
      message: "here your rooms",
      building,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

export const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("all filed is required", 400));
  }
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("user not found", 400));
    }
    if (!(await user.comparePassword(password))) {
      return next(
        new ErrorHandler("user password not match please try again", 400),
      );
    }

    const token = user.jwtToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    user.password = undefined;

    const encryptedValue = decrypt(user.aadhaarNumber);
    user.aadhaarNumber = encryptedValue;

    user.member.forEach(
      (value) => (value.aadhaarNumber = decrypt(value.aadhaarNumber)),
    );

    res.status(200).json({
      success: true,
      message: "user login successfully",
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

export const userLogout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      expires: new Date(0),
    });
    res.status(200).json({
      success: true,
      message: "user logout successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

// This work only for sending otp to email with all thing to do about otp
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  const otp = otpGenerator();

  try {
    const user = await User.findOne({ email, isActive: true });

    if (!user) {
      return next(
        new ErrorHandler("user not found please enter different email", 400),
      );
    }
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    const subject = "THIS IS FOR RESET YOUR PASSWORD";
    const message = otpTemplate(otp);

    await user.save();

    try {
      await sendEmail({ email, subject, message });
    } catch (error) {
      console.log(error);
    }

    res.status(200).json({
      success: true,
      message: "otp send to your registered email address",
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return next(new ErrorHandler("Email and OTP are required", 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return next(new ErrorHandler("Invalid or expired OTP", 400));
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const { email, otp, newPassword, confirmPassword } = req.body;

  if (!email || !otp || !newPassword || !confirmPassword) {
    return next(new ErrorHandler("all filed required", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(
      new ErrorHandler(
        "newPassword and confirmPassword not match please check it",
        400,
      ),
    );
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (await user.comparePassword(newPassword)) {
      return next(
        new ErrorHandler("please do'nt enter previous password", 400),
      );
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return next(new ErrorHandler("invalid or expired otp", 400));
    }

    user.password = newPassword;
    await user.save();

    user.password = undefined;

    res.status(200).json({
      success: true,
      message:
        "your password has been updated successfully please login with the new password",
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

export const addMember = async (req, res, next) => {
  const { id } = req.params;
  const members = [req.body];

  // find all tenants for checking member aadhaar
  const allTenants = await User.find({});

  //  checking existing addhar in member info
  for (let details of allTenants) {
    for (let member of details.member || []) {
      for (let i = 0; i < members.length; i++) {
        if (members[i].aadhaarNumber === decrypt(member.aadhaarNumber)) {
          return next(new ErrorHandler("aadhaarNumber already Exist"));
        }
      }
    }
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    if (members.length !== req.files.profileImage.length) {
      return next(new ErrorHandler("Members and images count mismatch"));
    }

    try {
      if (req.files) {
        if (
          !req.files.profileImage ||
          !req.files.aadhaarFront ||
          !req.files.aadhaarBack
        ) {
          return next(new ErrorHandler("all image required", 400));
        }

        for (let i = 0; i < members.length; i++) {
          const [profileResult, aadhaarFrontResult, aadhaarBackResult] =
            await Promise.all([
              cloudinary.uploader.upload(req.files.profileImage[i].path, {
                folder: "rent/member/profile",
              }),

              cloudinary.uploader.upload(req.files.aadhaarFront[i].path, {
                folder: "rent/member/profile",
                type: "private",
              }),

              cloudinary.uploader.upload(req.files.aadhaarBack[i].path, {
                folder: "rent/member/profile",
                type: "private",
              }),
            ]);
          await fs.unlink(req.files.profileImage[i].path);
          await fs.unlink(req.files.aadhaarFront[i].path);
          await fs.unlink(req.files.aadhaarBack[i].path);

          if (profileResult) {
            members[i].profileImage = {
              public_id: profileResult.public_id,
              secure_url: profileResult.secure_url,
              imageFormat: profileResult.format,
            };
          }

          if (aadhaarFrontResult) {
            members[i].aadhaarFront = {
              public_id: aadhaarFrontResult.public_id,
              imageFormat: aadhaarFrontResult.format,
            };
          }

          if (aadhaarBackResult) {
            members[i].aadhaarBack = {
              public_id: aadhaarBackResult.public_id,
              imageFormat: aadhaarBackResult.format,
            };
          }
        }
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }

    await user.member.push(...members);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Member added successfully",
      member: user.member,
    });
  } catch (error) {
    for (let i = 0; i < members.length; i++) {
      if (req.files.profileImage?.[i]?.path) {
        await fs.unlink(req.files.profileImage[i].path).catch(() => {});
      }

      if (req.files.aadhaarFront?.[i]?.path) {
        await fs.unlink(req.files.aadhaarFront[i].path).catch(() => {});
      }

      if (req.files.aadhaarBack?.[i]?.path) {
        await fs.unlink(req.files.aadhaarBack[i].path).catch(() => {});
      }
    }

    return next(new ErrorHandler(error.message, 500));
  }
};

export const removeMember = async (req, res, next) => {
  const id = req.params.id;
  const memberId = req.params.memberid;
  try {
    const user = await User.findById(id);
    const removedUserInfo = user.member.find(
      (member) => member._id.toString() === memberId,
    );

    if (!removedUserInfo) {
      return next(new ErrorHandler("member not found", 400));
    }

    if (removedUserInfo) {
      removedUserInfo.isActive = false;
    }

    await user.save();
    res.status(200).json({
      success: true,
      message: "member remove succesfully",
      removedUserInfo,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

export const updateMemberInfo = async (req, res, next) => {
  const { name, aadhaarNumber, dob } = req.body;
  const id = req.params.id;
  const memberId = req.params.memberid;

  try {
    const user = await User.findById(id);

    const findMember = user.member.find(
      (member) => member._id.toString() === memberId,
    );

    if (!findMember) {
      return next(new ErrorHandler("member not found", 400));
    }

    if (name) {
      findMember.name = name;
    }

    if (dob) {
      findMember.dob = dob;
    }

    // find all tenants for checking member aadhaar
    const allTenants = await User.find({});
    if (aadhaarNumber) {
      //  checking existing addhar in member info
      for (let details of allTenants) {
        for (let member of details.member || []) {
          if (aadhaarNumber === decrypt(member.aadhaarNumber)) {
            return next(new ErrorHandler("aadhaarNumber already Exist"));
          }
        }
      }
      findMember.aadhaarNumber = aadhaarNumber;
      findMember.hashAadhaar = undefined;
    }

    // image update process

    if (req.files && Object.keys(req.files).length > 0) {
      try {
        if (req.files?.profileImage) {
          await cloudinary.uploader.destroy(findMember.profileImage.public_id);
          const profileImageResult = await cloudinary.uploader.upload(
            req.files.profileImage[0].path,
            {
              folder: "rent/member/profile",
            },
          );

          if (profileImageResult) {
            findMember.profileImage.public_id = profileImageResult.public_id;
            findMember.profileImage.secure_url = profileImageResult.secure_url;
            findMember.profileImage.imageFormat = profileImageResult.format;
          }
          await fs.unlink(req.files.profileImage[0].path);
        }
        if (req.files?.aadhaarFront) {
          await cloudinary.uploader.destroy(findMember.aadhaarFront.public_id);
          const aadhaarFrontResult = await cloudinary.uploader.upload(
            req.files.aadhaarFront[0].path,
            {
              folder: "rent/member/profile",
              type: "private",
            },
          );

          if (aadhaarFrontResult) {
            findMember.aadhaarFront.public_id = aadhaarFrontResult.public_id;
            findMember.aadhaarFront.imageFormat = aadhaarFrontResult.format;
          }
          await fs.unlink(req.files.aadhaarFront[0].path);
        }
        if (req.files?.aadhaarBack) {
          await cloudinary.uploader.destroy(findMember.aadhaarBack.public_id);
          const aadhaarBackResult = await cloudinary.uploader.upload(
            req.files.aadhaarBack[0].path,
            {
              folder: "rent/member/profile",
              type: "private",
            },
          );

          if (aadhaarBackResult) {
            findMember.aadhaarBack.public_id = aadhaarBackResult.public_id;
            findMember.imageFormat = aadhaarBackResult.format;
          }
          await fs.unlink(req.files.aadhaarBack[0].path);
        }
      } catch (err) {}
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "member info updated",
      findMember,
    });
  } catch (error) {
    await fs.unlink(req?.files?.profileImage?.[0]?.path).catch(() => {});
    await fs.unlink(req?.files?.aadhaarFront?.[0]?.path).catch(() => {});
    await fs.unlink(req?.files?.aadhaarBack?.[0]?.path).catch(() => {});
    return next(new ErrorHandler(error.message, 400));
  }
};

export const getReceiptById = async (req, res, next) => {
  try {
    const { id } = req.user;

    const receipt = await ReceiptHistory.find({ tenantId: id });

    if (!receipt) {
      return next(new ErrorHandler("Receipt not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "get all receipts",
      receipt,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const getAadhaarImage = async (req, res, next) => {
  try {
    const { id } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const aadhaarFrontUrl = cloudinary.utils.private_download_url(
      user.aadhaarFront.public_id,
      user.aadhaarFront.format,
      {
        resource_type: "image",
      },
    );

    const aadhaarBackUrl = cloudinary.utils.private_download_url(
      user.aadhaarBack.public_id,
      user.aadhaarBack.format,
      {
        resource_type: "image",
      },
    );

    return res.status(200).json({
      success: true,
      aadhaarFrontUrl,
      aadhaarBackUrl,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const getAadhaarImageForMember = async (req, res, next) => {
  try {
    const { userId, memberId } = req.body;

    const user = await User.findById(userId);

    const findMember = user.member.find(
      (member) => member._id.toString() === memberId,
    );

    if (!findMember) {
      return next(new ErrorHandler("User not found", 404));
    }

    const aadhaarFrontUrl = cloudinary.utils.private_download_url(
      findMember.aadhaarFront.public_id,
      findMember.aadhaarFront.format,
      {
        resource_type: "image",
      },
    );

    const aadhaarBackUrl = cloudinary.utils.private_download_url(
      findMember.aadhaarBack.public_id,
      findMember.aadhaarBack.format,
      {
        resource_type: "image",
      },
    );

    return res.status(200).json({
      success: true,
      aadhaarFrontUrl,
      aadhaarBackUrl,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const getMe = async (req, res, next) => {
  const { id } = req.user;

  try {
    const user = await User.findById(id);

    if (!user) {
      return next(new ErrorHandler("user Not Found", 400));
    }

    const encryptedValue = decrypt(user.aadhaarNumber);
    user.aadhaarNumber = encryptedValue;

    user.member.forEach(
      (value) => (value.aadhaarNumber = decrypt(value.aadhaarNumber)),
    );

    res.status(200).json({
      success: true,
      message: "Here your information",
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

//  this api is for reset user few data after payment

export const resetUserRentData = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check user exists
    const user = await User.findById(id);

    if (!user) {
      return next(new ErrorHandler("user not found", 404));
    }

    // Reset user's rent data
    user.nextRentGeneratedMonth = "";
    user.paymentStatus = "Unpaid";
    user.dueAmount = 0;
    user.lastRentAmount = 0;
    user.rentHistory = [];
    user.countNumberOftry = user.countNumberOftry + 1;

    await user.save();

    // Delete receipt history of this tenant
    await ReceiptHistory.deleteMany({
      tenantId: id,
    });

    // Delete payment history of this tenant
    await PaymentHistory.deleteMany({
      tenant: id,
    });

    res.status(200).json({
      success: true,
      message: "User rent data and payment history reset successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};
