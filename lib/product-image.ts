// Products without an explicit image_url fall back to the photo uploaded to
// Supabase storage under their SKU. Kept free of server-only imports so the
// basket (client-side) can repair items saved before an image existed.
export function storageImageUrl(sku: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${sku}.jpg`;
}
