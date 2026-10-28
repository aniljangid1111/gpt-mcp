import { NextResponse } from "next/server";
import { getAdminApiUrl } from "@/lib/mcp-widget-config";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const adminApiUrl = getAdminApiUrl();

    const response = await fetch(
      `${adminApiUrl}/api/stripe/checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Stripe checkout proxy error:", error);

    return NextResponse.json(
      {
        error: "Unable to create Stripe checkout session",
      },
      { status: 500 }
    );
  }
}