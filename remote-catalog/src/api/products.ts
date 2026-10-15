const BASE_URL = 'https://dummyjson.com';
const FIELDS = 'id,title,price,thumbnail,category,description,rating,stock,brand';

export type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
  description: string;
  rating: number;
  stock: number;
  brand?: string;
};

export type Category = { slug: string; name: string };

async function get<T>(path: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, { signal });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${path}`);
  }
  return response.json() as Promise<T>;
}

/** A search term wins over the category, because DummyJSON can't combine them. */
export async function fetchProducts(
  { query, category }: { query: string; category: string },
  signal: AbortSignal,
): Promise<Product[]> {
  const path = query
    ? `/products/search?q=${encodeURIComponent(query)}&limit=24&select=${FIELDS}`
    : category
      ? `/products/category/${encodeURIComponent(category)}?limit=24&select=${FIELDS}`
      : `/products?limit=24&select=${FIELDS}`;
  const { products } = await get<{ products: Product[] }>(path, signal);
  return products;
}

export const fetchCategories = (signal: AbortSignal) =>
  get<Category[]>('/products/categories', signal);

export const fetchProduct = (id: string, signal: AbortSignal) =>
  get<Product>(`/products/${encodeURIComponent(id)}?select=${FIELDS}`, signal);
