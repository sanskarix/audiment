"use client";

import { useEffect, useRef } from "react";
import { useAuthSync } from "@/components/AuthProvider";
import {
  getStoredConsent,
  setGoogleConsentDefaults,
  updateGoogleConsentMode,
} from "@/components/ConsentProvider";
import {
  PENDING_ONBOARDING_ANALYTICS_KEY,
  setGaUserId,
  trackGaEvent,
} from "@/lib/dataLayer";

/**
 * Attaches the authenticated Firebase UID (zero PII) to GA4 inside /dashboard/*
 * and fires `onboarding_complete` once when a newly registered user lands on the dashboard.
 */
export function DashboardAnalyticsTracker() {
  const { isSynced, uid, role, plan } = useAuthSync();
  const syncedUidRef = useRef<string | null>(null);

  // Preserve existing Consent Mode preference from the marketing site without showing a banner
  useEffect(() => {
    setGoogleConsentDefaults();
    const stored = getStoredConsent();
    if (stored) {
      updateGoogleConsentMode(stored.analytics, stored.marketing);
    }
  }, []);

  useEffect(() => {
    if (!isSynced || !uid) return;

    if (syncedUidRef.current !== uid) {
      syncedUidRef.current = uid;
      setGaUserId(uid, { role, plan });
    }

    try {
      const pendingRaw = sessionStorage.getItem(PENDING_ONBOARDING_ANALYTICS_KEY);
      if (pendingRaw) {
        sessionStorage.removeItem(PENDING_ONBOARDING_ANALYTICS_KEY);
        let extra: Record<string, any> = {};
        try {
          extra = JSON.parse(pendingRaw) || {};
        } catch {
          // Ignore malformed JSON
        }
        trackGaEvent("onboarding_complete", {
          method: "email_otp",
          role: role || "admin",
          plan: plan || "free",
          ...extra,
        });
      }
    } catch {
      // Ignore storage access errors in restricted browser contexts
    }
  }, [isSynced, uid, role, plan]);

  return null;
}
