import { getCart } from "@/lib/cart";
import StripeButton from "./StripeButton";

type CheckoutPageProps = {
  searchParams: Promise<{
    cart?: string;
  }>;
};

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const params = await searchParams;
  const cartId = params.cart;

  if (!cartId) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Checkout</h1>
        <p>No cart found.</p>
      </main>
    );
  }

  const cart = await getCart(cartId);

  if (!cart) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Checkout</h1>
        <p>Cart not found or expired.</p>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: 40,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Checkout</h1>

      <div style={{ marginTop: 30 }}>
        {cart.lines.map((line) => (
          <div
            key={line.id}
            style={{
              display: "flex",
              gap: 20,
              alignItems: "center",
              padding: "20px 0",
              borderBottom: "1px solid #ddd",
            }}
          >
            <img
              src={line.image}
              alt={line.title}
              width={80}
              height={80}
              style={{
                objectFit: "cover",
                borderRadius: 8,
              }}
            />

            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0 }}>
                {line.title}
              </h3>

              <p>Quantity: {line.quantity}</p>

              <p>${line.lineTotal}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 30 }}>
        <h2>Total: ${cart.total}</h2>

        <StripeButton cartId={cart.id} />
      </div>
    </main>
  );
}