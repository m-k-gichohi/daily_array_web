import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Category, Product } from '../../models';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-category',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ProductCardComponent],
  template: `
    <!-- LOADING -->
    @if (loading()) {
      <div class="d-flex justify-content-center align-items-center" style="min-height:60vh">
        <div class="tda-spinner"></div>
      </div>
    }

    <!-- NOT FOUND -->
    @if (!loading() && !category()) {
      <div class="container text-center py-5 my-5">
        <i class="bi bi-search fs-1 text-muted mb-3 d-block"></i>
        <h2 class="tda-section-title mb-3">Collection not found</h2>
        <a routerLink="/" class="tda-link-gold">← Back to home</a>
      </div>
    }

    <!-- CATEGORY PAGE -->
    @if (!loading() && category()) {

      <!-- HERO -->
      <section class="tda-cat-hero py-5">
        <div class="container">
          <!-- Breadcrumb -->
          <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb tda-breadcrumb">
              <li class="breadcrumb-item"><a routerLink="/">Home</a></li>
              <li class="breadcrumb-item active">{{ category()!.name }}</li>
            </ol>
          </nav>

          <p class="tda-eyebrow mb-2">Collection</p>
          <h1 class="tda-hero-title mb-3">{{ category()!.name }}</h1>
          <p class="tda-cat-desc">{{ category()!.description }}</p>
        </div>
      </section>

      <!-- PRODUCTS -->
      <section class="py-5 tda-section">
        <div class="container">
          @if (products().length === 0) {
            <div class="text-center py-5">
              <i class="bi bi-box-seam fs-1 text-muted mb-3 d-block"></i>
              <p class="text-muted mb-4">No products in this collection yet — check back soon.</p>
              <a routerLink="/" class="tda-link-gold">← Back to home</a>
            </div>
          } @else {
            <!-- Filter bar -->
            <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
              <p class="mb-0 text-muted" style="font-size:0.875rem">
                {{ products().length }} product{{ products().length === 1 ? '' : 's' }}
              </p>
            </div>

            <div class="row g-3">
              @for (product of products(); track product.id) {
                <div class="col-sm-6 col-lg-4">
                  <app-product-card [product]="product" />
                </div>
              }
            </div>
          }
        </div>
      </section>
    }
  `,
  styles: [`
    /* ── SPINNER ── */
    .tda-spinner {
      width: 36px; height: 36px;
      border: 2px solid #f0ead8;
      border-top-color: #b5832a;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── HERO ── */
    .tda-cat-hero {
      background: linear-gradient(135deg, #fdf8ef 0%, #f5ede0 100%);
      border-bottom: 1px solid #f0ead8;
    }
    .tda-eyebrow {
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #b5832a;
    }
    .tda-hero-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 400;
      color: #1a1a1a;
      line-height: 1.1;
    }
    .tda-cat-desc {
      font-size: 1rem;
      font-weight: 300;
      color: #666;
      line-height: 1.7;
      max-width: 560px;
    }

    /* ── BREADCRUMB ── */
    .tda-breadcrumb {
      font-size: 0.75rem;
    }
    .tda-breadcrumb .breadcrumb-item a {
      color: #aaa;
      text-decoration: none;
      transition: color 0.2s;
    }
    .tda-breadcrumb .breadcrumb-item a:hover { color: #b5832a; }
    .tda-breadcrumb .breadcrumb-item.active { color: #888; }
    .tda-breadcrumb .breadcrumb-item + .breadcrumb-item::before { color: #ccc; }

    .tda-section { background: #fcfaf5; }
    .tda-section-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(1.5rem, 3vw, 2.5rem);
      font-weight: 400;
      color: #1a1a1a;
    }
    .tda-link-gold {
      font-size: 0.875rem;
      font-weight: 600;
      color: #b5832a;
      text-decoration: none;
    }
    .tda-link-gold:hover { text-decoration: underline; }
  `]
})
export class CategoryComponent implements OnInit {
  private readonly supabase = inject(SupabaseService);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  readonly category = signal<Category | null>(null);
  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async params => {
      this.loading.set(true);
      this.category.set(null);
      this.products.set([]);

      const cat = await this.supabase.getCategoryBySlug(params['slug']);
      this.category.set(cat);

      if (cat) {
        // Dynamic SEO Tags
        this.title.setTitle(`${cat.name} Collection | The Daily Array`);
        this.meta.updateTag({ name: 'description', content: cat.description || `Browse our handpicked collection of ${cat.name}.` });
        
        // Open Graph
        this.meta.updateTag({ property: 'og:title', content: `${cat.name} Collection` });
        this.meta.updateTag({ property: 'og:description', content: cat.description || '' });

        const prods = await this.supabase.getProductsByCategory(cat.id);
        this.products.set(prods);
      }

      this.loading.set(false);
    });
  }
}
