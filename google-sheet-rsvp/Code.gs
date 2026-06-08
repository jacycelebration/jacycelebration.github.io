const SPREADSHEET_ID = "1fz17c8mhUFwvqRCTHK8sQZNZM08kE5mn9bHzCAo052I";
const SHEET_NAME = "RSVP Responses";
const HEADERS = [
  "Timestamp",
  "Full Name",
  "Contact Number",
  "Attendance",
  "Guest Count",
  "Venues",
  "Gift Choice",
  "Wishlist Category",
  "Message to the Celebrant",
  "Source",
];

function doGet() {
  return jsonOutput_({
    ok: true,
    message: "RSVP endpoint is running.",
    sheet: SHEET_NAME,
  });
}

function doPost(e) {
  const params = (e && e.parameter) || {};

  // Honeypot — bots that fill the hidden "website" field are silently dropped.
  if ((params.website || "").trim()) {
    return jsonOutput_({ ok: true, skipped: true });
  }

  // Required fields: a genuine RSVP always carries a name and an attendance
  // answer. Reject anything missing them so blank/junk POSTs never reach the
  // sheet. (The page validates these too; this is the server-side backstop.)
  const fullName = clean_(params.fullName, 100);
  const attendance = clean_(params.attendance, 10);
  if (!fullName || !attendance) {
    return jsonOutput_({ ok: false, error: "Missing required fields." });
  }

  const sheet = getOrCreateSheet_();
  ensureHeaders_(sheet);

  // Every value is trimmed, length-capped and formula-sanitised by clean_()
  // before writing, so a single submission can't bloat the sheet or inject a
  // spreadsheet formula.
  sheet.appendRow([
    new Date(),
    fullName,
    clean_(params.contactNumber, 30),
    attendance,
    clean_(params.guestCount, 10),
    clean_(params.venues, 200),
    clean_(params.giftChoice, 50),
    clean_(params.wishlistCategory, 100),
    clean_(params.message, 1000),
    clean_(params.source, 200),
  ]);

  return jsonOutput_({ ok: true });
}

function getOrCreateSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  return sheet;
}

function ensureHeaders_(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  const current = headerRange.getValues()[0].map((value) => String(value).trim());

  // Only skip if the existing header row already matches HEADERS exactly.
  // (The old version skipped whenever *any* header existed, so an outdated
  //  5-column layout was never corrected — data then landed under the wrong
  //  labels. Rewriting on mismatch makes a redeploy self-healing.)
  const matches = HEADERS.every((header, i) => current[i] === header);
  if (matches) {
    return;
  }

  headerRange.setValues([HEADERS]);
  headerRange.setFontWeight("bold");
  sheet.setFrozenRows(1);
}

// Trim, length-cap, and neutralise spreadsheet formula injection.
// A value beginning with = + - @ would run as a live formula when the owner
// opens the sheet (e.g. IMPORTDATA exfiltration or a phishing HYPERLINK).
// Prefixing with an apostrophe forces Sheets to store it as plain text — this
// also preserves leading "+" on phone numbers instead of mangling them.
function clean_(value, maxLength) {
  let text = String(value == null ? "" : value).trim().slice(0, maxLength);
  if (/^[=+\-@]/.test(text)) {
    text = "'" + text;
  }
  return text;
}

function jsonOutput_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
