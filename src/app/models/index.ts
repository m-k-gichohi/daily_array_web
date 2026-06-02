export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  meta_description: string;
  hero_tagline: string;
  display_order: number;
  is_active: boolean;
}



export interface Product {
  id: string;
  category_id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  amazon_asin: string;
  amazon_url: string;
  affiliate_tag: string;
  image_url: string;
  og_image_url: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  category?: Category;
  related_products?: Product[];
}
