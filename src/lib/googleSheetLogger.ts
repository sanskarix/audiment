import { headers } from "next/headers";

export interface SignupLogData {
  fullName: string;
  email: string;
  phone?: string;
  companyName: string;
  industry?: string;
  uid: string;
  orgId: string;
  attribution?: Record<string, any> | null;
}

/**
 * Parses user-agent string for device type, browser, and OS
 */
function parseUserAgent(ua: string): { device: string; browser: string; os: string } {
  let device = "Desktop";
  let browser = "Other";
  let os = "Other";

  if (!ua) return { device, browser, os };

  // Device
  if (/mobile/i.test(ua) && !/ipad|tablet/i.test(ua)) {
    device = "Mobile";
  } else if (/ipad|tablet/i.test(ua)) {
    device = "Tablet";
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
  } else if (/Chrome\//i.test(ua)) {
    browser = "Chrome";
  } else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) {
    browser = "Safari";
  } else if (/Firefox\//i.test(ua)) {
    browser = "Firefox";
  }

  return { device, browser, os };
}

/**
 * Dispatches a signup event to the Google Sheet webhook asynchronously
 */
export async function logSignupToGoogleSheet(data: SignupLogData): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEET_SIGNUP_WEBHOOK_URL;

  // Skip if not configured or still placeholder
  if (!webhookUrl || webhookUrl.includes("...") || !webhookUrl.startsWith("https://script.google.com/")) {
    if (process.env.NODE_ENV === "development") {
      console.log("[googleSheetLogger] Webhook URL not configured yet. Skipping Sheet log.");
    }
    return;
  }

  try {
    const headerList = await headers();
    const rawUa = headerList.get("user-agent") || "";
    const parsedUa = parseUserAgent(rawUa);

    // Geolocation headers (provided automatically by Vercel / Cloudflare edge)
    const clientIp =
      headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headerList.get("x-real-ip") ||
      "Unknown";

    const country = headerList.get("x-vercel-ip-country") || headerList.get("cf-ipcountry") || "IN";
    const region = headerList.get("x-vercel-ip-country-region") || "";
    const city = headerList.get("x-vercel-ip-city") || "";

    const attr = data.attribution || {};

    // Calculate session duration if firstSeenAt is provided
    let sessionDuration = "0s";
    if (attr.firstSeenAt && typeof attr.firstSeenAt === "number") {
      const diffSec = Math.max(0, Math.round((Date.now() - attr.firstSeenAt) / 1000));
      if (diffSec >= 60) {
        sessionDuration = `${Math.floor(diffSec / 60)}m ${diffSec % 60}s`;
      } else {
        sessionDuration = `${diffSec}s`;
      }
    }

    const payload = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || "",
      companyName: data.companyName,
      industry: data.industry || "",
      uid: data.uid,
      orgId: data.orgId,
      utmSource: attr.utmSource || "direct",
      utmMedium: attr.utmMedium || "",
      utmCampaign: attr.utmCampaign || "",
      utmTerm: attr.utmTerm || "",
      utmContent: attr.utmContent || "",
      adClickId: attr.adClickId || "",
      referrer: attr.referrer || "Direct",
      landingPage: attr.landingPage || "/",
      deviceType: attr.deviceType || parsedUa.device,
      browser: parsedUa.browser,
      os: parsedUa.os,
      screenResolution: attr.screenResolution || "",
      language: attr.browserLanguage || headerList.get("accept-language")?.split(",")[0] || "en",
      country,
      region,
      city,
      ip: clientIp,
      sessionDuration,
      pagesBeforeSignup: attr.pagesBeforeSignup || 1,
    };

    // Fire non-blocking POST request to Google Apps Script
    fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.warn("[googleSheetLogger] Webhook returned status:", res.status, text);
        } else {
          console.log(`[googleSheetLogger] Successfully logged signup for ${data.email} to Google Sheet`);
        }
      })
      .catch((err) => {
        console.error("[googleSheetLogger] Webhook dispatch error:", err);
      });
  } catch (error) {
    console.error("[googleSheetLogger] Failed to dispatch signup log:", error);
  }
}
