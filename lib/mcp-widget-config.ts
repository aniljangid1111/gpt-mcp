export const PRODUCT_WIDGET_URI = "ui://product-catalog/product-widget.html";
export const WIDGET_MIME_TYPE = "text/html;profile=mcp-app";

export function getAppOrigin(): string {
  const configuredOrigin =
    process.env.MCP_BASE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.APP_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined) ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

  if (!configuredOrigin) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("MCP_BASE_URL is not configured in production");
    }
    return "http://localhost:3001";
  }

  let origin = configuredOrigin.trim();
  if (!/^https?:\/\//i.test(origin)) {
    origin = `https://${origin}`;
  }

  if (
    process.env.NODE_ENV === "production" &&
    origin.startsWith("http://") &&
    !origin.includes("localhost") &&
    !origin.includes("127.0.0.1")
  ) {
    origin = origin.replace(/^http:\/\//i, "https://");
  }

  return origin.replace(/\/+$/, "");
}

export const getMcpBaseUrl = getAppOrigin;

export function getAdminApiUrl(): string {
  const url = process.env.ADMIN_API_URL;
  if (!url) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ADMIN_API_URL environment variable is missing");
    }
    return "http://localhost:3000";
  }
  return url.trim().replace(/\/+$/, "");
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
        .map((d) => d.replace(/\/+$/, ""))
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
    "openai/widgetDomain": widgetDomain.startsWith("https://") ? widgetDomain : undefined,
    "openai/widgetPrefersBorder": true,

    "openai/widgetCSP": openaiCsp,
  };
}


