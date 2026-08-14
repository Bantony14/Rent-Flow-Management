
const otpTemplate = (otp) => {
    return `
    <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <style>
                    @media only screen and (max-width: 600px) {
        .container {
                        width: 100% !important;
        }

                    .content {
                        padding: 24px !important;
        }

                    .heading {
                        font - size: 20px !important;
        }

                    .otp {
                        font - size: 28px !important;
                    letter-spacing: 8px !important;
        }
      }
                </style>
            </head>

            <body style="margin:0; padding:0; background:#f2f2f2; font-family:Arial,sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f2; padding:40px 15px;">
                    <tr>
                        <td align="center">

                            <table
                                class="container"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                style="max-width:520px; background:#ffffff; border-radius:16px; overflow:hidden;"
                            >

                                <tr>
                                    <td style="background:#0f1117; padding:28px 40px; text-align:center;">
                                        <span style="font-size:20px; font-weight:600; color:#ffffff; letter-spacing:1px;">
                                            🔒 Rent Management
                                        </span>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="background:#4f8ef7; height:4px; font-size:0;">&nbsp;</td>
                                </tr>

                                <tr>
                                    <td class="content" style="padding:40px 48px 32px;">

                                        <p style="font-size:12px; color:#999; letter-spacing:2px; text-transform:uppercase; margin:0 0 10px;">
                                            Security Verification
                                        </p>

                                        <h1 class="heading" style="font-size:24px; color:#111; margin:0 0 14px;">
                                            Your One-Time Passcode
                                        </h1>

                                        <p style="font-size:15px; color:#555; line-height:1.7; margin:0 0 28px;">
                                            We received a request to verify your identity.
                                            Use the code below to continue.
                                            Do <strong>not</strong> share this code with anyone.
                                        </p>

                                        <table
                                            width="100%"
                                            cellpadding="0"
                                            cellspacing="0"
                                            style="background:#f7f7f7; border-radius:12px; border:1px solid #e0e0e0;"
                                        >
                                            <tr>
                                                <td style="padding:28px; text-align:center;">

                                                    <p style="font-size:11px; color:#aaa; letter-spacing:2px; text-transform:uppercase; margin:0 0 14px;">
                                                        Verification Code
                                                    </p>

                                                    <p
                                                        class="otp"
                                                        style="
                          font-family:'Courier New',monospace;
                          font-size:40px;
                          font-weight:700;
                          letter-spacing:14px;
                          color:#111;
                          margin:0;
                        "
                                                    >
                                                        ${otp}
                                                    </p>

                                                    <p style="font-size:13px; color:#888; margin:16px 0 0;">
                                                        ⏱ Expires in <strong style="color:#555;">10 minutes</strong>
                                                    </p>

                                                </td>
                                            </tr>
                                        </table>

                                        <table
                                            width="100%"
                                            cellpadding="0"
                                            cellspacing="0"
                                            style="margin:24px 0; background:#fff8ed; border:1px solid #f5c97a; border-radius:8px;"
                                        >
                                            <tr>
                                                <td style="padding:14px 16px; font-size:13px; color:#7a5410; line-height:1.6;">
                                                    ⚠️ If you did not request this code, please ignore this email
                                                    or contact support immediately.
                                                </td>
                                            </tr>
                                        </table>

                                        <p style="font-size:14px; color:#444; line-height:1.7; margin:0;">
                                            Regards,<br />
                                            <strong>The Rent Management Security Team</strong>
                                        </p>

                                    </td>
                                </tr>

                                <tr>
                                    <td
                                        style="
                  border-top:1px solid #eee;
                  padding:18px 48px;
                  text-align:center;
                "
                                    >
                                        <p style="font-size:12px; color:#bbb; margin:0;">
                                            This is an automated email. Please do not reply.
                                        </p>
                                    </td>
                                </tr>

                            </table>

                        </td>
                    </tr>
                </table>
            </body>
        </html>
`;
};

export default otpTemplate;

