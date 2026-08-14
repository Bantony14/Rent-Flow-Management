const receiptTemplate = ({
  fullName,
  months = [],
  totalAmount,
  paymentId,
  orderId,
  roomNumber,
  building,
  paymentDate,
}) => {
  const monthRows = months
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#374151;font-size:13px;">
          ${item.month}
        </td>
        <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;text-align:right;color:#374151;font-size:13px;font-weight:600;">
         Rs.${Number(item.amount).toLocaleString("en-IN")}
        </td>
      </tr>
    `,
    )
    .join("");

  // Logo: blue rounded square with "R" — matches the actual RentFlow brand
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
        <text
          x="23"
          y="32"
          font-family="Arial, Helvetica, sans-serif"
          font-size="24"
          font-weight="900"
          fill="#ffffff"
          text-anchor="middle"
        >R</text>
      </svg>
    `;

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      @media print {
        body { margin: 0; padding: 0; background: #fff; }
        .page { box-shadow: none !important; }
      }
    </style>
  </head>

  <body style="
    margin: 0;
    padding: 24px 16px;
    background: #f1f5f9;
    font-family: Arial, Helvetica, sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  ">

    <table
      class="page"
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

      <!-- ── HEADER ── -->
      <tr>
        <td style="
          background: linear-gradient(135deg, #1a1f2e 0%, #1e2d45 100%);
          padding: 26px 36px;
        ">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>

              <!-- Logo + Wordmark -->
              <td style="vertical-align: middle;">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <!-- Icon: blue rounded R -->
                    <td style="vertical-align: middle; padding-right: 13px;">
                      ${rfLogo}
                    </td>
                    <!-- Text: RentFlow + subtitle -->
                    <td style="vertical-align: middle;">
                      <div style="line-height: 1;">
                        <span style="
                          font-size: 24px;
                          font-weight: 900;
                          color: #ffffff;
                          letter-spacing: 0.2px;
                        ">Rent</span><span style="
                          font-size: 24px;
                          font-weight: 900;
                          color: #22d3ee;
                          letter-spacing: 0.2px;
                        ">Flow</span>
                      </div>
                      <div style="
                        font-size: 10px;
                        color: #94a3b8;
                        letter-spacing: 2px;
                        margin-top: 4px;
                        text-transform: uppercase;
                        font-weight: 600;
                      ">Property Management</div>
                    </td>
                  </tr>
                </table>
              </td>

              <!-- PAID badge + label -->
              <td align="right" style="vertical-align: middle;">
                <div style="
                  background: linear-gradient(135deg, #16a34a, #22c55e);
                  display: inline-block;
                  color: #ffffff;
                  padding: 8px 20px;
                  border-radius: 999px;
                  font-size: 11px;
                  font-weight: 800;
                  letter-spacing: 1.2px;
                  text-transform: uppercase;
                  box-shadow: 0 2px 10px rgba(34,197,94,0.4);
                ">✓ &nbsp;PAYMENT CONFIRMED</div>
                <div style="
                  margin-top: 8px;
                  color: #64748b;
                  font-size: 11px;
                  letter-spacing: 0.5px;
                  text-align: right;
                ">Rent Payment Receipt</div>
              </td>

            </tr>
          </table>
        </td>
      </tr>

      <!-- gradient line -->
      <tr>
        <td style="height: 3px; background: linear-gradient(90deg, #2563eb, #22d3ee, #2563eb);"></td>
      </tr>

      <!-- ── BODY ── -->
      <tr>
        <td style="padding: 28px 36px 26px;">

          <!-- Greeting row -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 22px;">
            <tr>
              <td>
                <div style="font-size: 17px; font-weight: 800; color: #0f172a; margin-bottom: 5px;">
                  Payment Successful
                </div>
                <div style="font-size: 13px; color: #64748b; line-height: 1.7; max-width: 460px;">
                  Hello <strong style="color: #1e293b;">${fullName}</strong>, your rent payment has been received and processed successfully. This receipt serves as your official proof of payment.
                </div>
              </td>
              <td align="right" style="vertical-align: top;">
                <div style="
                  background: #f0fdf4;
                  border: 1px solid #bbf7d0;
                  border-radius: 10px;
                  padding: 11px 16px;
                  text-align: center;
                  white-space: nowrap;
                ">
                  <div style="font-size: 10px; color: #16a34a; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; margin-bottom: 3px;">Date Paid</div>
                  <div style="font-size: 13px; font-weight: 700; color: #0f172a;">
                    ${new Date(paymentDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </div>
                </div>
              </td>
            </tr>
          </table>

          <!-- Two columns: Tenant Info | Total Amount -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 22px;">
            <tr>

              <!-- Tenant Info -->
              <td style="width: 60%; vertical-align: top; padding-right: 16px;">
                <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: #94a3b8; margin-bottom: 8px;">Tenant Information</div>
                <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
                  <tr>
                    <td style="background:#f8fafc; padding:9px 12px; width:36%; font-size:12px; font-weight:700; color:#475569; border-bottom:1px solid #e2e8f0;">Full Name</td>
                    <td style="padding:9px 12px; font-size:12px; color:#1e293b; font-weight:600; border-bottom:1px solid #e2e8f0;">${fullName}</td>
                  </tr>
                  <tr>
                    <td style="background:#f8fafc; padding:9px 12px; font-size:12px; font-weight:700; color:#475569; border-bottom:1px solid #e2e8f0;">Building</td>
                    <td style="padding:9px 12px; font-size:12px; color:#1e293b; font-weight:600; border-bottom:1px solid #e2e8f0;">${building}</td>
                  </tr>
                  <tr>
                    <td style="background:#f8fafc; padding:9px 12px; font-size:12px; font-weight:700; color:#475569;">Room No.</td>
                    <td style="padding:9px 12px; font-size:12px; color:#1e293b; font-weight:600;">${roomNumber}</td>
                  </tr>
                </table>
              </td>

              <!-- Total Amount -->
              <td style="width: 40%; vertical-align: top;">
                <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: #94a3b8; margin-bottom: 8px;">Total Paid</div>
                <div style="
                  background: linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%);
                  border: 1.5px solid #bfdbfe;
                  border-radius: 10px;
                  padding: 18px 16px;
                  text-align: center;
                ">
                  <div style="font-size: 11px; color: #6b7280; margin-bottom: 5px; font-weight: 600; letter-spacing: 0.3px;">Amount Paid</div>
                  <div style="
                    font-size: 28px;
                    font-weight: 900;
                    background: linear-gradient(90deg, #2563eb, #0891b2);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    line-height: 1;
                  ">Rs.${Number(totalAmount).toLocaleString("en-IN")}</div>
                  <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #bfdbfe;">
                    <span style="background:#dbeafe; color:#1d4ed8; font-size:10px; font-weight:700; padding:3px 10px; border-radius:999px; letter-spacing:0.5px;">
                      ${months.length} MONTH${months.length > 1 ? "S" : ""}
                    </span>
                  </div>
                </div>
              </td>

            </tr>
          </table>

          <!-- Payment Breakdown -->
          <div style="font-size:10px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:#94a3b8; margin-bottom:8px;">Payment Breakdown</div>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0; border-radius:10px; overflow:hidden; margin-bottom:20px;">
            <tr style="background: linear-gradient(90deg, #2563eb, #0891b2);">
              <th align="left" style="padding:11px 14px; font-size:11px; font-weight:700; color:#fff; letter-spacing:0.8px; text-transform:uppercase;">Month</th>
              <th align="right" style="padding:11px 14px; font-size:11px; font-weight:700; color:#fff; letter-spacing:0.8px; text-transform:uppercase;">Amount</th>
            </tr>
            ${monthRows}
            <tr style="background:#f8fafc;">
              <td style="padding:11px 14px; font-size:13px; font-weight:700; color:#1e293b; border-top:2px solid #e2e8f0;">Total</td>
              <td style="padding:11px 14px; text-align:right; font-size:14px; font-weight:900; color:#2563eb; border-top:2px solid #e2e8f0;">
                Rs.${Number(totalAmount).toLocaleString("en-IN")}
              </td>
            </tr>
          </table>

          <!-- Transaction Reference -->
          <div style="font-size:10px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:#94a3b8; margin-bottom:8px;">Transaction Reference</div>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0; border-radius:10px; overflow:hidden; margin-bottom:22px;">
            <tr>
              <td style="background:#f8fafc; padding:9px 14px; width:24%; font-size:11px; font-weight:700; color:#475569; border-bottom:1px solid #e2e8f0; white-space:nowrap;">Payment ID</td>
              <td style="padding:9px 14px; font-size:11px; color:#1e293b; word-break:break-all; border-bottom:1px solid #e2e8f0; font-family:'Courier New',monospace;">${paymentId}</td>
            </tr>
            <tr>
              <td style="background:#f8fafc; padding:9px 14px; font-size:11px; font-weight:700; color:#475569; white-space:nowrap;">Order ID</td>
              <td style="padding:9px 14px; font-size:11px; color:#1e293b; word-break:break-all; font-family:'Courier New',monospace;">${orderId}</td>
            </tr>
          </table>

          <!-- Notice bar -->
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
                  📌 This is a system-generated receipt and does not require a physical signature. Please retain this document as proof of payment.
                </span>
              </td>
            </tr>
          </table>

          <!-- Sign-off -->
          <div style="font-size:13px; color:#374151; line-height:1.7;">
            Regards,<br />
            <strong style="color:#0f172a;">RentFlow Team</strong>
          </div>

        </td>
      </tr>

      <!-- gradient line -->
      <tr>
        <td style="height:2px; background:linear-gradient(90deg,#2563eb,#22d3ee,#2563eb);"></td>
      </tr>

      <!-- ── FOOTER ── -->
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

export default receiptTemplate;
