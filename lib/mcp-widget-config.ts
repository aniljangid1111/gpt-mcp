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

export function getWidgetCsp(widgetDomain: string) {
  const rawDomains = [
    widgetDomain,
    "https://res.cloudinary.com",
    "https://images-static.nykaa.com",
    "https://encrypted-tbn1.gstatic.com",
  ];

  // OpenAI strictly requires valid HTTPS origins (rejects insecure http:// or invalid hosts)
  const httpsResourceDomains = Array.from(
    new Set(
      rawDomains
        .filter((d): d is string => typeof d === "string" && d.startsWith("https://"))
        .map((d) => d.replace(/\/$/, ""))
    )
  );

  const connectDomains = httpsResourceDomains.filter(
    (d) => !d.includes("cloudinary") && !d.includes("gstatic") && !d.includes("nykaa")
  );

  return {
    csp: {
      connectDomains: connectDomains.length > 0 ? connectDomains : httpsResourceDomains,
      resourceDomains: httpsResourceDomains,
    },
    openaiCsp: {
      connect_domains: connectDomains.length > 0 ? connectDomains : httpsResourceDomains,
      resource_domains: httpsResourceDomains,
      redirect_domains: ["checkout.stripe.com"],
    },
  };
}

export function productWidgetToolMeta(widgetDomain: string = getAppOrigin()) {
  const { csp, openaiCsp } = getWidgetCsp(widgetDomain);

  return {
    ui: {
      resourceUri: PRODUCT_WIDGET_URI,
      visibility: ["model", "app"],
      domain: widgetDomain.startsWith("https://") ? widgetDomain : undefined,
      csp,
    },
    "openai/outputTemplate": PRODUCT_WIDGET_URI,
    "openai/widgetAccessible": true,
    "openai/toolInvocation/invoking": "Loading products",
    "openai/toolInvocation/invoked": "Products loaded",
    "openai/widgetCSP": openaiCsp,
  };
}

export function productWidgetResourceMeta(
  widgetDomain: string,
  description: string
) {
  const { csp, openaiCsp } = getWidgetCsp(widgetDomain);

  return {
    ui: {
      prefersBorder: true,
      domain: widgetDomain.startsWith("https://") ? widgetDomain : undefined,
      csp,
    },

    "openai/widgetDescription": description,
    "openai/widgetDomain": widgetDomain,
    "openai/widgetPrefersBorder": true,

    "openai/widgetCSP": openaiCsp,
  };
}


