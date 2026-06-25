import { Inject, Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
// import { environment } from '../../environments/environment';
import { Category, Product } from '../models';
import { APP_CONFIG, AppConfig } from '../app.config.base';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  // private readonly db: SupabaseClient = createClient(
  //   environment.supabaseUrl,
  //   environment.supabaseKey
  // );
  private supabase: SupabaseClient;


  constructor(@Inject(APP_CONFIG) private config: AppConfig) {
    this.supabase = createClient(
      this.config.supabaseUrl,
      this.config.supabaseKey
    );
  }

  // ── CATEGORIES ──
  async getCategories(): Promise<Category[]> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    if (error) throw error;
    return data ?? [];
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const { data } = await this.supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
    return data ?? null;
  }

    async getCategoryBySubdomain(subdomain: string): Promise<Category | null> {
      console.log("dadadddadd",subdomain);
    const { data } = await this.supabase
      .from('categories')
      .select('*')
      .eq('subdomain', subdomain)
      .eq('is_active', true)
      .single();
    return data ?? null;
  }

  // ── PRODUCTS ──
  async getFeaturedProducts(): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('display_order')
      .limit(6);
    if (error) throw error;
    return data ?? [];
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('display_order');
    if (error) throw error;
    return data ?? [];
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const { data } = await this.supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (data) {
      const { data: related } = await this.supabase
        .from('related_products')
        .select('related_product:products!related_product_id(*, category:categories(*))')
        .eq('product_id', data.id)
        .limit(3);
      data.related_products = related?.map((r: any) => r.related_product) ?? [];
    }

    return data ?? null;
  }

  // ── TRACKING ──
  async trackProductView(productId: string): Promise<void> {
    try {
      await this.supabase.from('product_views').insert({
        product_id: productId,
        referrer: document.referrer || '',
        device: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
        session_id: this.getSessionId()
      });
    } catch { /* fail silently — never block the user */ }
  }

  async trackAmazonClick(productId: string): Promise<void> {
    try {
      await this.supabase.from('amazon_clicks').insert({
        product_id: productId,
        referrer: document.referrer || '',
        device: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
        session_id: this.getSessionId()
      });
    } catch { /* fail silently */ }
  }

  private getSessionId(): string {
    let id = sessionStorage.getItem('tda_sid');
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem('tda_sid', id);
    }
    return id;
  }
}
