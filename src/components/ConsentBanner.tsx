"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useConsent } from "@/components/ConsentProvider";
import { Button } from "@/components/ui/button";

function isPublicRoute(pathname: string | null): boolean {
  if (!pathname) return false;

  if (
    pathname.startsWith("/dashboard") ||
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/test-recording" ||
    pathname.startsWith("/test-recording/")
  ) {
    return false;
  }

  return true;
}

export function ConsentBanner() {
  const pathname = usePathname();
  const {
    consent,
    hasDecision,
    isPreferencesOpen,
    acceptAll,
    rejectNonEssential,
    savePreferences,
    openPreferences,
    closePreferences,
  } = useConsent();

  const [mounted, setMounted] = useState(false);
  const [tempAnalytics, setTempAnalytics] = useState(consent.analytics);
  const [tempMarketing, setTempMarketing] = useState(consent.marketing);

  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isPreferencesOpen) {
      setTempAnalytics(consent.analytics);
      setTempMarketing(consent.marketing);
    }
  }, [isPreferencesOpen, consent.analytics, consent.marketing]);

  // Focus management: save active element when modal opens, focus dialog, trap focus, restore focus when closed
  useEffect(() => {
    if (isPreferencesOpen) {
      if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
        previousFocusRef.current = document.activeElement;
      }

      const timer = setTimeout(() => {
        if (dialogRef.current) {
          const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusables.length > 0) {
            focusables[0].focus();
          } else {
            dialogRef.current.focus();
          }
        }
      }, 50);

      return () => clearTimeout(timer);
    } else {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    }
  }, [isPreferencesOpen]);

  // Keyboard navigation & trap inside dialog
  const handleDialogKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      closePreferences();
      return;
    }

    if (e.key === "Tab" && dialogRef.current) {
      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled"));

      if (focusables.length === 0) return;

      const firstElement = focusables[0];
      const lastElement = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  if (!mounted || !isPublicRoute(pathname)) {
    return null;
  }

  const showBanner = !hasDecision;

  return (
    <>
      {/* 1. Main Cookie Consent Banner */}
      {showBanner && !isPreferencesOpen && (
        <div
          role="region"
          aria-label="Cookie consent banner"
          className="fixed bottom-0 inset-x-0 z-50 p-2.5 sm:px-6 sm:py-3 bg-background/95 border-t border-border shadow-lg backdrop-blur-md transition-all animate-in slide-in-from-bottom duration-300"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 md:gap-4">
            <div className="space-y-0.5 max-w-3xl">
              <h2 className="text-xs sm:text-sm font-semibold text-foreground">
                We value your privacy
              </h2>
              <p className="text-[11px] sm:text-xs text-neutral-600 dark:text-neutral-400 leading-normal">
                We use essential technologies to operate the site. With your consent, Google Analytics and advertising technologies may be used to understand website usage and measure marketing performance.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0 w-full md:w-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full sm:w-auto h-7 sm:h-8 px-2.5 text-xs text-foreground"
                onClick={openPreferences}
              >
                Manage Preferences
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto h-7 sm:h-8 px-2.5 text-xs text-foreground"
                onClick={rejectNonEssential}
              >
                Reject Non-Essential
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                className="w-full sm:w-auto h-7 sm:h-8 px-3 text-xs bg-neutral-900 text-white hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 font-medium"
                onClick={acceptAll}
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Accessible Preferences Modal Dialog */}
      {isPreferencesOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closePreferences}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="consent-modal-title"
            tabIndex={-1}
            onKeyDown={handleDialogKeyDown}
            className="bg-background border border-border rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-6 overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200 focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              <h2 id="consent-modal-title" className="text-lg font-semibold text-foreground">
                Cookie & Privacy Preferences
              </h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Customize your cookie settings for our public website. Essential functionality will remain active.
              </p>
            </div>

            <div className="space-y-4">
              {/* Necessary Category */}
              <div className="flex items-start justify-between gap-4 p-3.5 rounded-lg border border-border bg-muted/40">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">Strictly Necessary</span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                      Required
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Required for core website security, page navigation, and basic site functionality. Cannot be turned off.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked
                  disabled
                  aria-label="Necessary cookies (always active)"
                  className="mt-1 h-4 w-4 rounded accent-primary cursor-not-allowed opacity-70"
                />
              </div>

              {/* Analytics Category */}
              <div className="flex items-start justify-between gap-4 p-3.5 rounded-lg border border-border hover:bg-muted/20 transition-colors">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-foreground">Analytics Cookies</span>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Allows us to measure visitor traffic and website usage patterns via Google Analytics to help improve site performance.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="consent-analytics-toggle"
                  checked={tempAnalytics}
                  onChange={(e) => setTempAnalytics(e.target.checked)}
                  aria-label="Toggle analytics cookies"
                  className="mt-1 h-4 w-4 rounded accent-primary cursor-pointer"
                />
              </div>

              {/* Marketing Category */}
              <div className="flex items-start justify-between gap-4 p-3.5 rounded-lg border border-border hover:bg-muted/20 transition-colors">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-foreground">Marketing & Targeting</span>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Used to deliver personalized marketing campaigns and measure advertising effectiveness across platforms.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="consent-marketing-toggle"
                  checked={tempMarketing}
                  onChange={(e) => setTempMarketing(e.target.checked)}
                  aria-label="Toggle marketing cookies"
                  className="mt-1 h-4 w-4 rounded accent-primary cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={closePreferences}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                className="bg-neutral-900 text-white hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 font-medium"
                onClick={() => savePreferences(tempAnalytics, tempMarketing)}
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
