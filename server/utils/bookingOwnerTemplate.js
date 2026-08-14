const bookingOwnerTemplate = ({
  userName,
  userEmail,
  userMobile,
  roomName,
  buildingName,
  rent,
  address,
  bookingDate,
}) => {
  const rfLogo = `
    <svg width="46" height="46" viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a6ef5;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0ea5e9;stop-opacity:1" />
        </linearGradient>
        <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0ea5e9" flood-opacity="0.35"/>
        </filter>
      </defs>
      <rect width="46" height="46" rx="11" fill="url(#logoGrad)" filter="url(#logoShadow)"/>
      <text x="23" y="32" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="900" fill="#ffffff" text-anchor="middle">R</text>
    </svg>
  `;

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>

  <body style="
    margin: 0;
    padding: 24px 16px;
    background: #f1f5f9;
    font-family: Arial, Helvetica, sans-serif;
  ">

    <table
      width="794"
      cellpadding="0"
      cellspacing="0"
      align="center"
      style="
        background: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 24px rgba(0,0,0,0.10);
        border: 1px solid #e2e8f0;
        max-width: 794px;
        width: 100%;
      "
    >

      <!-- HEADER -->
      <tr>
        <td style="
          background: linear-gradient(135deg, #1a1f2e 0%, #1e2d45 100%);
          padding: 26px 36px;
        ">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="vertical-align: middle;">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align: middle; padding-right: 13px;">
                      ${rfLogo}
                    </td>
                    <td style="vertical-align: middle;">
                      <div style="line-height: 1;">
                        <span style="font-size: 24px; font-weight: 900; color: #ffffff;">Rent</span><span style="font-size: 24px; font-weight: 900; color: #22d3ee;">Flow</span>
                      </div>
                      <div style="font-size: 10px; color: #94a3b8; letter-spacing: 2px; margin-top: 4px; text-transform: uppercase; font-weight: 600;">Property Management</div>
                    </td>
                  </tr>
                </table>
              </td>

              <td align="right" style="vertical-align: middle;">
                <div style="
                  background: linear-gradient(135deg, #d97706, #f59e0b);
                  display: inline-block;
                  color: #ffffff;
                  padding: 8px 20px;
                  border-radius: 999px;
                  font-size: 11px;
                  font-weight: 800;
                  letter-spacing: 1.2px;
                  text-transform: uppercase;
                  box-shadow: 0 2px 10px rgba(245,158,11,0.4);
                ">🔔 &nbsp;NEW BOOKING</div>
                <div style="margin-top: 8px; color: #64748b; font-size: 11px; text-align: right;">New Booking Request Alert</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Gradient line -->
      <tr>
        <td style="height: 3px; background: linear-gradient(90deg, #2563eb, #22d3ee, #2563eb);"></td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding: 28px 36px 26px;">

          <!-- Greeting -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 22px;">
            <tr>
              <td>
                <div style="font-size: 17px; font-weight: 800; color: #0f172a; margin-bottom: 5px;">
                  New Booking Request!
                </div>
                <div style="font-size: 13px; color: #64748b; line-height: 1.7; max-width: 460px;">
                  You have received a new booking request for <strong style="color: #2563eb;">Room ${roomName}</strong> at <strong style="color: #1e293b;">${buildingName}</strong>. Please review the details below and contact the tenant.
                </div>
              </td>
              <td align="right" style="vertical-align: top;">
                <div style="
                  background: #fffbeb;
                  border: 1px solid #fde68a;
                  border-radius: 10px;
                  padding: 11px 16px;
                  text-align: center;
                  white-space: nowrap;
                ">
                  <div style="font-size: 10px; color: #d97706; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; margin-bottom: 3px;">Requested On</div>
                  <div style="font-size: 13px; font-weight: 700; color: #0f172a;">
                    ${new Date(bookingDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </div>
                </div>
              </td>
            </tr>
          </table>

          <!-- Tenant Contact Details (prominent) -->
          <div style="font-size:10px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:#94a3b8; margin-bottom:8px;">Tenant Contact Information</div>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #2563eb; border-radius:10px; overflow:hidden; margin-bottom:22px;">
            <tr style="background: linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%);">
              <td style="padding:14px 16px; width:30%; font-size:12px; font-weight:700; color:#1e40af; border-bottom:1px solid #bfdbfe;">Full Name</td>
              <td style="padding:14px 16px; font-size:14px; color:#0f172a; font-weight:800; border-bottom:1px solid #bfdbfe;">${userName}</td>
            </tr>
            <tr style="background: linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%);">
              <td style="padding:14px 16px; font-size:12px; font-weight:700; color:#1e40af; border-bottom:1px solid #bfdbfe;">📞 Mobile</td>
              <td style="padding:14px 16px; font-size:14px; font-weight:800; border-bottom:1px solid #bfdbfe;">
                <a href="tel:${userMobile}" style="color:#2563eb; text-decoration:none;">${userMobile}</a>
              </td>
            </tr>
            <tr style="background: linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%);">
              <td style="padding:14px 16px; font-size:12px; font-weight:700; color:#1e40af;">✉️ Email</td>
              <td style="padding:14px 16px; font-size:14px; font-weight:800;">
                <a href="mailto:${userEmail}" style="color:#2563eb; text-decoration:none;">${userEmail}</a>
              </td>
            </tr>
          </table>

          <!-- Room Details + Rent -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 22px;">
            <tr>
              <td style="width: 60%; vertical-align: top; padding-right: 16px;">
                <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: #94a3b8; margin-bottom: 8px;">Room Details</div>
                <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
                  <tr>
                    <td style="background:#f8fafc; padding:9px 12px; width:36%; font-size:12px; font-weight:700; color:#475569; border-bottom:1px solid #e2e8f0;">Room</td>
                    <td style="padding:9px 12px; font-size:12px; color:#1e293b; font-weight:600; border-bottom:1px solid #e2e8f0;">${roomName}</td>
                  </tr>
                  <tr>
                    <td style="background:#f8fafc; padding:9px 12px; font-size:12px; font-weight:700; color:#475569; border-bottom:1px solid #e2e8f0;">Building</td>
                    <td style="padding:9px 12px; font-size:12px; color:#1e293b; font-weight:600; border-bottom:1px solid #e2e8f0;">${buildingName}</td>
                  </tr>
                  <tr>
                    <td style="background:#f8fafc; padding:9px 12px; font-size:12px; font-weight:700; color:#475569;">Address</td>
                    <td style="padding:9px 12px; font-size:12px; color:#1e293b; font-weight:600;">${address || "—"}</td>
                  </tr>
                </table>
              </td>

              <td style="width: 40%; vertical-align: top;">
                <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: #94a3b8; margin-bottom: 8px;">Monthly Rent</div>
                <div style="
                  background: linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%);
                  border: 1.5px solid #bfdbfe;
                  border-radius: 10px;
                  padding: 18px 16px;
                  text-align: center;
                ">
                  <div style="font-size: 11px; color: #6b7280; margin-bottom: 5px; font-weight: 600;">Rent Amount</div>
                  <div style="
                    font-size: 28px;
                    font-weight: 900;
                    background: linear-gradient(90deg, #2563eb, #0891b2);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    line-height: 1;
                  ">Rs.${Number(rent).toLocaleString("en-IN")}</div>
                  <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #bfdbfe;">
                    <span style="background:#dbeafe; color:#1d4ed8; font-size:10px; font-weight:700; padding:3px 10px; border-radius:999px; letter-spacing:0.5px;">
                      PER MONTH
                    </span>
                  </div>
                </div>
              </td>
            </tr>
          </table>

          <!-- Action Notice -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;">
            <tr>
              <td style="
                background:#fffbeb;
                border:1px solid #fde68a;
                border-left:3px solid #f59e0b;
                border-radius:8px;
                padding:10px 14px;
              ">
                <span style="font-size:12px; color:#92400e; line-height:1.6;">
                  ⚡ <strong>Action Required:</strong> Please contact <strong>${userName}</strong> at <strong>${userMobile}</strong> or <strong>${userEmail}</strong> to confirm or discuss the booking for Room ${roomName}.
                </span>
              </td>
            </tr>
          </table>

          <!-- Sign-off -->
          <div style="font-size:13px; color:#374151; line-height:1.7;">
            Regards,<br />
            <strong style="color:#0f172a;">RentFlow System</strong>
          </div>

        </td>
      </tr>

      <!-- Gradient line -->
      <tr>
        <td style="height:2px; background:linear-gradient(90deg,#2563eb,#22d3ee,#2563eb);"></td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background:#1a1f2e; padding:14px 36px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:11px; color:#475569;">
                © ${new Date().getFullYear()} RentFlow. All rights reserved.
              </td>
              <td align="right" style="font-size:11px; color:#475569;">
                Powered by
                <span style="color:#ffffff; font-weight:700;">Rent</span><span style="color:#22d3ee; font-weight:700;">Flow</span>
                &nbsp;·&nbsp; Secure &amp; Verified
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

export default bookingOwnerTemplate;
