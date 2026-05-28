import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../models';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-product',
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
    @if (!loading() && !product()) {
      <div class="container text-center py-5 my-5">
        <i class="bi bi-box-seam fs-1 text-muted mb-3 d-block"></i>
        <h2 class="tda-display-title mb-3">Product not found</h2>
        <a routerLink="/" class="tda-link-gold">← Back to home</a>
      </div>
    }

    <!-- PRODUCT PAGE -->
    @if (!loading() && product()) {

      <!-- BREADCRUMB BAR -->
      <div class="tda-breadcrumb-bar">
        <div class="container">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb tda-breadcrumb mb-0 py-2">
              <li class="breadcrumb-item"><a routerLink="/">Home</a></li>
              <li class="breadcrumb-item">
                <a [routerLink]="['/categories', product()!.category?.slug]">
                  {{ product()!.category?.name }}
                </a>
              </li>
              <li class="breadcrumb-item active tda-breadcrumb-current">
                {{ product()!.name }}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <!-- MAIN PRODUCT -->
      <section class="py-5 tda-product-section">
        <div class="container">
          <div class="row g-5 align-items-start">

            <!-- LEFT — IMAGE -->
            <div class="col-lg-6">
              <div class="tda-product-img-wrap">
                <img
                  [src]="product()!.image_url || 'assets/placeholder.jpg'"
                  [alt]="product()!.name"
                  class="tda-product-img w-100"
                  (error)="onImgError($event)"
                />
                @if (product()!.category?.name) {
                  <span class="tda-product-cat-badge">{{ product()!.category!.name }}</span>
                }
              </div>

                 <!-- Description -->
              @if (product()!.description) {
                <div class="mb-4">
                  <p class="tda-features-label mb-2">Why this one</p>
                  <!-- <p class="tda-body-text">{{ product()!.description }}</p> -->
                  <div [innerHtml]=product()!.description></div>
                </div>
              }
            </div>

            <!-- RIGHT — DETAILS -->
            <div class="col-lg-6">
              <p class="tda-eyebrow mb-2">{{ product()!.category?.name }}</p>
              <h1 class="tda-display-title mb-3">{{ product()!.name }}</h1>
              <p class="tda-tagline mb-4">{{ product()!.tagline }}</p>

              <!-- Price + CTA -->
              <div class="tda-price-row d-flex align-items-baseline gap-3 mb-3">
                <span class="tda-price">\${{ product()!.price_approx }}</span>
                <span class="tda-price-note">approx. — verify on Amazon</span>
              </div>

              <a
                [href]="product()!.amazon_url"
                target="_blank"
                rel="noopener noreferrer"
                class="btn tda-btn-amazon d-inline-flex align-items-center gap-2 mb-2"
                (click)="onAmazonClick()"
              >
                <i class="bi bi-bag-check"></i>
                View on Amazon
                <i class="bi bi-arrow-up-right"></i>
              </a>
              <p class="tda-affiliate-note mb-4">
                <i class="bi bi-info-circle me-1"></i>
                Affiliate link — we may earn a small commission at no extra cost to you.
              </p>

              <!-- Features / At a Glance -->
              @if (product()!.features && product()!.features!.length > 0) {
                <div class="tda-features-card mb-4 p-3">
                  <p class="tda-features-label mb-2">At a glance</p>
                  <ul class="list-unstyled mb-0">
                    @for (f of product()!.features; track f.id) {
                      <li class="tda-feature-item mb-2">
                        <i class="bi bi-dash text-warning me-2"></i>{{ f.feature }}
                      </li>
                    }
                  </ul>
                </div>
              }

              <!-- Specs Table -->
              @if (product()!.specs && product()!.specs!.length > 0) {
                <div class="table-responsive mb-4">
                  <table class="table tda-specs-table mb-0">
                    <tbody>
                      @for (spec of product()!.specs; track spec.id) {
                        <tr>
                          <td class="tda-spec-label">{{ spec.label }}</td>
                          <td class="tda-spec-value">{{ spec.value }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }

           

              <!-- Why we love it / Best for -->
              @if (product()!.why_we_love_it || product()!.best_for) {
                <div class="row g-2 mb-4">
                  @if (product()!.why_we_love_it) {
                    <div class="col-sm-6">
                      <div class="tda-love-card p-3 h-100">
                        <p class="tda-love-label mb-2">Why we love it</p>
                        <p class="tda-body-text mb-0">{{ product()!.why_we_love_it }}</p>
                      </div>
                    </div>
                  }
                  @if (product()!.best_for) {
                    <div class="col-sm-6">
                      <div class="tda-love-card p-3 h-100">
                        <p class="tda-love-label mb-2">Best for</p>
                        <p class="tda-body-text mb-0">{{ product()!.best_for }}</p>
                      </div>
                    </div>
                  }
                </div>
              }

              <!-- Bottom CTA -->
              <div class="tda-bottom-cta pt-4">
                <h3 class="tda-cta-title mb-2">Ready when you are.</h3>
                <p class="tda-body-text mb-3">
                  One tap takes you straight to Amazon to check today's price,
                  available sizes, and thousands of verified reviews.
                </p>
                <a
                  [href]="product()!.amazon_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn tda-btn-amazon d-inline-flex align-items-center gap-2"
                  (click)="onAmazonClick()"
                >
                  <i class="bi bi-bag-check"></i>
                  Check price on Amazon
                  <i class="bi bi-arrow-up-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- RELATED PRODUCTS -->
      @if (product()!.related_products && product()!.related_products!.length > 0) {
        <section class="py-5 tda-related-section">
          <div class="container">
            <p class="tda-eyebrow mb-2">More from this collection</p>
            <div class="row g-3">
              @for (rel of product()!.related_products!; track rel.id) {
                <div class="col-sm-6 col-lg-4">
                  <app-product-card [product]="rel" />
                </div>
              }
            </div>
          </div>
        </section>
      }

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

    /* ── BREADCRUMB ── */
    .tda-breadcrumb-bar {
      background: #fdf8ef;
      border-bottom: 1px solid #f0ead8;
    }
    .tda-breadcrumb { font-size: 0.75rem; }
    .tda-breadcrumb .breadcrumb-item a { color: #aaa; text-decoration: none; transition: color 0.2s; }
    .tda-breadcrumb .breadcrumb-item a:hover { color: #b5832a; }
    .tda-breadcrumb .breadcrumb-item + .breadcrumb-item::before { color: #ccc; }
    .tda-breadcrumb-current { color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }

    /* ── PRODUCT SECTION ── */
    .tda-product-section { background: #fcfaf5; }
    .tda-product-img-wrap {
      position: relative;
      aspect-ratio: 1;
      overflow: hidden;
      background: #f8f5ef;
      border: 1px solid #f0ead8;
    }
    .tda-product-img {
      width: 100%; height: 100%;
      object-fit: cover;
      transition: transform 0.5s cubic-bezier(.25,.46,.45,.94);
    }
    .tda-product-img-wrap:hover .tda-product-img { transform: scale(1.03); }
    .tda-product-cat-badge {
      position: absolute;
      top: 14px; left: 14px;
      font-size: 0.625rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      background: rgba(252,250,245,0.95);
      color: #b5832a;
      padding: 4px 10px;
      backdrop-filter: blur(8px);
    }

    /* ── TYPOGRAPHY ── */
    .tda-eyebrow {
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #b5832a;
    }
    .tda-display-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(1.75rem, 4vw, 3rem);
      font-weight: 400;
      color: #1a1a1a;
      line-height: 1.15;
    }
    .tda-tagline {
      font-size: 1rem;
      font-weight: 300;
      color: #666;
      line-height: 1.65;
    }
    .tda-body-text {
      font-size: 0.9375rem;
      font-weight: 300;
      color: #555;
      line-height: 1.8;
    }

    /* ── PRICE ── */
    .tda-price {
      font-family: 'Cormorant Garamond', serif;
      font-size: 2rem;
      font-weight: 500;
      color: #b5832a;
    }
    .tda-price-note {
      font-size: 0.75rem;
      color: #aaa;
    }

    /* ── AMAZON BUTTON ── */
    .tda-btn-amazon {
      background: #1a1a1a;
      color: #fff;
      border-radius: 2px;
      font-size: 0.875rem;
      font-weight: 500;
      letter-spacing: 0.04em;
      padding: 0.75rem 1.5rem;
      border: none;
      transition: background 0.2s, transform 0.2s;
    }
    .tda-btn-amazon:hover {
      background: #b5832a;
      color: #fff;
      transform: translateY(-1px);
    }
    .tda-affiliate-note {
      font-size: 0.6875rem;
      color: #bbb;
    }

    /* ── FEATURES ── */
    .tda-features-card {
      background: #fdf8ef;
      border: 1px solid #f0ead8;
    }
    .tda-features-label, .tda-love-label {
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #b5832a;
    }
    .tda-feature-item { font-size: 0.875rem; color: #444; line-height: 1.55; }

    /* ── SPECS TABLE ── */
    .tda-specs-table {
      border: 1px solid #f0ead8;
      font-size: 0.875rem;
    }
    .tda-specs-table tbody tr:nth-child(even) td { background: #fdf8ef; }
    .tda-spec-label {
      font-weight: 600;
      font-size: 0.75rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #888;
      width: 40%;
      border-color: #f0ead8;
      padding: 0.625rem 1rem;
    }
    .tda-spec-value {
      color: #1a1a1a;
      border-color: #f0ead8;
      padding: 0.625rem 1rem;
    }

    /* ── LOVE CARDS ── */
    .tda-love-card {
      border: 1px solid #f0ead8;
      background: #fff;
    }

    /* ── BOTTOM CTA ── */
    .tda-bottom-cta { border-top: 1px solid #f0ead8; }
    .tda-cta-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.5rem;
      font-weight: 400;
      color: #1a1a1a;
    }

    /* ── RELATED ── */
    .tda-related-section { background: #faf7f0; border-top: 1px solid #f0ead8; }
    .tda-link-gold { font-size: 0.875rem; font-weight: 600; color: #b5832a; text-decoration: none; }
    .tda-link-gold:hover { text-decoration: underline; }
  `]
})
export class ProductComponent implements OnInit {
  private readonly supabase = inject(SupabaseService);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  readonly product = signal<Product | null>(null);
  readonly loading = signal(true);

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async params => {
      this.loading.set(true);
      this.product.set(null);

      const p = await this.supabase.getProductBySlug(params['slug']);
      this.product.set(p);

      if (p) {
        // Dynamic SEO Tags
        this.title.setTitle(`${p.name} | The Daily Array`);
        this.meta.updateTag({ name: 'description', content: p.tagline || p.description?.substring(0, 160) || '' });
        
        // Open Graph (Social Media)
        this.meta.updateTag({ property: 'og:title', content: p.name });
        this.meta.updateTag({ property: 'og:description', content: p.tagline || '' });
        this.meta.updateTag({ property: 'og:image', content: p.image_url || '' });

        // Track page view silently
        await this.supabase.trackProductView(p.id);
      }

      this.loading.set(false);
    });
  }

  async onAmazonClick(): Promise<void> {
    const p = this.product();
    if (p) await this.supabase.trackAmazonClick(p.id);
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/placeholder.jpg';
  }
}
