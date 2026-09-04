import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  api_host: "/ingest",
  ui_host: "https://us.posthog.com",
  defaults: "2026-01-30",
  capture_exceptions: true,
  debug: process.env.NODE_ENV === "development",
});

if (typeof window !== "undefined") {
  try {
    const referrer = document.referrer;
    const searchParams = new URLSearchParams(window.location.search);
    
    // Only parse external traffic to avoid overwriting session details with internal transitions
    const isInternalReferrer = referrer && referrer.includes(window.location.hostname);
    
    if (!isInternalReferrer) {
      let aiSource: string | null = null;
      const refLower = referrer ? referrer.toLowerCase() : "";
      
      // 1. Detect AI search source from Referrer
      if (
        refLower.includes("chatgpt.com") ||
        refLower.includes("openai.com") ||
        refLower.includes("android-app://com.openai.chatgpt")
      ) {
        aiSource = "ChatGPT";
      } else if (refLower.includes("perplexity.ai")) {
        aiSource = "Perplexity";
      } else if (
        refLower.includes("copilot.microsoft.com") ||
        refLower.includes("edgeservices.bing.com") ||
        refLower.includes("sydney.bing.com") ||
        refLower.includes("bing.com/chat")
      ) {
        aiSource = "Copilot";
      } else if (
        refLower.includes("gemini.google.com") ||
        refLower.includes("bard.google.com")
      ) {
        aiSource = "Gemini";
      } else if (
        refLower.includes("claude.ai") ||
        refLower.includes("anthropic.com")
      ) {
        aiSource = "Claude";
      } else if (
        refLower.includes("grok.com") ||
        refLower.includes("x.ai")
      ) {
        aiSource = "Grok";
      } else if (
        refLower.includes("you.com")
      ) {
        aiSource = "You.com";
      }
      
      // 2. Fallback / Detect AI search source from UTM parameters
      const utmSource = searchParams.get("utm_source")?.toLowerCase() || "";
      const utmMedium = searchParams.get("utm_medium")?.toLowerCase() || "";
      const utmCampaign = searchParams.get("utm_campaign") || "";
      const utmContent = searchParams.get("utm_content") || "";
      const utmTerm = searchParams.get("utm_term") || "";
      
      const combinedUTM = `${utmSource} ${utmMedium}`;
      if (!aiSource) {
        if (combinedUTM.includes("chatgpt") || combinedUTM.includes("openai")) {
          aiSource = "ChatGPT";
        } else if (combinedUTM.includes("perplexity")) {
          aiSource = "Perplexity";
        } else if (combinedUTM.includes("copilot")) {
          aiSource = "Copilot";
        } else if (combinedUTM.includes("gemini") || combinedUTM.includes("bard")) {
          aiSource = "Gemini";
        } else if (combinedUTM.includes("claude") || combinedUTM.includes("anthropic")) {
          aiSource = "Claude";
        } else if (combinedUTM.includes("grok") || combinedUTM.includes("xai")) {
          aiSource = "Grok";
        } else if (combinedUTM.includes("you.com") || combinedUTM.includes("youchat")) {
          aiSource = "You.com";
        }
      }
      
      // 3. Store and register if AI traffic is detected
      if (aiSource) {
        const landingPage = window.location.pathname + window.location.search;
        
        sessionStorage.setItem("ai_referral", "true");
        sessionStorage.setItem("ai_source", aiSource);
        sessionStorage.setItem("ai_landing_page", landingPage);
        if (referrer) sessionStorage.setItem("ai_referrer", referrer);
        if (utmSource) sessionStorage.setItem("ai_utm_source", utmSource);
        if (utmMedium) sessionStorage.setItem("ai_utm_medium", utmMedium);
        if (utmCampaign) sessionStorage.setItem("ai_utm_campaign", utmCampaign);
        if (utmContent) sessionStorage.setItem("ai_utm_content", utmContent);
        if (utmTerm) sessionStorage.setItem("ai_utm_term", utmTerm);
        
        // Register super properties in PostHog so they attach to all subsequent events
        posthog.register({
          ai_referral: true,
          ai_attribution_source: aiSource,
          ai_landing_page: landingPage,
          ai_referrer: referrer || undefined,
          utm_source: utmSource || undefined,
          utm_medium: utmMedium || undefined,
          utm_campaign: utmCampaign || undefined,
        });
        
        // Capture initial landing event (source -> landing page)
        posthog.capture("ai_search_landed", {
          ai_referral: true,
          ai_source: aiSource,
          landing_page: landingPage,
          referrer: referrer || undefined,
          utm_source: utmSource || undefined,
          utm_medium: utmMedium || undefined,
          utm_campaign: utmCampaign || undefined,
        });
      }
    }
  } catch (err) {
    console.error("[posthog] Failed to run AI search attribution:", err);
  }
}
