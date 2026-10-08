"use client";

type StripeButtonProps = {
  cartId: string;
};

export default function StripeButton({
  cartId,
}: StripeButtonProps) {
  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Stripe checkout failed");
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      alert("Unable to start Stripe checkout");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      style={{
        width: "100%",
        padding: "14px 20px",
        border: "none",
        borderRadius: 8,
        background: "#000",
        color: "#fff",
        fontSize: 16,
        cursor: "pointer",
      }}
    >
      Pay with Stripe
    </button>
  );
}