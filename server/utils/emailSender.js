import axios from "axios";
import { config } from "dotenv";

config();

const sendEmail = async ({ email, subject, message, pdfBuffer }) => {
  try {
    const payload = {
      sender: {
        name: "Rent Management App",
        email: process.env.SMTP_EMAIL,
      },
      to: [
        {
          email,
        },
      ],
      subject,
      htmlContent: message,
    };

    // Attach PDF if available
    if (pdfBuffer) {
      const base64Pdf = Buffer.from(pdfBuffer).toString("base64");
      payload.attachment = [
        {
          name: "receipt.pdf",
          content: base64Pdf,
        },
      ];
      console.log("Is Buffer:", Buffer.isBuffer(pdfBuffer));
      console.log("Type:", typeof pdfBuffer);
      console.log("Length:", pdfBuffer?.length);

      console.log("Attachment:", payload.attachment);

      console.log("Payload:", JSON.stringify(payload, null, 2));
    }

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      payload,
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
      },
    );

    console.log("✅ Email sent:", response.data);
    return response.data;
  } catch (error) {
    console.error(error.response?.data);
    console.error(error.response?.status);
    console.error("❌ Brevo Error:", error.response?.data || error.message);

    throw error;
  }
};

export default sendEmail;
