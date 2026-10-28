import { getAdminApiUrl, getMcpBaseUrl } from "./mcp-widget-config";

export type CartLine = {
  id: string;
  merchandiseId: string;
  title: string;
  variantTitle: string;
  handle: string;
  image: string;
  quantity: number;
  price: string;
  lineTotal: string;
  currencyCode: string;
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  total: string;
  currencyCode: string;
  lines: CartLine[];
};

type AdminCartItem = {
  id: string;
  quantity: number;
  price: string | number;
  product?: {
    id?: string;
    name?: string | null;
    imageUrl?: string | null;
  } | null;
};

type AdminCart = {
  id: string;
  currencyCode: string;
  total: string | number;
  totalQuantity: number;
  items?: AdminCartItem[];
};

function mapAdminCart(cart: AdminCart): Cart {
  const baseUrl = getMcpBaseUrl();

  return {
    id: String(cart.id),
    checkoutUrl: `${baseUrl}/checkout?cart=${cart.id}`,
    totalQuantity: Number(cart.totalQuantity) || 0,
    total: String(cart.total ?? "0"),
    currencyCode: String(cart.currencyCode || "USD"),

    lines: (cart.items || []).map((item) => {
      const productName = (item.product?.name || "").trim() || "Cleanergy Battery";
      const handle = productName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "cleanergy-battery";

      const rawPrice = Number(item.price);
      const price = !isNaN(rawPrice) && rawPrice >= 0 ? rawPrice.toFixed(2) : "0.00";
      const quantity = Number(item.quantity) || 1;
      const lineTotal = (!isNaN(rawPrice) ? (rawPrice * quantity).toFixed(2) : "0.00");

      return {
        id: String(item.id),
        merchandiseId: String(item.product?.id || ""),
        title: productName,
        variantTitle: "Default",
        handle,
        image: item.product?.imageUrl || "",
        quantity,
        price,
        lineTotal,
        currencyCode: String(cart.currencyCode || "USD"),
      };
    }),
  };
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const cleanId = (cartId || "").trim();
  if (!cleanId) {
    return null;
  }

  const adminApiUrl = getAdminApiUrl();
  const response = await fetch(`${adminApiUrl}/api/cart/${encodeURIComponent(cleanId)}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || errorData?.error || "Failed to fetch cart from Admin backend"
    );
  }

  const data = await response.json().catch(() => null);
  if (!data?.cart) {
    return null;
  }

  return mapAdminCart(data.cart);
}

export async function addToCart({
  cartId,
  merchandiseId,
  quantity = 1,
}: {
  cartId?: string;
  merchandiseId: string;
  quantity?: number;
}): Promise<Cart> {
  const numQuantity = Number(quantity);
  if (!Number.isInteger(numQuantity) || numQuantity <= 0) {
    throw new Error("Quantity must be a positive integer.");
  }

  if (!merchandiseId || typeof merchandiseId !== "string") {
    throw new Error("Product ID is required.");
  }

  const adminApiUrl = getAdminApiUrl();
  const response = await fetch(`${adminApiUrl}/api/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cartId: cartId?.trim() || undefined,
      productId: merchandiseId.trim(),
      quantity: numQuantity,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || errorData?.error || "Failed to add product to cart"
    );
  }

  const data = await response.json().catch(() => null);
  if (!data?.cart) {
    throw new Error("Invalid cart response received from Admin backend");
  }

  return mapAdminCart(data.cart);
}

export async function updateCartQuantity({
  cartId,
  lineId,
  quantity,
}: {
  cartId: string;
  lineId: string;
  quantity: number;
}): Promise<Cart> {
  const numQuantity = Number(quantity);

  if (numQuantity <= 0) {
    return removeFromCart({
      cartId,
      lineId,
    });
  }

  if (!Number.isInteger(numQuantity)) {
    throw new Error("Quantity must be a positive integer.");
  }

  const adminApiUrl = getAdminApiUrl();
  const response = await fetch(
    `${adminApiUrl}/api/cart/${encodeURIComponent(cartId.trim())}/items/${encodeURIComponent(lineId.trim())}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity: numQuantity,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || errorData?.error || "Failed to update cart quantity"
    );
  }

  const data = await response.json().catch(() => null);
  if (!data?.cart) {
    throw new Error("Invalid cart response received from Admin backend");
  }

  return mapAdminCart(data.cart);
}

export async function removeFromCart({
  cartId,
  lineId,
}: {
  cartId: string;
  lineId: string;
}): Promise<Cart> {
  const adminApiUrl = getAdminApiUrl();
  const response = await fetch(
    `${adminApiUrl}/api/cart/${encodeURIComponent(cartId.trim())}/items/${encodeURIComponent(lineId.trim())}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || errorData?.error || "Failed to remove product from cart"
    );
  }

  const data = await response.json().catch(() => null);
  if (!data?.cart) {
    throw new Error("Invalid cart response received from Admin backend");
  }

  return mapAdminCart(data.cart);
}