import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import {
  getAppOrigin,
  productWidgetResourceMeta,
  productWidgetToolMeta,
  PRODUCT_WIDGET_URI,
  WIDGET_MIME_TYPE,
} from "@/lib/mcp-widget-config";
import { buildProductToolResult } from "@/lib/product-tool-result";
import { createProductWidgetHtml } from "@/lib/product-widget-html";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "@/lib/cart";
import {
  filterProducts,
  getFeaturedProducts,
  getProductForCheckout,
  getProducts,
  getProductsByTag,
  getProductsUnderPrice,
  getRecommendedProducts,
  isCatalogWideQuery,
} from "@/lib/products";

const optionalQuerySchema = z.object({
  query: z
    .string()
    .optional()
    .describe(
      "Optional search keywords. Leave empty or use 'all' / 'all products' to list the entire catalog."
    ),
});

const requiredQuerySchema = z.object({
  query: z
    .string()
    .describe(
      "Search keywords such as snowboard or gift card. Use 'all' or 'all products' to list the full catalog."
    ),
});

const optionalSeedSchema = z.object({
  seed: z
    .string()
    .optional()
    .describe("Optional product name, handle, or theme to recommend similar products from."),
});

const priceFilterSchema = z.object({
  maxPrice: z
    .number()
    .positive()
    .describe("Maximum product price in USD, such as 500 or 1000."),
});

const productFilterSchema = z.object({
  query: z
    .string()
    .optional()
    .describe("Optional keyword such as headphones, snowboard, speaker, title text, handle text, or description text."),
  tag: z
    .string()
    .optional()
    .describe("Optional exact product tag, such as Winter, Sport, audio, or wireless."),
  vendor: z
    .string()
    .optional()
    .describe("Optional exact product brand name."),
  minPrice: z
    .number()
    .positive()
    .optional()
    .describe("Optional minimum product price."),
  maxPrice: z
    .number()
    .positive()
    .optional()
    .describe("Optional maximum product price."),
  limit: z
    .number()
    .int()
    .positive()
    .max(20)
    .optional()
    .describe("Maximum number of products to return. Defaults to 12."),
});

const addToCartSchema = z.object({
  merchandiseId: z
    .string()
    .describe("The product variant ID to add. Accepts either a numeric ID or a variant ID."),
  cartId: z
    .string()
    .optional()
    .describe("Existing cart ID. Omit this to create a cart automatically."),
  quantity: z
    .number()
    .int()
    .positive()
    .optional()
    .describe("Quantity to add. Defaults to 1."),
});

const cartIdSchema = z.object({
  cartId: z.string().describe("The cart ID."),
});

const updateCartQuantitySchema = z.object({
  cartId: z.string().describe("The cart ID."),
  lineId: z.string().describe("The cart line ID to update."),
  quantity: z
    .number()
    .int()
    .min(0)
    .describe("New quantity. If 0, the line is removed."),
});

const removeFromCartSchema = z.object({
  cartId: z.string().describe("The cart ID."),
  lineId: z.string().describe("The cart line ID to remove."),
});

const checkoutCartSchema = z.object({
  cartId: z.string().describe("The cart ID to checkout."),
});

const checkoutOutputSchema = z.object({
  success: z.boolean(),
  url: z.string(),
});


const verifyPaymentSchema = z.object({
  orderId: z.string().describe("The Cleanergy order ID returned during checkout."),
  sessionId: z.string().describe("The Stripe Checkout Session ID from the return URL."),
});

const verifyPaymentOutputSchema = z.object({
  success: z.boolean(),
  status: z.string(),
  orderId: z.string(),
  message: z.string(),
  total: z.string(),
  currency: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      quantity: z.number(),
    })
  ),
});

const productOutputSchema = z.object({
  count: z.number(),
  label: z.string(),
  products: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      brand: z.string(),
      tags: z.array(z.string()),
      image: z.string(),
      images: z.array(z.string()),
      price: z.string(),
      handle: z.string(),
      productUrl: z.string(),
      checkoutUrl: z.string(),
      variantId: z.string(),
      variantGid: z.string(),
    })
  ),
});

const cartLineSchema = z.object({
  id: z.string(),
  merchandiseId: z.string(),
  title: z.string(),
  variantTitle: z.string(),
  handle: z.string(),
  image: z.string(),
  quantity: z.number(),
  price: z.string(),
  lineTotal: z.string(),
  currencyCode: z.string(),
});

const cartOutputSchema = z.object({
  label: z.string(),
  cart: z
    .object({
      id: z.string(),
      checkoutUrl: z.string(),
      totalQuantity: z.number(),
      total: z.string(),
      currencyCode: z.string(),
      lines: z.array(cartLineSchema),
    })
    .nullable(),
});

async function runProductTool(query?: string) {
  const products = await getProducts(query);
  const label = isCatalogWideQuery(query)
    ? `Loaded ${products.length} products from the catalog.`
    : `Showing ${products.length} products for ${query}.`;

  return { products, label };
}

async function runCheckoutTool(query: string) {
  const product = await getProductForCheckout(query);
  const products = product ? [product] : [];
  const label = product
    ? `Ready to checkout: ${product.title}.`
    : `No checkout product found for ${query}.`;

  return { products, label };
}

function buildCartToolResult(cart: Awaited<ReturnType<typeof getCart>>, label: string) {
  const structuredContent = {
    label,
    cart,
  };

  return {
    content: [
      {
        type: "text" as const,
        text: label,
      },
    ],
    structuredContent,
    _meta: {
      cart,
    },
  };
}

const handler = createMcpHandler(
  async (server) => {
    const widgetDomain = getAppOrigin();
    const widgetHtml = createProductWidgetHtml();
    const widgetDescription =
      "Interactive product catalog grid with images, prices, and links.";
    const widgetMeta = productWidgetToolMeta();
    const resourceMeta = productWidgetResourceMeta(widgetDomain, widgetDescription);

    server.registerResource(
      "product-widget",
      PRODUCT_WIDGET_URI,
      {
        title: "Product Catalog",
        description: widgetDescription,
        mimeType: WIDGET_MIME_TYPE,
        _meta: resourceMeta,
      },
      async () => ({
        contents: [
          {
            uri: PRODUCT_WIDGET_URI,
            mimeType: WIDGET_MIME_TYPE,
            text: widgetHtml,
            _meta: resourceMeta,
          },
        ],
      })
    );

    const registerProductTool = (
      name: string,
      title: string,
      description: string,
      inputSchema: z.ZodObject<z.ZodRawShape>,
      handlerFn: (args: Record<string, unknown>) => Promise<{ products: Awaited<ReturnType<typeof getProducts>>; label: string }>
    ) => {
      server.registerTool(
        name,
        {
          title,
          description,
          inputSchema,
          outputSchema: productOutputSchema,
          annotations: {
            readOnlyHint: true,
          },
          _meta: widgetMeta,
        },
        async (args) => {
          const { products, label } = await handlerFn(args);
          return buildProductToolResult(products, label);
        }
      );
    };

    registerProductTool(
      "search_products",
      "Search Products",
      "Search products by keyword and return only actual matches. Use query 'all' or 'all products' to list everything.",
      requiredQuerySchema,
      async (args) => runProductTool(args.query as string)
    );

    registerProductTool(
      "list_all_products",
      "List All Products",
      "List the full local catalog in an interactive grid widget. Use when the user asks to show all products.",
      z.object({}),
      async () => runProductTool()
    );

    registerProductTool(
      "show_products",
      "Show Products",
      "Show exact product matches in the widget. Omit query or pass 'all' to list the full catalog.",
      optionalQuerySchema,
      async (args) => runProductTool(args.query as string | undefined)
    );

    registerProductTool(
      "featured_products",
      "Featured Products",
      "Show a polished carousel of featured products with product and checkout actions.",
      z.object({}),
      async () => {
        const products = await getFeaturedProducts();
        return {
          products,
          label: `Showing ${products.length} featured products.`,
        };
      }
    );

    registerProductTool(
      "products_under_price",
      "Products Under Price",
      "Show products under a maximum price in a carousel with checkout actions.",
      priceFilterSchema,
      async (args) => {
        const maxPrice = Number(args.maxPrice);
        const products = await getProductsUnderPrice(maxPrice);
        return {
          products,
          label: `Showing ${products.length} products under $${maxPrice}.`,
        };
      }
    );

    registerProductTool(
      "filter_products",
      "Filter Products",
      "Search and filter products by keyword, exact tag, exact brand, min price, and max price. Use this for requests like headphones under $100.",
      productFilterSchema,
      async (args) => {
        const products = await filterProducts({
          query: args.query as string | undefined,
          tag: args.tag as string | undefined,
          vendor: args.vendor as string | undefined,
          minPrice: args.minPrice as number | undefined,
          maxPrice: args.maxPrice as number | undefined,
          limit: args.limit as number | undefined,
        });
        const labelParts = [
          args.query ? `"${args.query}"` : "products",
          args.tag ? `tagged ${args.tag}` : "",
          args.vendor ? `from ${args.vendor}` : "",
          args.minPrice ? `from $${args.minPrice}` : "",
          args.maxPrice ? `under $${args.maxPrice}` : "",
        ].filter(Boolean);

        return {
          products,
          label: `Showing ${products.length} ${labelParts.join(" ")}.`,
        };
      }
    );

    registerProductTool(
      "winter_sports_products",
      "Winter Sports Products",
      "Show winter or sports products from the catalog in a rich carousel.",
      z.object({}),
      async () => {
        const products = await getProductsByTag("Winter");
        return {
          products,
          label: `Showing ${products.length} winter sports products.`,
        };
      }
    );

    registerProductTool(
      "recommend_products",
      "Recommend Products",
      "Recommend related products from a product name, handle, or shopping theme.",
      optionalSeedSchema,
      async (args) => {
        const seed = args.seed as string | undefined;
        const products = await getRecommendedProducts(seed);
        return {
          products,
          label: seed
            ? `Showing ${products.length} recommendations for ${seed}.`
            : `Showing ${products.length} recommended products.`,
        };
      }
    );

    registerProductTool(
      "create_checkout_link",
      "Create Checkout Link",
      "Find a product and show a checkout-ready card with a direct cart checkout action.",
      requiredQuerySchema,
      async (args) => runCheckoutTool(args.query as string)
    );

    server.registerTool(
      "add_to_cart",
      {
        title: "Add To Cart",
        description:
          "Add a product variant to the cart. If cartId is omitted, create the cart automatically.",
        inputSchema: addToCartSchema,
        outputSchema: cartOutputSchema,
        annotations: {
          readOnlyHint: false,
        },
        _meta: widgetMeta,
      },
      async (args) => {
        const cart = await addToCart({
          cartId: args.cartId as string | undefined,
          merchandiseId: args.merchandiseId as string,
          quantity: (args.quantity as number | undefined) ?? 1,
        });

        return buildCartToolResult(
          cart,
          `Added item to cart. Cart now has ${cart.totalQuantity} item${cart.totalQuantity === 1 ? "" : "s"}.`
        );
      }
    );

    server.registerTool(
      "view_cart",
      {
        title: "View Cart",
        description: "View the current cart with items, quantities, totals, and checkout URL.",
        inputSchema: cartIdSchema,
        outputSchema: cartOutputSchema,
        annotations: {
          readOnlyHint: true,
        },
        _meta: widgetMeta,
      },
      async (args) => {
        const cart = await getCart(args.cartId as string);

        return buildCartToolResult(
          cart,
          cart
            ? `Cart has ${cart.totalQuantity} item${cart.totalQuantity === 1 ? "" : "s"}.`
            : "Cart was not found."
        );
      }
    );

    server.registerTool(
      "update_cart_quantity",
      {
        title: "Update Cart Quantity",
        description:
          "Update a cart line quantity. Passing 0 removes the product from the cart.",
        inputSchema: updateCartQuantitySchema,
        outputSchema: cartOutputSchema,
        annotations: {
          readOnlyHint: false,
        },
        _meta: widgetMeta,
      },
      async (args) => {
        const cart = await updateCartQuantity({
          cartId: args.cartId as string,
          lineId: args.lineId as string,
          quantity: args.quantity as number,
        });

        return buildCartToolResult(
          cart,
          `Updated cart. Cart now has ${cart.totalQuantity} item${cart.totalQuantity === 1 ? "" : "s"}.`
        );
      }
    );

    server.registerTool(
      "remove_from_cart",
      {
        title: "Remove From Cart",
        description: "Remove a product line from the cart.",
        inputSchema: removeFromCartSchema,
        outputSchema: cartOutputSchema,
        annotations: {
          readOnlyHint: false,
        },
        _meta: widgetMeta,
      },
      async (args) => {
        const cart = await removeFromCart({
          cartId: args.cartId as string,
          lineId: args.lineId as string,
        });

        return buildCartToolResult(
          cart,
          `Removed item from cart. Cart now has ${cart.totalQuantity} item${cart.totalQuantity === 1 ? "" : "s"}.`
        );
      }
    );

    server.registerTool(
      "checkout_cart",
      {
        title: "Checkout Cart",
        description:
          "Create a Stripe Checkout session for the current cart and return the Stripe payment URL.",
        inputSchema: checkoutCartSchema,
        outputSchema: checkoutOutputSchema,
        annotations: {
          readOnlyHint: false,
        },
        _meta: {
          ...widgetMeta,
          "openai/widgetAccessible": true,
        },
      },
      async (args) => {
        const adminApiUrl = process.env.ADMIN_API_URL;

        if (!adminApiUrl) {
          throw new Error(
            "ADMIN_API_URL environment variable is missing"
          );
        }

        const response = await fetch(
          `${adminApiUrl}/api/stripe/checkout`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cartId: args.cartId as string,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
            "Failed to create Stripe checkout session"
          );
        }

        return {
          content: [
            {
              type: "text" as const,
              text: "Stripe checkout is ready.",
            },
          ],
          structuredContent: {
            success: true,
            url: data.url,
          },
        };
      }
    );


    server.registerTool(
      "verify_payment",
      {
        title: "Verify Payment",
        description:
          "Verify a Cleanergy Battery order using its order ID and Stripe Checkout Session ID. Use this after checkout to confirm whether payment was successful, pending, or unsuccessful.",
        inputSchema: verifyPaymentSchema,
        outputSchema: verifyPaymentOutputSchema,
        annotations: {
          readOnlyHint: true,
        },
        _meta: widgetMeta,
      },
      async (args) => {
        const adminApiUrl = process.env.ADMIN_API_URL;

        if (!adminApiUrl) {
          throw new Error("ADMIN_API_URL environment variable is missing");
        }

        const query = new URLSearchParams({
          orderId: args.orderId,
          session_id: args.sessionId,
        });

        const response = await fetch(
          `${adminApiUrl}/api/orders/verify?${query.toString()}`,
          { cache: "no-store" }
        );

        const data = await response.json();

        if (!response.ok || !data.success || !data.order) {
          throw new Error(data.error || "Unable to verify payment");
        }

        const order = data.order;
        const currency = String(order.currency || "usd").toUpperCase();
        const total = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
        }).format(Number(order.totalAmount) / 100);

        const message =
          data.status === "PAID"
            ? `Payment confirmed for order ${order.id}.`
            : data.status === "PENDING"
              ? `Payment is still pending for order ${order.id}.`
              : `Order ${order.id} is ${String(data.status).toLowerCase()}.`;

        const result = {
          success: true,
          status: data.status,
          orderId: order.id,
          message,
          total,
          currency,
          items: order.items.map((item: {
            productName: string;
            quantity: number;
          }) => ({
            name: item.productName,
            quantity: item.quantity,
          })),
        };

        return {
          content: [{ type: "text" as const, text: message }],
          structuredContent: result,
        };
      }
    );

  },
  {
    serverInfo: {
      name: "product-catalog",
      version: "1.0.0",
    },
    instructions:
      "Always call a product tool for catalog requests. For filtered requests involving price, tag, vendor, or specific constraints, prefer filter_products. Do not add extra products that were not returned by the tool. Do not list products in markdown tables. The widget shows exactly the products in structuredContent.",
  }
);

export const GET = handler;
export const POST = handler;
