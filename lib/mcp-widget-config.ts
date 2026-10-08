export const PRODUCT_WIDGET_URI = "ui://product-catalog/product-widget.html";
export const WIDGET_MIME_TYPE = "text/html;profile=mcp-app";

export function getAppOrigin() {
  const configuredOrigin =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.APP_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;

  if (!configuredOrigin) {
    return `${process.env.ADMIN_API_URL}`;
  }

  const origin = configuredOrigin.startsWith("http")
    ? configuredOrigin
    : `https://${configuredOrigin}`;

  return origin.replace(/\/$/, "");
}

export function productWidgetToolMeta() {
  return {
    ui: {
      resourceUri: PRODUCT_WIDGET_URI,
      visibility: ["model", "app"],
    },
    "openai/outputTemplate": PRODUCT_WIDGET_URI,
    "openai/widgetAccessible": true,
    "openai/toolInvocation/invoking": "Loading products",
    "openai/toolInvocation/invoked": "Products loaded",
  };
}

export function productWidgetResourceMeta(
  widgetDomain: string,
  description: string
) {
  return {
    ui: {
      prefersBorder: true,
      domain: widgetDomain,
      csp: {
        connectDomains: [widgetDomain],
        resourceDomains: [widgetDomain],
      },
    },

    "openai/widgetDescription": description,

    "openai/widgetDomain": widgetDomain,

    "openai/widgetPrefersBorder": true,

    "openai/widgetCSP": {
      connect_domains: [widgetDomain],
      resource_domains: [widgetDomain],
      redirect_domains: [
        "checkout.stripe.com",
      ],
    },
  };
}
