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
  price: string;
  product: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
};

type AdminCart = {
  id: string;
  currencyCode: string;
  total: string;
  totalQuantity: number;
  items: AdminCartItem[];
};

const ADMIN_API_URL = process.env.ADMIN_API_URL;

function mapAdminCart(cart: AdminCart): Cart {
  return {
    id: cart.id,
    checkoutUrl: `/checkout?cart=${cart.id}`,
    totalQuantity: cart.totalQuantity,
    total: String(cart.total),
    currencyCode: cart.currencyCode,

    lines: cart.items.map((item) => {
      const handle = item.product.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      return {
        id: item.id,
        merchandiseId: item.product.id,
        title: item.product.name,
        variantTitle: "Default",
        handle,
        image: item.product.imageUrl || "",
        quantity: item.quantity,
        price: String(item.price),
        lineTotal: (
          Number(item.price) * item.quantity
        ).toFixed(2),
        currencyCode: cart.currencyCode,
      };
    }),
  };
}

export async function getCart(
  cartId: string
): Promise<Cart | null> {
  const response = await fetch(
    `${ADMIN_API_URL}/cart/${cartId}`,
    {
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch cart from Admin API");
  }

  const data = await response.json();

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
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0.");
  }

  const response = await fetch(
    `${ADMIN_API_URL}/cart`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartId,
        productId: merchandiseId,
        quantity,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Failed to add product to cart"
    );
  }

  const data = await response.json();

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
  if (quantity <= 0) {
    return removeFromCart({
      cartId,
      lineId,
    });
  }

  const response = await fetch(
    `${ADMIN_API_URL}/cart/${cartId}/items/${lineId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message ||
      "Failed to update cart quantity"
    );
  }

  const data = await response.json();

  return mapAdminCart(data.cart);
}

export async function removeFromCart({
  cartId,
  lineId,
}: {
  cartId: string;
  lineId: string;
}): Promise<Cart> {
  const response = await fetch(
    `${ADMIN_API_URL}/cart/${cartId}/items/${lineId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message ||
      "Failed to remove product from cart"
    );
  }

  const data = await response.json();

  return mapAdminCart(data.cart);
}