import { getAdminApiUrl, getMcpBaseUrl } from "./mcp-widget-config";

export type Product = {
  id: string;
  title: string;
  description: string;
  brand: string;
  tags: string[];
  image: string;
  images: string[];
  price: string;
  handle: string;
  productUrl: string;
  checkoutUrl: string;
  variantId: string;
  variantGid: string;
  specifications?: string;
  documentUrl?: string | null;
  documentName?: string | null;
};

type AdminProduct = {
  id: string;
  name?: string | null;
  price?: string | number | null;
  imageUrl?: string | null;
  content?: string | null;
  documentUrl?: string | null;
  documentName?: string | null;
  specifications?: string | null;
  pdfText?: string | null;
};

function mapAdminProduct(product: AdminProduct): Product {
  const title = (product.name || "").trim() || "Cleanergy Battery";
  const handle =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "cleanergy-battery";

  const content = (product.content || "").trim();
  const specifications = product.specifications?.trim() || undefined;

  // Combine product description with extracted PDF specifications directly from database if available
  const fullDescription = specifications
    ? (content ? `${content}\n\nTechnical Specifications:\n${specifications}` : `Technical Specifications:\n${specifications}`)
    : content;

  const rawPrice = Number(product.price);
  const price = !isNaN(rawPrice) && rawPrice >= 0 ? rawPrice.toFixed(2) : "0.00";
  const baseUrl = getMcpBaseUrl();

  return {
    id: String(product.id || ""),
    title,
    description: fullDescription,
    brand: "Cleanergy",
    tags: [],
    image: product.imageUrl || "",
    images: product.imageUrl ? [product.imageUrl] : [],
    price,
    handle,
    productUrl: `${baseUrl}/products/${handle}`,
    checkoutUrl: `${baseUrl}/products/${handle}`,
    variantId: String(product.id || ""),
    variantGid: `local:${product.id || ""}`,
    specifications,
    documentUrl: product.documentUrl || null,
    documentName: product.documentName || null,
  };
}

const CATALOG_WIDE_QUERIES = new Set([
  "all",
  "*",
  "all products",
  "show all",
  "show all products",
  "everything",
  "catalog",
  "full catalog",
  "entire catalog",
  "list all",
  "list all products",
  "browse catalog",
  "browse all",
]);

export function isCatalogWideQuery(query?: string): boolean {
  if (!query?.trim()) {
    return true;
  }

  const normalized = query.trim().toLowerCase();

  if (CATALOG_WIDE_QUERIES.has(normalized)) {
    return true;
  }

  return /^(show|list|get|display)\s+(me\s+)?(all|every)\s+(products?|items?|catalog)/.test(
    normalized
  );
}

export async function listAllProducts(): Promise<Product[]> {
  const adminApiUrl = getAdminApiUrl();
  const response = await fetch(`${adminApiUrl}/api/products`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || errorData?.error || "Failed to fetch products from Admin backend"
    );
  }

  const data = await response.json().catch(() => null);

  if (!data || data.success !== true || !Array.isArray(data.products)) {
    throw new Error("Malformed response from Admin products endpoint");
  }

  return (data.products as AdminProduct[]).map(mapAdminProduct);
}

export async function searchProducts(
  search: string,
  limit?: number
): Promise<Product[]> {
  const query = (search || "").trim().toLowerCase();

  // Fetch all products from Admin API catalog
  const allProducts = await listAllProducts();

  if (!query || isCatalogWideQuery(query)) {
    return typeof limit === "number" && limit > 0
      ? allProducts.slice(0, limit)
      : allProducts;
  }

  const products = allProducts.filter((product) => {
    const searchableText = [
      product.title,
      product.description,
      product.brand,
      product.handle,
      ...(product.tags || []),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });

  return typeof limit === "number" && limit > 0
    ? products.slice(0, limit)
    : products;
}

export async function getProducts(query?: string): Promise<Product[]> {
  if (isCatalogWideQuery(query)) {
    return listAllProducts();
  }

  return searchProducts(query!.trim());
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const products = await listAllProducts();
  return products.slice(0, Math.max(1, limit));
}

export async function getProductsUnderPrice(
  maxPrice: number
): Promise<Product[]> {
  if (typeof maxPrice !== "number" || isNaN(maxPrice) || maxPrice <= 0) {
    return [];
  }
  const products = await listAllProducts();

  return products
    .filter((product) => {
      const price = Number(product.price);
      return !isNaN(price) && price <= maxPrice;
    })
    .slice(0, 8);
}

export type ProductFilter = {
  query?: string;
  tag?: string;
  vendor?: string;
  maxPrice?: number;
  minPrice?: number;
  limit?: number;
};

function matchesFilter(
  product: Product,
  filter: ProductFilter
): boolean {
  const query = filter.query?.trim().toLowerCase();
  const tag = filter.tag?.trim().toLowerCase();
  const vendor = filter.vendor?.trim().toLowerCase();
  const price = Number(product.price);

  if (query && !isCatalogWideQuery(query)) {
    const searchableText = [
      product.title,
      product.description,
      product.brand,
      product.handle,
      ...(product.tags || []),
    ]
      .join(" ")
      .toLowerCase();

    if (!searchableText.includes(query)) {
      return false;
    }
  }

  if (
    tag &&
    !(product.tags || []).some(
      (productTag) => productTag.toLowerCase() === tag
    )
  ) {
    return false;
  }

  if (
    vendor &&
    product.brand.toLowerCase() !== vendor
  ) {
    return false;
  }

  if (
    typeof filter.maxPrice === "number" &&
    !isNaN(filter.maxPrice) &&
    (isNaN(price) || price > filter.maxPrice)
  ) {
    return false;
  }

  if (
    typeof filter.minPrice === "number" &&
    !isNaN(filter.minPrice) &&
    (isNaN(price) || price < filter.minPrice)
  ) {
    return false;
  }

  return true;
}

export async function filterProducts(
  filter: ProductFilter
): Promise<Product[]> {
  const limit = typeof filter.limit === "number" && filter.limit > 0 ? filter.limit : 12;
  const allProducts = await listAllProducts();

  return allProducts
    .filter((product) => matchesFilter(product, filter))
    .slice(0, limit);
}

export async function getProductsByTag(
  tag: string
): Promise<Product[]> {
  const normalizedTag = (tag || "").trim().toLowerCase();
  if (!normalizedTag) {
    return [];
  }

  const products = await listAllProducts();

  return products
    .filter((product) =>
      (product.tags || []).some(
        (productTag) => productTag.toLowerCase() === normalizedTag
      )
    )
    .slice(0, 8);
}

export async function getRecommendedProducts(
  seed?: string
): Promise<Product[]> {
  if (!seed?.trim()) {
    return getFeaturedProducts(8);
  }

  const products = await getProducts(seed);
  const seedProduct = products[0];

  if (!seedProduct) {
    return getFeaturedProducts(8);
  }

  if (!seedProduct.tags?.length) {
    return products.slice(0, 8);
  }

  const catalog = await listAllProducts();

  const seedTags = new Set(
    seedProduct.tags.map((t) => t.toLowerCase())
  );

  return catalog
    .filter((product) => product.id !== seedProduct.id)
    .sort((left, right) => {
      const leftScore = (left.tags || []).filter((t) =>
        seedTags.has(t.toLowerCase())
      ).length;

      const rightScore = (right.tags || []).filter((t) =>
        seedTags.has(t.toLowerCase())
      ).length;

      return rightScore - leftScore;
    })
    .slice(0, 8);
}

export async function getProductForCheckout(
  query: string
): Promise<Product | undefined> {
  const products = await getProducts(query);
  return products[0];
}