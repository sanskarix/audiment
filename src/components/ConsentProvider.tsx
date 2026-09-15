"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface ConsentCategories {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface ConsentData {
  v: number;
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

export interface ConsentContextValue {
  consent: ConsentCategories;
  hasDecision: boolean;
  isPreferencesOpen: boolean;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  savePreferences: (analytics: boolean, marketing: boolean) => void;
  openPreferences: () => void;
  closePreferences: () => void;
}

const COOKIE_NAME = "audiment_consent";
const CURRENT_VERSION = 1;

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Parses the audiment_consent cookie if present.
 */
function getStoredConsent(): ConsentData | null {
  if (typeof document === "undefined") return null;
  try {
    const cookies = document.cookie.split("; ");
    const consentCookie = cookies.find((row) => row.startsWith(`${COOKIE_NAME}=`));
    if (!consentCookie) return null;
    const value = decodeURIComponent(consentCookie.split("=")[1]);
    const parsed = JSON.parse(value) as ConsentData;
    if (
      parsed &&
      typeof parsed === "object" &&
      parsed.v === CURRENT_VERSION &&
      parsed.necessary === true &&
      typeof parsed.analytics === "boolean" &&
      typeof parsed.marketing === "boolean" &&
      typeof parsed.timestamp === "number" &&
      !isNaN(parsed.timestamp)
    ) {
      return parsed;
    }
  } catch (err) {
    console.error("[Consent] Failed to parse stored consent cookie:", err);
  }
  return null;
}

/**
 * Encodes and sets the audiment_consent cookie for 1 year.
 */
function setStoredConsent(analytics: boolean, marketing: boolean): ConsentData {
  const data: ConsentData = {
    v: CURRENT_VERSION,
    necessary: true,
    analytics,
    marketing,
    timestamp: Date.now(),
  };

  if (typeof document !== "undefined") {
    const encoded = encodeURIComponent(JSON.stringify(data));
    const maxAge = 365 * 24 * 60 * 60; // 1 year
    const secureFlag = window.location.protocol === "https:" ? "Secure;" : "";
    document.cookie = `${COOKIE_NAME}=${encoded}; path=/; max-age=${maxAge}; ${secureFlag} SameSite=Lax`;
  }

  return data;
}

/**
 * Initializes window.dataLayer and pushes Google Consent Mode defaults.
 */
function setGoogleConsentDefaults() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () {
      window.dataLayer?.push(arguments);
    };
  }

  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });
}

/**
 * Updates Google Consent Mode v2 via gtag('consent', 'update', ...).
 */
function updateGoogleConsentMode(analytics: boolean, marketing: boolean) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () {
      window.dataLayer?.push(arguments);
    };
  }

  window.gtag("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
  });
}

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentCategories>({
    necessary: true,
    analytics: false,
    marketing: false,
  });
  const [hasDecision, setHasDecision] = useState<boolean>(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState<boolean>(false);

  useEffect(() => {
    // 1. Establish Google Consent Mode default denied state
    setGoogleConsentDefaults();

    // 2. Read existing consent cookie if available
    const stored = getStoredConsent();
    if (stored) {
      setConsent({
        necessary: true,
        analytics: stored.analytics,
        marketing: stored.marketing,
      });
      setHasDecision(true);
      updateGoogleConsentMode(stored.analytics, stored.marketing);
    }
  }, []);

  const handleUpdateConsent = useCallback((analytics: boolean, marketing: boolean) => {
    const updatedData = setStoredConsent(analytics, marketing);
    setConsent({
      necessary: true,
      analytics: updatedData.analytics,
      marketing: updatedData.marketing,
    });
    setHasDecision(true);
    updateGoogleConsentMode(updatedData.analytics, updatedData.marketing);
  }, []);

  const acceptAll = useCallback(() => {
    handleUpdateConsent(true, true);
    setIsPreferencesOpen(false);
  }, [handleUpdateConsent]);

  const rejectNonEssential = useCallback(() => {
    handleUpdateConsent(false, false);
    setIsPreferencesOpen(false);
  }, [handleUpdateConsent]);

  const savePreferences = useCallback(
    (analytics: boolean, marketing: boolean) => {
      handleUpdateConsent(analytics, marketing);
      setIsPreferencesOpen(false);
    },
    [handleUpdateConsent]
  );

  const openPreferences = useCallback(() => {
    setIsPreferencesOpen(true);
  }, []);

  const closePreferences = useCallback(() => {
    setIsPreferencesOpen(false);
  }, []);

  return (
    <ConsentContext.Provider
      value={{
        consent,
        hasDecision,
        isPreferencesOpen,
        acceptAll,
        rejectNonEssential,
        savePreferences,
        openPreferences,
        closePreferences,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return context;
}
