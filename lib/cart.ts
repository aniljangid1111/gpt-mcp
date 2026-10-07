import productsData from "@/data/products.json";

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

type LocalCart = Cart;

/**
 * Temporary in-memory carts.
 *
 * This is only for MCP/local testing.
 * Server restart/reload can clear the carts.
 */
const carts = new Map<string, LocalCart>();

function generateId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 9)}`;
}

function findProduct(merchandiseId: string) {
  return productsData.find(
    (product) =>
      product.id === merchandiseId ||
      `local:${product.id}` === merchandiseId
  );
}

function createCart(): Cart {
  const id = generateId("cart");

  const cart: Cart = {
    id,
    checkoutUrl: `/checkout?cart=${id}`,
    totalQuantity: 0,
    total: "0.00",
    currencyCode: "INR",
    lines: [],
  };

  carts.set(id, cart);

  return cart;
}

function calculateCart(cart: Cart): Cart {
  const totalQuantity = cart.lines.reduce(
    (total, line) => total + line.quantity,
    0
  );

  const total = cart.lines
    .reduce(
      (sum, line) =>
        sum + Number(line.price) * line.quantity,
      0
    )
    .toFixed(2);

  return {
    ...cart,
    totalQuantity,
    total,
  };
}

export async function getCart(
  cartId: string
): Promise<Cart | null> {
  return carts.get(cartId) ?? null;
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

  const product = findProduct(merchandiseId);

  if (!product) {
    throw new Error(
      `Product not found for merchandiseId: ${merchandiseId}`
    );
  }

  let cart = cartId ? carts.get(cartId) : undefined;

  if (!cart) {
    cart = createCart();
  }

  const existingLine = cart.lines.find(
    (line) =>
      line.merchandiseId === product.id
  );

  if (existingLine) {
    existingLine.quantity += quantity;

    existingLine.lineTotal = (
      Number(existingLine.price) *
      existingLine.quantity
    ).toFixed(2);
  } else {
    const price = Number(product.price).toFixed(2);

    const line: CartLine = {
      id: generateId("line"),
      merchandiseId: product.id,
      title: product.title,
      variantTitle: "Default",
      handle: product.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
      image: product.image,
      quantity,
      price,
      lineTotal: (
        Number(price) * quantity
      ).toFixed(2),
      currencyCode: product.currency ?? "INR",
    };

    cart.lines.push(line);
  }

  const updatedCart = calculateCart(cart);

  carts.set(updatedCart.id, updatedCart);

  return updatedCart;
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
  const cart = carts.get(cartId);

  if (!cart) {
    throw new Error(`Cart not found: ${cartId}`);
  }

  if (quantity <= 0) {
    return removeFromCart({
      cartId,
      lineId,
    });
  }

  const line = cart.lines.find(
    (line) => line.id === lineId
  );

  if (!line) {
    throw new Error(
      `Cart line not found: ${lineId}`
    );
  }

  line.quantity = quantity;

  line.lineTotal = (
    Number(line.price) * quantity
  ).toFixed(2);

  const updatedCart = calculateCart(cart);

  carts.set(updatedCart.id, updatedCart);

  return updatedCart;
}

export async function removeFromCart({
  cartId,
  lineId,
}: {
  cartId: string;
  lineId: string;
}): Promise<Cart> {
  const cart = carts.get(cartId);

  if (!cart) {
    throw new Error(`Cart not found: ${cartId}`);
  }

  const lineExists = cart.lines.some(
    (line) => line.id === lineId
  );

  if (!lineExists) {
    throw new Error(
      `Cart line not found: ${lineId}`
    );
  }

  cart.lines = cart.lines.filter(
    (line) => line.id !== lineId
  );

  const updatedCart = calculateCart(cart);

  carts.set(updatedCart.id, updatedCart);

  return updatedCart;
}