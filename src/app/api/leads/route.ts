import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[leads] Failed to create lead:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
