// ====================================================================
// YUKTI '27 — GOOGLE APPS SCRIPT WEBHOOK CODE
// ====================================================================
// Instructions:
// 1. Open your Google Drive -> Create a new Google Sheet named "YUKTI 27 Registrations".
// 2. In row 1, set up these column headers:
//    Timestamp | Docket ID | Arena | Fee | Lead Name | Email | Phone | College | Year | Delegation Type | Team Members | Special Requirements | Payment Gateway | UTR / Txn ID | Status
// 3. Click Extensions -> Apps Script.
// 4. Delete existing code, paste this entire file, and click Save (disk icon).
// 5. Click "Deploy" (top right) -> "New deployment".
// 6. Click Gear icon (Select type) -> "Web app".
// 7. Settings:
//    - Description: "YUKTI 27 Webhook"
//    - Execute as: "Me (your email)"
//    - Who has access: "Anyone" (important so your frontend can post data)
// 8. Click "Deploy" -> Authorize access -> Copy the "Web app URL" (ends with /exec).
// 9. Paste that URL into your .env or Vercel Environment Variables as:
//    VITE_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
// ====================================================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Append row matching the columns
    sheet.appendRow([
      data.timestamp || new Date(),
      data.regId || '',
      data.event || '',
      data.fee || '',
      data.name || '',
      data.email || '',
      data.phone || '',
      data.college || '',
      data.year || '',
      data.delegationType || '',
      data.teamMembers || '',
      data.specialRequirements || '',
      data.paymentMethod || 'UPI QR',
      data.utr || '',
      data.status || 'Confirmed'
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("YUKTI '27 Webhook is Active!");
}
