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

  if ((params.website || "").trim()) {
    return jsonOutput_({ ok: true, skipped: true });
  }

  const sheet = getOrCreateSheet_();
  ensureHeaders_(sheet);

  sheet.appendRow([
    new Date(),
    params.fullName || "",
    params.contactNumber || "",
    params.attendance || "",
    params.guestCount || "",
    params.venues || "",
    params.giftChoice || "",
    params.wishlistCategory || "",
    params.message || "",
    params.source || "",
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
  const currentHeaders = headerRange.getValues()[0];
  const hasAnyHeader = currentHeaders.some((value) => String(value).trim() !== "");

  if (hasAnyHeader) {
    return;
  }

  headerRange.setValues([HEADERS]);
  headerRange.setFontWeight("bold");
  sheet.setFrozenRows(1);
}

function jsonOutput_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
