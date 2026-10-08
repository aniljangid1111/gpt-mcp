
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
};

type AdminProduct = {
  id: string;
  name: string;
  price: string | number;
  imageUrl: string | null;
  content: string;
  documentUrl: string | null;
};

function mapAdminProduct(product: AdminProduct): Product {
  const handle = product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return {
    id: product.id,
    title: product.name,
    description: product.content,
    brand: "Cleanergy",
    tags: [],
    image: product.imageUrl || "",
    images: product.imageUrl ? [product.imageUrl] : [],
    price: String(product.price),
    handle,
    productUrl: `/products/${handle}`,
    checkoutUrl: `/products/${handle}`,
    variantId: product.id,
    variantGid: `local:${product.id}`,
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

export async function listAllProducts(limit = 50): Promise<Product[]> {
  const response = await fetch(`${process.env.ADMIN_API_URL}/api/products`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products from Admin API");
  }

  const data = await response.json();

  const products: AdminProduct[] = data.products || [];

  return products
    .slice(0, limit)
    .map(mapAdminProduct);
}

export async function searchProducts(
  search: string,
  limit = 50
): Promise<Product[]> {
  const query = search.trim().toLowerCase();

  const allProducts = await listAllProducts(50);

  if (!query) {
    return allProducts.slice(0, limit);
  }

  const products = allProducts.filter((product) => {
    const searchableText = [
      product.title,
      product.description,
      product.brand,
      product.handle,
      ...product.tags,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });

  return products.slice(0, limit);
}

export async function getProducts(query?: string): Promise<Product[]> {
  if (isCatalogWideQuery(query)) {
    return listAllProducts();
  }

  return searchProducts(query!.trim());
}

export async function getFeaturedProducts(
  limit = 8
): Promise<Product[]> {
  return listAllProducts(limit);
}

export async function getProductsUnderPrice(
  maxPrice: number
): Promise<Product[]> {
  const products = await listAllProducts();

  return products
    .filter((product) => Number(product.price) <= maxPrice)
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

  if (query) {
    const searchableText = [
      product.title,
      product.description,
      product.brand,
      product.handle,
      product.tags.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    if (!searchableText.includes(query)) {
      return false;
    }
  }

  if (
    tag &&
    !product.tags.some(
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
    price > filter.maxPrice
  ) {
    return false;
  }

  if (
    typeof filter.minPrice === "number" &&
    price < filter.minPrice
  ) {
    return false;
  }

  return true;
}

export async function filterProducts(
  filter: ProductFilter
): Promise<Product[]> {
  const limit = filter.limit ?? 12;

  const candidates = filter.query?.trim()
    ? await searchProducts(filter.query.trim(), 50)
    : await listAllProducts(50);

  return candidates
    .filter((product) => matchesFilter(product, filter))
    .slice(0, limit);
}

export async function getProductsByTag(
  tag: string
): Promise<Product[]> {
  const normalizedTag = tag.trim().toLowerCase();

  const products = await listAllProducts();

  return products
    .filter((product) =>
      product.tags.some(
        (productTag) =>
          productTag.toLowerCase() === normalizedTag
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

  if (!seedProduct?.tags.length) {
    return products.slice(0, 8);
  }

  const catalog = await listAllProducts();

  const seedTags = new Set(
    seedProduct.tags.map((tag) => tag.toLowerCase())
  );

  return catalog
    .filter((product) => product.id !== seedProduct.id)
    .sort((left, right) => {
      const leftScore = left.tags.filter((tag) =>
        seedTags.has(tag.toLowerCase())
      ).length;

      const rightScore = right.tags.filter((tag) =>
        seedTags.has(tag.toLowerCase())
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