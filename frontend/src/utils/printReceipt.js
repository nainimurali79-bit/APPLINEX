/**
 * APPLINEX Official Receipt & Tax Invoice Single-Page Print Utility
 * Creates an isolated, clean print frame to ensure exactly 1 single page in Print / Save PDF.
 */

export const printReceipt = (receiptData) => {
  if (!receiptData) return;

  const {
    receipt_number = 'REC-2026-0001',
    transaction_reference = 'TXN-APX-LIVE',
    date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    status = 'completed',
    payment_method = 'Online / UPI / Card',
    customer = {},
    rental = {},
    financial_breakdown = {},
    organization = {}
  } = receiptData;

  const orgName = organization.name || 'APPLINEX Technologies Inc.';
  const orgGstin = organization.gstin || '29ABCDE1234F1Z5';
  const orgSupport = organization.support_email || 'support@applinex.com';
  const orgWebsite = organization.website || 'https://applinex.com';

  const customerName = customer.name || 'Valued Customer';
  const customerEmail = customer.email || 'customer@applinex.com';
  const customerPhone = customer.phone || 'Contact on record';
  const customerAddress = customer.address || 'Delivery Address on Record';
  const customerCity = customer.city || 'Bangalore';

  const applianceName = rental.appliance_name || 'Smart Household Appliance';
  const applianceBrand = rental.brand || 'Verified OEM';
  const rentalId = rental.rental_id || 'RN-2026-LIVE';
  const durationMonths = rental.duration_months || financial_breakdown.duration_months || 1;

  const monthlyRate = parseFloat(financial_breakdown.monthly_rate || 0);
  const subtotal = parseFloat(financial_breakdown.subtotal || monthlyRate * durationMonths);
  const deliveryFee = parseFloat(financial_breakdown.delivery_fee || 0);
  const securityDeposit = parseFloat(financial_breakdown.security_deposit || 1000);
  const totalAmount = parseFloat(financial_breakdown.total_amount || (subtotal + deliveryFee + securityDeposit));

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Receipt - ${receipt_number}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0F172A;
      background: #FFFFFF;
      font-size: 11pt;
      line-height: 1.4;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .receipt-container {
      width: 100%;
      max-width: 720px;
      margin: 0 auto;
      padding: 16px 20px;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0F223D;
      padding-bottom: 14px;
      margin-bottom: 14px;
    }
    .brand-title {
      font-size: 20pt;
      font-weight: 800;
      color: #0F223D;
      letter-spacing: 0.05em;
    }
    .brand-sub {
      font-size: 8.5pt;
      color: #475569;
      margin-top: 2px;
    }
    .brand-meta {
      font-size: 8pt;
      color: #64748B;
      margin-top: 3px;
    }
    .receipt-badge {
      text-align: right;
    }
    .receipt-title {
      font-size: 13pt;
      font-weight: 800;
      color: #1E60D5;
      letter-spacing: 0.02em;
    }
    .receipt-no {
      font-size: 9.5pt;
      font-weight: 700;
      color: #0F172A;
      margin-top: 2px;
    }
    .receipt-date {
      font-size: 8pt;
      color: #64748B;
      margin-top: 2px;
    }
    .status-pill {
      display: inline-block;
      margin-top: 4px;
      padding: 2px 8px;
      background-color: #ECFDF5;
      color: #047857;
      border: 1px solid #A7F3D0;
      border-radius: 9999px;
      font-size: 7.5pt;
      font-weight: 700;
      text-transform: uppercase;
    }
    .two-col {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      background-color: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 14px;
    }
    .col {
      flex: 1;
    }
    .col-title {
      font-size: 7.5pt;
      font-weight: 700;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 4px;
    }
    .col-name {
      font-size: 10pt;
      font-weight: 700;
      color: #0F172A;
    }
    .col-text {
      font-size: 8.5pt;
      color: #475569;
      margin-top: 2px;
    }
    .table-section {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
    }
    .table-section th {
      background-color: #0F223D;
      color: #FFFFFF;
      text-align: left;
      font-size: 8pt;
      font-weight: 700;
      padding: 7px 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .table-section td {
      padding: 8px 10px;
      border-bottom: 1px solid #E2E8F0;
      font-size: 9pt;
      color: #1E293B;
    }
    .table-section tr:nth-child(even) {
      background-color: #F8FAFC;
    }
    .text-right {
      text-align: right;
    }
    .text-center {
      text-align: center;
    }
    .summary-box {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 14px;
    }
    .summary-table {
      width: 280px;
      font-size: 8.5pt;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      color: #475569;
    }
    .summary-total {
      display: flex;
      justify-content: space-between;
      padding: 6px 0 2px 0;
      border-top: 2px solid #0F223D;
      margin-top: 4px;
      font-size: 11.5pt;
      font-weight: 800;
      color: #0F223D;
    }
    .summary-total span.amount {
      color: #059669;
    }
    .security-notice {
      display: flex;
      align-items: center;
      gap: 10px;
      background-color: #EFF6FF;
      border: 1px solid #BFDBFE;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 12px;
      font-size: 8pt;
      color: #1E40AF;
    }
    .footer {
      border-top: 1px dashed #CBD5E1;
      padding-top: 10px;
      text-align: center;
      font-size: 7.5pt;
      color: #64748B;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    
    <!-- Header -->
    <div class="header">
      <div>
        <div class="brand-title">APPLINEX</div>
        <div class="brand-sub">Smart Living Ecosystem & Appliance Subscriptions</div>
        <div class="brand-meta">GSTIN: ${orgGstin} • Support: ${orgSupport}</div>
      </div>
      <div class="receipt-badge">
        <div class="receipt-title">PAYMENT RECEIPT</div>
        <div class="receipt-no">${receipt_number}</div>
        <div class="receipt-date">${date}</div>
        <div class="status-pill">${status.toUpperCase()}</div>
      </div>
    </div>

    <!-- Bill To & Order Info -->
    <div class="two-col">
      <div class="col">
        <div class="col-title">Customer / Billed To</div>
        <div class="col-name">${customerName}</div>
        <div class="col-text">${customerEmail}</div>
        <div class="col-text">${customerAddress}, ${customerCity}</div>
        <div class="col-text">Phone: ${customerPhone}</div>
      </div>
      <div class="col">
        <div class="col-title">Tenure & Transaction Details</div>
        <div class="col-name">Rental ID: ${rentalId}</div>
        <div class="col-text"><strong>Duration:</strong> ${durationMonths} Month(s)</div>
        <div class="col-text"><strong>Payment Method:</strong> ${payment_method}</div>
        <div class="col-text"><strong>TXN Ref:</strong> ${transaction_reference}</div>
      </div>
    </div>

    <!-- Items Breakdown -->
    <table class="table-section">
      <thead>
        <tr>
          <th>Description</th>
          <th class="text-center" style="width: 70px;">Tenure</th>
          <th class="text-right" style="width: 100px;">Rate / Mo</th>
          <th class="text-right" style="width: 110px;">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>${applianceName}</strong>
            <div style="font-size: 7.5pt; color: #64748B;">Brand: ${applianceBrand} • Free Comprehensive Maintenance Included</div>
          </td>
          <td class="text-center">${durationMonths} mo</td>
          <td class="text-right">₹${monthlyRate.toLocaleString('en-IN')}</td>
          <td class="text-right"><strong>₹${subtotal.toLocaleString('en-IN')}</strong></td>
        </tr>
        <tr>
          <td>
            Refundable Security Deposit
            <div style="font-size: 7.5pt; color: #10B981;">100% Refundable upon lease return</div>
          </td>
          <td class="text-center">1 unit</td>
          <td class="text-right">₹${securityDeposit.toLocaleString('en-IN')}</td>
          <td class="text-right"><strong>₹${securityDeposit.toLocaleString('en-IN')}</strong></td>
        </tr>
        <tr>
          <td>
            Doorstep Delivery, Unboxing & Installation
            <div style="font-size: 7.5pt; color: #047857;">Standard complimentary setup</div>
          </td>
          <td class="text-center">Included</td>
          <td class="text-right">₹0</td>
          <td class="text-right" style="color: #047857;"><strong>${deliveryFee === 0 ? 'FREE' : '₹' + deliveryFee}</strong></td>
        </tr>
      </tbody>
    </table>

    <!-- Financial Summary -->
    <div class="summary-box">
      <div class="summary-table">
        <div class="summary-row">
          <span>Monthly Rental Subtotal:</span>
          <span>₹${subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div class="summary-row">
          <span>Refundable Deposit:</span>
          <span>₹${securityDeposit.toLocaleString('en-IN')}</span>
        </div>
        <div class="summary-row">
          <span>Delivery & Setup Fee:</span>
          <span>${deliveryFee === 0 ? 'FREE' : '₹' + deliveryFee}</span>
        </div>
        <div class="summary-row">
          <span>Taxes (GST 18% Included):</span>
          <span>₹${Math.round(subtotal * 0.18).toLocaleString('en-IN')}</span>
        </div>
        <div class="summary-total">
          <span>Total Amount Paid:</span>
          <span class="amount">₹${totalAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>

    <!-- Assurance & Security Banner -->
    <div class="security-notice">
      <span>✓ Verified Payment • Full Replacement Guarantee & Maintenance active throughout lease duration.</span>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div>This is a computer-generated tax invoice and proof of payment issued under the Indian IT Act. No physical signature is required.</div>
      <div style="margin-top: 3px;">${orgName} • ${orgWebsite} • Support: ${orgSupport}</div>
    </div>

  </div>
</body>
</html>
  `;

  // Use hidden iframe to isolate print completely to this 1 page
  let printFrame = document.getElementById('applinex-print-frame');
  if (printFrame) {
    document.body.removeChild(printFrame);
  }

  printFrame = document.createElement('iframe');
  printFrame.id = 'applinex-print-frame';
  printFrame.style.position = 'fixed';
  printFrame.style.right = '0';
  printFrame.style.bottom = '0';
  printFrame.style.width = '0';
  printFrame.style.height = '0';
  printFrame.style.border = '0';
  document.body.appendChild(printFrame);

  const frameDoc = printFrame.contentWindow.document;
  frameDoc.open();
  frameDoc.write(htmlContent);
  frameDoc.close();

  // Wait for resources to load then trigger print
  setTimeout(() => {
    try {
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();
    } catch (err) {
      console.error('Print failed:', err);
    }
  }, 250);
};

export default printReceipt;
