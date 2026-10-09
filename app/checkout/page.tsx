
import { getCart } from "@/lib/cart";
import StripeButton from "./StripeButton";
import type { CSSProperties } from "react";
import InvoiceDownloadButton from "./InvoiceDownloadButton";

type OrderResult = {
  success: boolean;
  status?: "PAID" | "PENDING" | "CANCELLED" | "FAILED";
  order?: {
    id: string;
    currency: string;
    totalAmount: number;
    customerName?: string | null;
    customerEmail?: string | null;
    customerPhone?: string | null;
    addressLine1?: string | null;
    addressLine2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    country?: string | null;
    items: {
      id: string;
      productName: string;
      imageUrl?: string | null;
      unitPrice: number;
      quantity: number;
    }[];
    payment?: {
      status: string;
      stripePaymentIntentId?: string | null;
    } | null;
  };
};

type CheckoutPageProps = {
  searchParams: Promise<{
    cart?: string;
    orderId?: string;
    session_id?: string;
    status?: string;
  }>;
};

const money = (cents: number, currency = "usd") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);

function MessagePage({
  title,
  message,
  color,
}: {
  title: string;
  message: string;
  color: string;
}) {
  return (
    <main style={styles.container}>
      <section style={styles.card}>
        <div style={{ ...styles.statusIcon, color }}>{title === "Payment successful" ? "✓" : "!"}</div>
        <h1 style={styles.heading}>{title}</h1>
        <p style={styles.muted}>{message}</p>
        <a href="/" style={styles.button}>Continue shopping</a>
      </section>
    </main>
  );
}

async function getVerifiedOrder(
  orderId: string,
  sessionId: string
): Promise<OrderResult | null> {
  const adminUrl = process.env.ADMIN_API_URL?.replace(/\/$/, "");
  if (!adminUrl) return null;

  try {
    const query = new URLSearchParams({
      orderId,
      session_id: sessionId,
    });

    const response = await fetch(
      `${adminUrl}/api/orders/verify?${query.toString()}`,
      { cache: "no-store" }
    );

    if (!response.ok) return null;
    return (await response.json()) as OrderResult;
  } catch (error) {
    console.error("Order result fetch failed:", error);
    return null;
  }
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const params = await searchParams;

  // Stripe cancelled or customer returned without completing checkout.
  if (params.status === "cancelled") {
    return (
      <MessagePage
        title="Payment not completed"
        message="Your payment was cancelled or checkout was not completed. Your cart has not been cleared."
        color="#b45309"
      />
    );
  }

  // Stripe has redirected back with an order and Checkout Session.
  if (params.orderId && params.session_id) {
    const result = await getVerifiedOrder(
      params.orderId,
      params.session_id
    );

    if (!result?.success || !result.order) {
      return (
        <MessagePage
          title="Payment confirmation pending"
          message="We could not confirm your order details just yet. Please refresh this page shortly or contact support with your order ID."
          color="#b45309"
        />
      );
    }

    if (result.status === "PENDING") {
      return (
        <MessagePage
          title="Confirming your payment"
          message={`Order ${result.order.id} is awaiting payment confirmation. Please refresh this page shortly.`}
          color="#b45309"
        />
      );
    }

    if (result.status === "FAILED" || result.status === "CANCELLED") {
      return (
        <MessagePage
          title="Payment unsuccessful"
          message={`Order ${result.order.id} has not been paid successfully. If your bank shows a debit, please contact support before trying again.`}
          color="#b91c1c"
        />
      );
    }

    const order = result.order;
    const address = [
      order.addressLine1,
      order.addressLine2,
      order.city,
      order.state,
      order.postalCode,
      order.country,
    ].filter(Boolean).join(", ");



    return (
      <main style={styles.container}>
        <section style={styles.card}>
          <div style={{ ...styles.statusIcon, color: "#15803d" }}>✓</div>
          <p style={styles.eyebrow}>CLEANERGY BATTERY</p>
          <h1 style={styles.heading}>Payment successful!</h1>
          <p style={styles.muted}>
            Thank you for your order. Your payment has been verified.
          </p>

          <div style={styles.orderNumber}>
            <span style={styles.orderIdLabel}>Order ID</span>
            <strong style={styles.orderIdValue}>{order.id}</strong>
          </div>

          <h2 style={styles.subheading}>Order summary</h2>
          {order.items.map((item) => (
            <div key={item.id} style={styles.product}>
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  width={40}
                  height={40}
                  style={styles.image}
                />
              ) : (
                <div style={styles.imagePlaceholder}>Product</div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <strong style={styles.productTitle}>{item.productName}</strong>
                <p style={styles.small}>Quantity: {item.quantity}</p>
                <p style={styles.small}>
                  {money(item.unitPrice, order.currency)} each
                </p>
              </div>

              <strong style={styles.productPrice}>
                {money(item.unitPrice * item.quantity, order.currency)}
              </strong>
            </div>
          ))}

          <div style={styles.totalRow}>
            <span>Total paid</span>
            <strong>{money(order.totalAmount, order.currency)}</strong>
          </div>

          <h2 style={styles.subheading}>Customer details</h2>
          <div style={styles.details}>
            <p style={styles.customerLine}><strong>Name:</strong> {order.customerName || "Not provided"}</p>
            <p style={styles.customerLine}><strong>Email:</strong> {order.customerEmail || "Not provided"}</p>
            <p style={styles.customerLine}><strong>Mobile:</strong> {order.customerPhone || "Not provided"}</p>
            <p style={styles.customerLine}><strong>Address:</strong> {address || "Not provided"}</p>
          </div>

          <div style={styles.paidBadge}>Payment status: PAID</div>

          <p style={styles.confirmText}>
            Your payment was successful and your order is confirmed.
          </p>

          <InvoiceDownloadButton
            orderId={order.id}
            currency={order.currency}
            totalAmount={order.totalAmount}
            customerName={order.customerName}
            customerEmail={order.customerEmail}
            customerPhone={order.customerPhone}
            address={address}
            items={order.items}
          />

          <p style={styles.closeNote}>
            Keep your invoice for your records. You can close this page when you're done.
          </p>
        </section>
      </main>
    );
  }

  // Existing cart preview before the customer starts Stripe Checkout.
  const cartId = params.cart;

  if (!cartId) {
    return (
      <MessagePage
        title="Checkout"
        message="No cart or order was found."
        color="#b45309"
      />
    );
  }

  const cart = await getCart(cartId);

  if (!cart) {
    return (
      <MessagePage
        title="Cart not found"
        message="This cart could not be found or has expired."
        color="#b45309"
      />
    );
  }

  return (
    <main style={styles.container}>
      <section style={styles.card}>
        <p style={styles.eyebrow}>CLEANERGY BATTERY</p>
        <h1 style={styles.heading}>Review your order</h1>

        {cart.lines.map((line) => (
          <div key={line.id} style={styles.product}>
            {line.image ? (
              <img
                src={line.image}
                alt={line.title}
                width={40}
                height={40}
                style={styles.image}
              />
            ) : (
              <div style={styles.imagePlaceholder}>Product</div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong style={styles.productTitle}>{line.title}</strong>
              <p style={styles.small}>Quantity: {line.quantity}</p>
              <p style={styles.small}>${line.lineTotal}</p>
            </div>
          </div>
        ))}

        <div style={styles.totalRow}>
          <span>Total</span>
          <strong>${cart.total}</strong>
        </div>

        <p style={styles.muted}>
          Your name, email, phone and address will be collected securely at Stripe Checkout.
        </p>
        <StripeButton cartId={cart.id} />
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f7f5",
    padding: "12px",
    fontFamily: "Arial, sans-serif",
    color: "#17211b",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: 520,
    maxHeight: "calc(100vh - 24px)",
    overflowY: "auto",
    background: "#fff",
    borderRadius: 14,
    padding: "14px 18px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    boxSizing: "border-box",
  },
  closeNote: {
    color: "#647067",
    fontSize: 11,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 0,
    lineHeight: 1.3,
  },
  statusIcon: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "#ecfdf3",
    display: "grid",
    placeItems: "center",
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 6,
  },
  eyebrow: {
    color: "#15803d",
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: 700,
    margin: "0 0 2px",
  },
  heading: {
    fontSize: 19,
    margin: "2px 0 4px",
    fontWeight: 700,
  },
  subheading: {
    fontSize: 13,
    fontWeight: 700,
    marginTop: 8,
    marginBottom: 4,
    paddingBottom: 4,
    borderBottom: "1px solid #e5e7eb",
  },
  muted: {
    color: "#647067",
    lineHeight: 1.35,
    fontSize: 12.5,
    margin: "0 0 5px",
  },
  small: {
    margin: "1px 0",
    fontSize: 11,
    color: "#647067",
  },
  product: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "5px 0",
    borderBottom: "1px solid #edf0ed",
  },
  productTitle: {
    fontSize: 12.5,
    lineHeight: 1.3,
  },
  productPrice: {
    fontSize: 13,
  },
  image: {
    width: 40,
    height: 40,
    objectFit: "cover",
    borderRadius: 6,
    background: "#f3f4f6",
    flexShrink: 0,
  },
  imagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 6,
    background: "#f3f4f6",
    display: "grid",
    placeItems: "center",
    fontSize: 9,
    color: "#647067",
    flexShrink: 0,
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 0",
    fontSize: 14,
    fontWeight: 700,
  },
  orderNumber: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    padding: "6px 10px",
    background: "#f8faf8",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    overflowWrap: "anywhere",
    margin: "5px 0",
  },
  orderIdLabel: {
    color: "#647067",
    fontSize: 11,
    lineHeight: 1.2,
  },
  orderIdValue: {
    fontSize: 12,
    lineHeight: 1.3,
  },
  details: {
    background: "#f8faf8",
    borderRadius: 8,
    padding: "6px 10px",
    overflowWrap: "anywhere",
    margin: "4px 0",
  },
  paidBadge: {
    color: "#166534",
    background: "#dcfce7",
    padding: "5px 8px",
    borderRadius: 6,
    textAlign: "center",
    fontWeight: 700,
    fontSize: 12,
    marginTop: 6,
  },
  confirmText: {
    fontSize: 12,
    color: "#4b5563",
    margin: "5px 0 6px",
    textAlign: "center",
  },
  button: {
    display: "inline-block",
    background: "#166534",
    color: "#fff",
    padding: "9px 16px",
    borderRadius: 8,
    textDecoration: "none",
    fontWeight: 700,
    marginTop: 12,
    fontSize: 13,
  },
  customerLine: {
    margin: "2px 0",
    fontSize: 12,
    lineHeight: 1.35,
  },
};