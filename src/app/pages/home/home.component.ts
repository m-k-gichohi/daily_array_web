import { Component, OnInit, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CategoryCardComponent } from '../../components/category-card/category-card.component';
import { Category, Product } from '../../models';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ProductCardComponent, CategoryCardComponent],
  template: `

    <!-- ── HERO ── -->
    <section class="tda-hero">
      <div class="container">
        <div class="row align-items-center min-vh-75">
          <div class="col-lg-7 col-xl-6">
            <p class="tda-eyebrow mb-3">Better Sleep · Smarter Bedding · Deeper Rest</p>
            <h1 class="tda-hero-title mb-4">
              The best sleep upgrades on Amazon,
              <em>hand-picked daily.</em>
            </h1>
            <p class="tda-hero-sub mb-5">
              Pillows, mattress toppers, bedding and bedroom essentials that actually
              make a difference — curated to help you sleep deeper and wake up better.
            </p>
            <div class="d-flex flex-wrap gap-3">
              <a routerLink="/categories/pillows-bedding" class="btn tda-btn-dark px-4 py-2">
                Shop sleep picks
              </a>
              <a routerLink="/categories/budget-upgrades" class="btn tda-btn-outline px-4 py-2">
                Under $50 finds
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="tda-hero-pattern"></div>
    </section>

    <!-- ── TRUST BAR ── -->
    <section class="tda-trust-bar py-3">
      <div class="container">
        <div class="row g-3 justify-content-center text-center text-md-start">
          <div class="col-6 col-md-3">
            <div class="d-flex align-items-center justify-content-center justify-content-md-start gap-2">
              <i class="bi bi-patch-check-fill tda-trust-icon"></i>
              <span class="tda-trust-text">Top-rated picks</span>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="d-flex align-items-center justify-content-center justify-content-md-start gap-2">
              <i class="bi bi-lightning-fill tda-trust-icon"></i>
              <span class="tda-trust-text">Amazon Prime eligible</span>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="d-flex align-items-center justify-content-center justify-content-md-start gap-2">
              <i class="bi bi-heart-fill tda-trust-icon"></i>
              <span class="tda-trust-text">Curated weekly</span>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="d-flex align-items-center justify-content-center justify-content-md-start gap-2">
              <i class="bi bi-shield-check tda-trust-icon"></i>
              <span class="tda-trust-text">Affiliate disclosed</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CATEGORIES ── -->
    <section class="py-5 tda-section">
      <div class="container">
        <div class="d-flex align-items-end justify-content-between mb-4 flex-wrap gap-3">
          <div>
            <p class="tda-eyebrow mb-1">Browse by mood</p>
            <h2 class="tda-section-title mb-0">Find your corner</h2>
          </div>
        </div>

        @if (loadingCategories()) {
          <div class="row g-3">
            @for (s of skeletons; track s) {
              <div class="col-sm-6 col-lg-3">
                <div class="tda-skeleton" style="height:160px"></div>
              </div>
            }
          </div>
        } @else {
          <div class="row g-3">
            @for (cat of categories(); track cat.id; let i = $index) {
              <div class="col-sm-6 col-lg-3">
                <app-category-card [category]="cat" [index]="i" />
              </div>
            }
          </div>
        }
      </div>
    </section>

    <!-- ── FEATURED PRODUCTS ── -->
    <section class="py-5 tda-section tda-section--alt">
      <div class="container">
        <div class="d-flex align-items-end justify-content-between mb-4 flex-wrap gap-3">
          <div>
            <p class="tda-eyebrow mb-1">This week's picks</p>
            <h2 class="tda-section-title mb-0">Quietly loved</h2>
          </div>
          <a routerLink="/categories/pillows-bedding" class="tda-link-gold">
            View all <i class="bi bi-arrow-right ms-1"></i>
          </a>
        </div>

        @if (loadingProducts()) {
          <div class="row g-3">
            @for (s of skeletons; track s) {
              <div class="col-sm-6 col-lg-4">
                <div class="tda-skeleton" style="height:340px"></div>
              </div>
            }
          </div>
        } @else {
          <div class="row g-3">
            @for (product of featuredProducts(); track product.id) {
              <div class="col-sm-6 col-lg-4">
                <app-product-card [product]="product" />
              </div>
            }
          </div>
        }
      </div>
    </section>

    <!-- ── CTA BANNER ── -->
    <section class="tda-cta-banner py-5">
      <div class="container text-center">
        <h2 class="tda-cta-title mb-3">Better sleep starts with one upgrade.</h2>
        <p class="tda-cta-sub mb-4">
          Browse our curated Amazon picks — pillows, toppers, bedding and bedroom
          essentials that thousands of real reviewers already trust.
        </p>
        <div class="d-flex gap-3 justify-content-center flex-wrap">
          <a routerLink="/categories/mattress-toppers" class="btn tda-btn-gold px-4 py-2">
            Explore mattress toppers
          </a>
          <a routerLink="/categories/budget-upgrades" class="btn tda-btn-outline-light px-4 py-2">
            Budget upgrades under $50
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* ── HERO ── */
    .tda-hero {
      position: relative;

      background: linear-gradient(135deg, rgba(253,248,239,0.6) 0%, rgba(245,237,224,0.6) 60%, rgba(238,221,200,0.6) 100%), url("/assets/hero-bedroom.jpg");
      background-size: cover;
      background-position: center;

      overflow: hidden;
      padding: 5rem 0;
    }
    .min-vh-75 { min-height: 60vh; }
    .tda-hero-pattern {
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23b5832a' fill-opacity='0.04' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E");
      pointer-events: none;
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
      font-size: clamp(2.2rem, 5vw, 4rem);
      font-weight: 400;
      line-height: 1.1;
      color: #1a1a1a;
    }
    .tda-hero-title em { font-style: italic; color: #b5832a; }
    .tda-hero-sub {
      font-size: 1rem;
      font-weight: 300;
      color: #666;
      line-height: 1.75;
      max-width: 520px;
    }

    /* ── BUTTONS ── */
    .tda-btn-dark {
      background: #1a1a1a;
      color: #fff;
      border-radius: 2px;
      font-size: 0.8125rem;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      transition: background 0.2s, transform 0.2s;
      border: none;
    }
    .tda-btn-dark:hover { background: #333; color: #fff; transform: translateY(-1px); }
    .tda-btn-outline {
      background: transparent;
      border: 1.5px solid #1a1a1a;
      color: #1a1a1a;
      border-radius: 2px;
      font-size: 0.8125rem;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      transition: all 0.2s;
    }
    .tda-btn-outline:hover { background: #1a1a1a; color: #fff; }
    .tda-btn-gold {
      background: #b5832a;
      color: #fff;
      border-radius: 2px;
      font-size: 0.8125rem;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      border: none;
      transition: background 0.2s, transform 0.2s;
    }
    .tda-btn-gold:hover { background: #9a6e23; color: #fff; transform: translateY(-1px); }
    .tda-btn-outline-light {
      background: transparent;
      border: 1.5px solid rgba(255,255,255,0.5);
      color: #fff;
      border-radius: 2px;
      font-size: 0.8125rem;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      transition: all 0.2s;
    }
    .tda-btn-outline-light:hover { background: rgba(255,255,255,0.1); color: #fff; }

    /* ── TRUST BAR ── */
    .tda-trust-bar { background: #1a1a2e; }
    .tda-trust-icon { color: #c9a84c; font-size: 0.875rem; }
    .tda-trust-text { font-size: 0.8125rem; color: #a0a8b8; }

    /* ── SECTIONS ── */
    .tda-section { background: #fcfaf5; }
    .tda-section--alt { background: #faf7f0; }
    .tda-section-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(1.75rem, 3.5vw, 2.75rem);
      font-weight: 400;
      color: #1a1a1a;
    }
    .tda-link-gold {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #b5832a;
      text-decoration: none;
      transition: color 0.2s;
    }
    .tda-link-gold:hover { color: #9a6e23; text-decoration: underline; }

    /* ── SKELETON ── */
    .tda-skeleton {
      background: linear-gradient(90deg, #f0ead8 25%, #f8f5ef 50%, #f0ead8 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* ── CTA BANNER ── */
    .tda-cta-banner {
      background: linear-gradient(135deg, #1a1a2e 0%, #2a2040 100%);
    }
    .tda-cta-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(1.75rem, 4vw, 3rem);
      font-weight: 400;
      color: #f5f0e8;
    }
    .tda-cta-sub {
      font-size: 1rem;
      font-weight: 300;
      color: #a0a8b8;
      max-width: 560px;
      margin: 0 auto;
      line-height: 1.7;
    }
  `]
})
export class HomeComponent implements OnInit {
  private readonly supabase = inject(SupabaseService);

  // Signals — Angular 21 style
  readonly categories = signal<Category[]>([]);
  readonly featuredProducts = signal<Product[]>([]);
  readonly loadingCategories = signal(true);
  readonly loadingProducts = signal(true);

  readonly skeletons = [1, 2, 3];

  async ngOnInit(): Promise<void> {
    // Load in parallel
    const [cats, products] = await Promise.all([
      this.supabase.getCategories(),
      this.supabase.getFeaturedProducts()
    ]);
    this.categories.set(cats);
    this.loadingCategories.set(false);
    this.featuredProducts.set(products);
    this.loadingProducts.set(false);
  }
}
