import type { Product } from "./products";
import { getAppOrigin, getWidgetCsp } from "./mcp-widget-config";

export function buildProductToolResult(products: Product[], label: string) {
  const structuredContent = {
    count: products.length,
    label,
    products,
  };

  const { csp, openaiCsp } = getWidgetCsp(getAppOrigin());

  return {
    content: [
      {
        type: "text" as const,
        text: label,
      },
    ],
    structuredContent,
    _meta: {
      products,
      ui: { csp },
      "openai/widgetCSP": openaiCsp,
    },
  };
}
