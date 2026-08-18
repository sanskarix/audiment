import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { getPostHogClient, shutdownPostHog } from "@/lib/posthog-server";

export const runtime = "nodejs";

type LeadPayload = {
  fullName: string;
  companyName: string;
  outlets: number;
  email: string;
  phone: string;
  message: string;
  attribution?: {
    aiSource?: string;
    aiLandingPage?: string;
    aiReferrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
  };
};

function isValidLeadPayload(payload: unknown): payload is LeadPayload {
  if (!payload || typeof payload !== "object") return false;

  const lead = payload as Record<string, unknown>;

  return (
    typeof lead.fullName === "string" &&
    typeof lead.companyName === "string" &&
    typeof lead.email === "string" &&
    typeof lead.phone === "string" &&
    typeof lead.message === "string" &&
    typeof lead.outlets === "number" &&
    Number.isFinite(lead.outlets) &&
    lead.outlets > 0
  );
}

export async function POST(request: Request) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: "Lead capture is temporarily unavailable." },
        { status: 503 }
      );
    }

    const body = await request.json();

    if (!isValidLeadPayload(body)) {
      return NextResponse.json(
        { error: "Please fill out all required fields correctly." },
        { status: 400 }
      );
    }

    const lead = {
      fullName: body.fullName.trim(),
      companyName: body.companyName.trim(),
      outlets: body.outlets,
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      message: body.message.trim(),
    };

    const attribution = body.attribution && typeof body.attribution === "object" ? body.attribution : null;

    await adminDb.collection("leads").add({
      ...lead,
      createdAt: FieldValue.serverTimestamp(),
      source: "website",
      ...(attribution && { attribution }),
    });

    if (process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) {
      try {
        const posthog = getPostHogClient();
        
        const attributionProps = attribution ? {
          ai_source: attribution.aiSource || undefined,
          ai_landing_page: attribution.aiLandingPage || undefined,
          ai_referrer: attribution.aiReferrer || undefined,
          utm_source: attribution.utmSource || undefined,
          utm_medium: attribution.utmMedium || undefined,
          utm_campaign: attribution.utmCampaign || undefined,
          utm_content: attribution.utmContent || undefined,
          utm_term: attribution.utmTerm || undefined,
        } : {};

        posthog.capture({
          distinctId: lead.email,
          event: "contact_form_submitted",
          properties: {
            company_name: lead.companyName,
            outlets: lead.outlets,
            source: "website",
            ...attributionProps,
          },
        });
        await shutdownPostHog();
      } catch (analyticsError) {
        console.error("[leads] PostHog capture failed:", analyticsError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[leads] Failed to create lead:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
