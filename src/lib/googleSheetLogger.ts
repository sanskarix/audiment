import { headers } from "next/headers";

export interface SignupLogData {
  fullName: string;
  email: string;
  phone?: string;
  companyName: string;
  industry?: string;
  country?: string;
  countries?: string[];
  uid: string;
  orgId: string;
  role?: string;
  createdAt?: Date | number | string | null;
  attribution?: Record<string, any> | null;
}

export interface EnrichedUserMetadata {
  signupDate: string;
  signupTimeIST: string;
  signupTimeUTC: string;
  timezone: string;
  device: string;
  deviceType: string;
  os: string;
  browser: string;
  screenResolution: string;
  browserLanguage: string;
  ip: string;
  city: string;
  region: string;
  country: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  adClickId: string;
  referrer: string;
  landingPage: string;
  userAgent: string;
  pagesBeforeSignup: number;
}

/**
 * Parses user-agent string for device type, browser, and OS
 */
export function parseUserAgent(ua: string): { deviceType: string; browser: string; os: string; deviceSummary: string } {
  let deviceType = "Desktop";
  let browser = "Other";
  let os = "Other";

  if (!ua) {
    return { deviceType, browser, os, deviceSummary: "Desktop" };
  }

  // Device
  if (/mobile/i.test(ua) && !/ipad|tablet/i.test(ua)) {
    deviceType = "Mobile";
  } else if (/ipad|tablet/i.test(ua)) {
    deviceType = "Tablet";
  }

  // OS
  if (/Mac OS X|Macintosh/i.test(ua)) {
    os = "macOS";
  } else if (/Windows NT/i.test(ua)) {
    os = "Windows";
  } else if (/Android/i.test(ua)) {
    os = "Android";
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    os = "iOS";
  } else if (/Linux/i.test(ua)) {
    os = "Linux";
  }

  // Browser
  if (/Edg\//i.test(ua)) {
    browser = "Edge";
  } else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) {
    browser = "Chrome";
  } else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) {
    browser = "Safari";
  } else if (/Firefox\//i.test(ua)) {
    browser = "Firefox";
  }

  const deviceSummary = `${deviceType} (${os} / ${browser})`;

  return { deviceType, browser, os, deviceSummary };
}

/**
 * Formats a Date object or timestamp into IST (UTC+5:30) date & time strings
 */
export function formatISTTime(date: Date = new Date()): { dateStr: string; timeStr: string; isoStr: string } {
  // Format for Date: YYYY-MM-DD in Asia/Kolkata
  const dateStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  // Format for Time: hh:mm:ss A (IST) in Asia/Kolkata
  const timeParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);

  const timeStr = `${timeParts} (IST / UTC+5:30)`;
  const isoStr = date.toISOString();

  return { dateStr, timeStr, isoStr };
}

/**
 * Extracts server-side request context (IP, Vercel/Cloudflare Geo, User-Agent)
 */
export async function getRequestContext() {
  try {
    const headerList = await headers();
    const rawUa = headerList.get("user-agent") || "";
    const parsedUa = parseUserAgent(rawUa);

    const clientIp =
      headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headerList.get("x-real-ip") ||
      headerList.get("cf-connecting-ip") ||
      "Unknown";

    const country =
      headerList.get("x-vercel-ip-country") ||
      headerList.get("cf-ipcountry") ||
      "";

    const region = headerList.get("x-vercel-ip-country-region") || "";
    const city = headerList.get("x-vercel-ip-city") || "";

    return {
      rawUa,
      parsedUa,
      clientIp,
      country,
      region,
      city,
    };
  } catch {
    return {
      rawUa: "",
      parsedUa: { deviceType: "Desktop", browser: "Other", os: "Other", deviceSummary: "Desktop" },
      clientIp: "Unknown",
      country: "",
      region: "",
      city: "",
    };
  }
}

/**
 * Builds comprehensive enriched metadata for saving into Firestore & logging to Google Sheet
 */
export async function buildSignupPayload(data: SignupLogData) {
  const reqCtx = await getRequestContext();
  const attr = data.attribution || {};

  const timestamp = data.createdAt
    ? typeof data.createdAt === "number"
      ? new Date(data.createdAt)
      : data.createdAt instanceof Date
      ? data.createdAt
      : new Date()
    : new Date();

  const { dateStr, timeStr, isoStr } = formatISTTime(timestamp);

  const deviceSummary =
    attr.device ||
    (attr.deviceType && attr.os && attr.browser
      ? `${attr.deviceType} (${attr.os} / ${attr.browser})`
      : reqCtx.parsedUa.deviceSummary);

  const deviceType = attr.deviceType || reqCtx.parsedUa.deviceType;
  const os = attr.os || reqCtx.parsedUa.os;
  const browser = attr.browser || reqCtx.parsedUa.browser;
  const ip = attr.ip || reqCtx.clientIp;
  const city = attr.city || reqCtx.city || "Unknown";
  const region = attr.region || reqCtx.region || "Unknown";
  const detectedCountry = attr.country || reqCtx.country || data.country || "IN";
  const utmSource = attr.utmSource || "direct";
  const utmMedium = attr.utmMedium || (utmSource === "direct" ? "direct" : "organic");
  const utmCampaign = attr.utmCampaign || "";
  const utmContent = attr.utmContent || "";
  const utmTerm = attr.utmTerm || "";
  const referrer = attr.referrer || "Direct";
  const landingPage = attr.landingPage || "/";
  const screenResolution = attr.screenResolution || "Unknown";
  const timezone = attr.timezone || "Asia/Kolkata";
  const browserLanguage = attr.browserLanguage || "en";
  const userAgent = attr.userAgent || reqCtx.rawUa || "Unknown";

  const countriesStr = Array.isArray(data.countries) ? data.countries.join(", ") : data.country || "IN";

  // Google Sheet Row Payload - ORDER IS CRITICAL TO MATCH USER'S SPECIFICATION:
  // 1. Date, 2. Full Name, 3. Email, 4. UTM source, 5. Time (my), 6. Device, then later on other things
  const sheetPayload = {
    // ── First Priority (As explicitly requested by user) ──
    date: dateStr,
    fullName: data.fullName,
    email: data.email,
    utmSource: utmSource,
    time: timeStr,
    device: deviceSummary,

    // ── Then later on other things ──
    companyName: data.companyName,
    phone: data.phone || "",
    industry: data.industry || "",
    city: city,
    region: region,
    country: detectedCountry,
    operatingCountries: countriesStr,
    utmMedium: utmMedium,
    utmCampaign: utmCampaign,
    utmContent: utmContent,
    utmTerm: utmTerm,
    referrer: referrer,
    landingPage: landingPage,
    ip: ip,
    browser: browser,
    os: os,
    screenResolution: screenResolution,
    timezone: timezone,
    organizationId: data.orgId,
    uid: data.uid,
    role: data.role || "ADMIN",
    accountStatus: "Active",
    userAgent: userAgent,
    rawTimestamp: isoStr,
  };

  const firestoreMetadata: EnrichedUserMetadata = {
    signupDate: dateStr,
    signupTimeIST: timeStr,
    signupTimeUTC: isoStr,
    timezone: timezone,
    device: deviceSummary,
    deviceType: deviceType,
    os: os,
    browser: browser,
    screenResolution: screenResolution,
    browserLanguage: browserLanguage,
    ip: ip,
    city: city,
    region: region,
    country: detectedCountry,
    utmSource: utmSource,
    utmMedium: utmMedium,
    utmCampaign: utmCampaign,
    utmContent: utmContent,
    utmTerm: utmTerm,
    adClickId: attr.adClickId || "",
    referrer: referrer,
    landingPage: landingPage,
    userAgent: userAgent,
    pagesBeforeSignup: attr.pagesBeforeSignup || 1,
  };

  return { sheetPayload, firestoreMetadata };
}

/**
 * Dispatches a signup event to the Google Sheet webhook
 */
export async function logSignupToGoogleSheet(data: SignupLogData): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEET_SIGNUP_WEBHOOK_URL;

  // Skip if not configured or still placeholder
  if (!webhookUrl || webhookUrl.includes("...") || !webhookUrl.startsWith("https://script.google.com/")) {
    console.warn("[googleSheetLogger] Webhook URL not configured or invalid:", webhookUrl);
    return;
  }

  try {
    const { sheetPayload } = await buildSignupPayload(data);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sheetPayload),
      redirect: "follow",
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn("[googleSheetLogger] Webhook returned status:", res.status, text);
    } else {
      const result = await res.json().catch(() => null);
      console.log(`[googleSheetLogger] Successfully logged signup for ${data.email} to Google Sheet`, result);
    }
  } catch (error: any) {
    console.error("[googleSheetLogger] Failed to dispatch signup log:", error?.message || error);
  }
}
