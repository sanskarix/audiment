/**
 * ============================================================================
 * AUDIMENT - COMPREHENSIVE DAILY SIGNUPS GOOGLE APPS SCRIPT WEBHOOK
 * ============================================================================
 * 
 * Instructions:
 * 1. Open your Google Sheet (or create a new blank one).
 * 2. Click "Extensions" > "Apps Script" in the top menu bar.
 * 3. Delete any default code in Code.gs, and paste this entire code.
 * 4. Click "Save" (disk icon or Cmd/Ctrl + S).
 * 5. Click "Deploy" (blue button at top right) > "New deployment".
 * 6. Click the gear icon next to "Select type" and choose "Web app".
 * 7. Configure:
 *    - Description: "Audiment Signup Logger"
 *    - Execute as: "Me (<your-email>)"
 *    - Who has access: "Anyone" (Required so your Next.js server can POST without OAuth prompt)
 * 8. Click "Deploy", approve permissions if prompted.
 * 9. Copy the "Web app URL" (looks like https://script.google.com/macros/s/AKfycb.../exec).
 * 10. Paste this URL into your .env.local as:
 *     GOOGLE_SHEET_SIGNUP_WEBHOOK_URL="https://script.google.com/macros/s/AKfycb.../exec"
 * ============================================================================
 */

const SHEET_NAME = "Daily Signups";

// Exact header columns specified by requirements:
// 1. Date, 2. Full Name, 3. Email, 4. UTM Source, 5. Time (my), 6. Device, then later on other things
const HEADERS = [
  "Date",
  "Full Name",
  "Email",
  "UTM Source",
  "Time (my)",
  "Device",
  "Company Name",
  "Phone",
  "Industry",
  "City",
  "Region / State",
  "Country",
  "Operating Countries",
  "UTM Medium",
  "UTM Campaign",
  "UTM Content",
  "UTM Term",
  "Referrer",
  "Landing Page",
  "IP Address",
  "Browser",
  "OS",
  "Screen Resolution",
  "Timezone",
  "Organization ID",
  "User UID",
  "Role",
  "Account Status",
  "User Agent",
  "Created At (ISO)"
];

function doPost(e) {
  // If run manually from Apps Script editor "Run" button without an event:
  if (!e || !e.postData) {
    Logger.log("doPost called without event data. To test in the editor, run testSignup().");
    return ContentService.createTextOutput(JSON.stringify({
      status: "warning",
      message: "doPost requires an HTTP POST request. Run testSignup() in the editor to test."
    })).setMimeType(ContentService.MimeType.JSON);
  }

  const lock = LockService.getScriptLock();
  // Wait up to 30 seconds for concurrent requests
  lock.tryLock(30000);

  try {
    const rawData = e.postData.contents;
    const data = JSON.parse(rawData);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Create the tab if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME, 0);
    }

    // Initialize headers and styling if row 1 is empty
    if (sheet.getLastRow() === 0 || sheet.getRange(1, 1).getValue() === "") {
      setupSheetFormatting(sheet);
    }

    // Check if user UID already exists to prevent duplicate entries
    const uid = data.uid || data.UserUID || "";
    if (uid && sheet.getLastRow() > 1) {
      const uidColIndex = HEADERS.indexOf("User UID") + 1;
      const existingUids = sheet.getRange(2, uidColIndex, sheet.getLastRow() - 1, 1).getValues();
      for (let i = 0; i < existingUids.length; i++) {
        if (existingUids[i][0] === uid) {
          return ContentService.createTextOutput(JSON.stringify({
            status: "duplicate",
            message: "User UID already recorded in Google Sheet",
            row: i + 2
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    // Map incoming JSON properties to the exact columns:
    const rowValues = [
      data.date || data.Date || "",
      data.fullName || data.name || data["Full Name"] || "",
      data.email || data.Email || "",
      data.utmSource || data.UTMSource || "direct",
      data.time || data.Time || "",
      data.device || data.Device || "",
      data.companyName || data.company || data["Company Name"] || "",
      data.phone || data.Phone || "",
      data.industry || data.Industry || "",
      data.city || data.City || "",
      data.region || data.state || data["Region / State"] || "",
      data.country || data.Country || "IN",
      data.operatingCountries || (Array.isArray(data.countries) ? data.countries.join(", ") : data.countries) || "",
      data.utmMedium || data.UTMMedium || "",
      data.utmCampaign || data.UTMCampaign || "",
      data.utmContent || data.UTMContent || "",
      data.utmTerm || data.UTMTerm || "",
      data.referrer || data.Referrer || "",
      data.landingPage || data.LandingPage || "",
      data.ip || data.IPAddress || "",
      data.browser || data.Browser || "",
      data.os || data.OS || "",
      data.screenResolution || data.ScreenResolution || "",
      data.timezone || data.Timezone || "",
      data.organizationId || data.orgId || data["Organization ID"] || "",
      uid,
      data.role || data.Role || "ADMIN",
      data.accountStatus || data.Status || "Active",
      data.userAgent || data.UserAgent || "",
      data.rawTimestamp || data.createdAt || new Date().toISOString()
    ];

    // Append the row
    sheet.appendRow(rowValues);
    const newRowIndex = sheet.getLastRow();
    const rowRange = sheet.getRange(newRowIndex, 1, 1, HEADERS.length);

    // Apply row styling
    rowRange.setFontFamily("Inter");
    rowRange.setFontSize(10);
    rowRange.setVerticalAlignment("middle");
    sheet.setRowHeight(newRowIndex, 28);

    // Subtle alternating zebra shading
    if (newRowIndex % 2 === 0) {
      rowRange.setBackground("#F8FAFC");
    } else {
      rowRange.setBackground("#FFFFFF");
    }

    // Center-align key short columns: Date(1), UTM Source(4), Time(5), Country(12), Role(27), Status(28)
    [1, 4, 5, 12, 27, 28].forEach(function (col) {
      sheet.getRange(newRowIndex, col).setHorizontalAlignment("center");
    });

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Signup logged successfully",
      row: newRowIndex
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Health check endpoint for GET requests
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    message: "Audiment Google Sheets Webhook is active and listening for signups!",
    configuredColumns: HEADERS
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Applies header styling, frozen top row, and column formatting
 */
function setupSheetFormatting(sheet) {
  sheet.clear();
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);

  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setBackground("#0F172A"); // Audiment Navy Slate
  headerRange.setFontColor("#FFFFFF");
  headerRange.setFontFamily("Inter");
  headerRange.setFontSize(11);
  headerRange.setFontWeight("bold");
  headerRange.setHorizontalAlignment("center");
  headerRange.setVerticalAlignment("middle");
  sheet.setRowHeight(1, 38);

  // Freeze top row so headers remain visible when scrolling
  sheet.setFrozenRows(1);

  // Set initial clean column widths
  const widths = {
    1: 110, // Date
    2: 170, // Full Name
    3: 230, // Email
    4: 130, // UTM Source
    5: 220, // Time (my)
    6: 220, // Device
    7: 180, // Company Name
    8: 150, // Phone
    9: 150, // Industry
    10: 120, // City
    11: 130, // Region / State
    12: 90,  // Country
    13: 140, // Operating Countries
    14: 120, // UTM Medium
    15: 150, // UTM Campaign
    16: 140, // UTM Content
    17: 140, // UTM Term
    18: 200, // Referrer
    19: 240, // Landing Page
    20: 130, // IP Address
    21: 110, // Browser
    22: 110, // OS
    23: 130, // Screen Resolution
    24: 130, // Timezone
    25: 180, // Organization ID
    26: 240, // User UID
    27: 100, // Role
    28: 110, // Account Status
    29: 250, // User Agent
    30: 220  // Created At (ISO)
  };

  for (const colIndex in widths) {
    sheet.setColumnWidth(parseInt(colIndex), widths[colIndex]);
  }
}

/**
 * Manual test function you can run directly inside the Google Apps Script editor.
 * Select "testSignup" from the function dropdown and click "Run".
 */
function testSignup() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        date: Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd"),
        fullName: "Test Apps Script User",
        email: "test.manual@example.com",
        utmSource: "manual_test",
        time: Utilities.formatDate(new Date(), "Asia/Kolkata", "hh:mm:ss a") + " (IST / UTC+5:30)",
        device: "Desktop (macOS / Chrome)",
        companyName: "Audiment Test Org",
        phone: "+91 9876543210",
        industry: "Testing",
        city: "Mumbai",
        region: "Maharashtra",
        country: "IN",
        operatingCountries: "IN",
        utmMedium: "editor_test",
        referrer: "https://script.google.com/",
        landingPage: "/signup",
        ip: "127.0.0.1",
        browser: "Chrome",
        os: "macOS",
        screenResolution: "1920x1080",
        timezone: "Asia/Kolkata",
        organizationId: "test_org_id",
        uid: "test_uid_" + new Date().getTime(),
        role: "ADMIN",
        accountStatus: "Active",
        userAgent: "AppsScript/1.0",
        rawTimestamp: new Date().toISOString()
      })
    }
  };

  const result = doPost(mockEvent);
  Logger.log("Result: " + result.getContent());
}
