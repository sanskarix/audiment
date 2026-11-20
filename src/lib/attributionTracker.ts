"use client";

/**
 * First-Touch Marketing & Device Attribution Tracker for Audiment
 * Preserves initial UTMs, referrer, landing page, and device profile across session navigation.
 */

const STORAGE_KEY = "audiment_signup_attribution_v1";

export interface StoredAttribution {
  landingPage: string;
  signupPage: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  adClickId: string;
  deviceType: "Mobile" | "Tablet" | "Desktop";
  screenResolution: string;
  browserLanguage: string;
  pagesBeforeSignup: number;
  firstSeenAt: number;
}

export function initAttributionTracker(): void {
  if (typeof window === "undefined") return;

  try {
    const now = Date.now();
    const url = new URL(window.location.href);
    const params = url.searchParams;

    // Detect device type
    const ua = navigator.userAgent;
    const isMobile = /iPhone|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTablet = /iPad|tablet/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const deviceType: "Mobile" | "Tablet" | "Desktop" = isTablet ? "Tablet" : isMobile ? "Mobile" : "Desktop";

    // Ad Click IDs (Google, Facebook, Microsoft, TikTok)
    const adClickId = params.get("gclid") || params.get("fbclid") || params.get("msclkid") || params.get("ttclid") || "";

    const existingRaw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);

    if (!existingRaw) {
      // First touch on the site
      let ref = document.referrer || "";
      if (ref) {
        try {
          const parsedRef = new URL(ref);
          if (parsedRef.hostname === window.location.hostname) {
            ref = "Direct / Internal";
          }
        } catch {
          // ignore
        }
      } else {
        ref = "Direct";
      }

      // Fallback UTM Source if direct or organic search
      let utmSource = params.get("utm_source") || "";
      if (!utmSource && ref && ref !== "Direct" && ref !== "Direct / Internal") {
        try {
          const refHost = new URL(ref).hostname.replace(/^www\./, "");
          if (refHost.includes("google.")) utmSource = "google_organic";
          else if (refHost.includes("linkedin.")) utmSource = "linkedin_organic";
          else if (refHost.includes("twitter.") || refHost.includes("x.com")) utmSource = "twitter_organic";
          else if (refHost.includes("youtube.")) utmSource = "youtube";
          else utmSource = refHost;
        } catch {
          utmSource = "referral";
        }
      }
      if (!utmSource) {
        utmSource = "direct";
      }

      const initial: StoredAttribution = {
        landingPage: window.location.pathname,
        signupPage: window.location.pathname,
        referrer: ref,
        utmSource,
        utmMedium: params.get("utm_medium") || (utmSource === "direct" ? "direct" : "organic"),
        utmCampaign: params.get("utm_campaign") || "",
        utmTerm: params.get("utm_term") || "",
        utmContent: params.get("utm_content") || "",
        adClickId,
        deviceType,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        browserLanguage: navigator.language || "en",
        pagesBeforeSignup: 1,
        firstSeenAt: now,
      };

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    } else {
      // Subsequent pageview: increment page counter and record current page
      try {
        const parsed: StoredAttribution = JSON.parse(existingRaw);
        parsed.pagesBeforeSignup = (parsed.pagesBeforeSignup || 1) + 1;
        parsed.signupPage = window.location.pathname;
        
        // If user arrived with new campaign parameters, keep first-touch but overwrite if previously direct
        if (parsed.utmSource === "direct" && params.get("utm_source")) {
          parsed.utmSource = params.get("utm_source")!;
          parsed.utmMedium = params.get("utm_medium") || "referral";
          parsed.utmCampaign = params.get("utm_campaign") || "";
        }

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      } catch {}
    }
  } catch (err) {
    console.warn("[AttributionTracker] Failed to record attribution:", err);
  }
}

export function getStoredAttribution(): Partial<StoredAttribution> {
  if (typeof window === "undefined") return {};

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Fallback: construct instant attribution if user hit signup directly
      const ua = navigator.userAgent;
      const isMobile = /iPhone|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      const isTablet = /iPad|tablet/i.test(ua);
      const deviceType = isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop";
      const params = new URLSearchParams(window.location.search);

      return {
        landingPage: window.location.pathname,
        signupPage: window.location.pathname,
        referrer: document.referrer || "Direct",
        utmSource: params.get("utm_source") || "direct",
        utmMedium: params.get("utm_medium") || "direct",
        utmCampaign: params.get("utm_campaign") || "",
        deviceType,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        browserLanguage: navigator.language || "en",
        pagesBeforeSignup: 1,
        firstSeenAt: Date.now(),
      };
    }

    const data: StoredAttribution = JSON.parse(raw);
    data.signupPage = window.location.pathname;
    return data;
  } catch {
    return {};
  }
}
