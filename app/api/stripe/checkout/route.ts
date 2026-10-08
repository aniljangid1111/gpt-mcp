import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCart } from "@/lib/cart";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { cartId } = await req.json();

    if (!cartId) {
      return NextResponse.json(
        { error: "Cart ID is required" },
        { status: 400 }
      );
    }

    const cart = await getCart(cartId);

    if (!cart || cart.lines.length === 0) {
      return NextResponse.json(
        { error: "Cart not found or empty" },
        { status: 404 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: cart.lines.map((line) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: line.title,
            images: line.image ? [line.image] : [],
          },
          unit_amount: Math.round(Number(line.price) * 100),
        },
        quantity: line.quantity,
      })),

      success_url: `${new URL(req.url).origin}/checkout?cart=${cart.id}&success=true`,
      cancel_url: `${new URL(req.url).origin}/checkout?cart=${cart.id}`,

      metadata: {
        cartId: cart.id,
      },
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return NextResponse.json(
      { error: "Unable to create Stripe checkout session" },
      { status: 500 }
    );
  }
}