import type { Product } from "./products";
import { getAppOrigin, getWidgetCsp } from "./mcp-widget-config";

export function buildProductToolResult(products: Product[], label: string) {
  const structuredContent = {
    count: products.length,
    label,
    products,
  };

  const { csp, openaiCsp } = getWidgetCsp(getAppOrigin());

  // Generate detailed text for GPT to read and understand product details and specifications
  const productTextDetails = products.map((p) => {
    return `### ${p.title} (Price: $${p.price})
${p.description || "No description available."}
${p.documentUrl ? `Product Document: ${p.documentUrl}` : ""}`;
  }).join("\n\n---\n\n");

  const fullText = products.length > 0
    ? `${label}\n\n${productTextDetails}`
    : label;

  return {
    content: [
      {
        type: "text" as const,
        text: fullText,
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
