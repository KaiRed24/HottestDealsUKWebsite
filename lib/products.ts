import { supabase } from "@/lib/supabase";

export type Product = {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  category: "candy" | "chocolate" | "drinks" | "snacks";
  region: "usa" | "asia" | "europe" | null;
  price: number;
  stock_quantity: number;
  image_url: string | null;
  ebay_url: string | null;
  tiktok_url: string | null;
  shopify_variant_id: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

function withResolvedImage(product: Product): Product {
  if (product.image_url) return product;
  return {
    ...product,
    image_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${product.sku}.jpg`,
  };
}

export async function getProducts(filters: {
  category?: string;
  region?: string;
  search?: string;
} = {}): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("name", { ascending: true });

  if (filters.category) {
    query = query.eq("category", filters.category);
  }
  if (filters.region) {
    query = query.eq("region", filters.region);
  }
  if (filters.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map(withResolvedImage);
}

export async function getProduct(sku: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("sku", sku)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return withResolvedImage(data);
}

// Oreo International Selection, then Samyang Buldak Carbonara — shown first
// in the featured showcase because their product photography is strongest.
const FEATURED_PRIORITY_SKUS = ["HD-0210", "HD-0241"];

export async function getFeatured(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("name", { ascending: true })
    .limit(8);

  if (error) throw error;

  const products = (data ?? []).map(withResolvedImage);

  return [...products].sort((a, b) => {
    const aIndex = FEATURED_PRIORITY_SKUS.indexOf(a.sku);
    const bIndex = FEATURED_PRIORITY_SKUS.indexOf(b.sku);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}
