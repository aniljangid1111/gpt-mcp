import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch(
      `${process.env.ADMIN_API_URL}/api/stripe/checkout`,
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