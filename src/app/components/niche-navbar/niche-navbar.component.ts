import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../models';

@Component({
  selector: 'app-niche-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <nav class="tda-niche-nav">
      <div class="container">
        <div class="tda-niche-nav-inner">

          <!-- Left — brand -->
          <a href="https://dailyarrayshop.com" class="tda-niche-brand">
            The Daily <span>Array</span>
          </a>

          <!-- Center — niche name -->
          <div class="tda-niche-name">
            {{ category()?.name }}
          </div>

          <!-- Right — back link -->
          <div class="tda-niche-back">
            @if (isProductPage()) {
              <!-- On product page — go back to niche home -->
              <a href="/" class="tda-niche-back-link">
                <i class="bi bi-arrow-left me-1"></i>
                Back to {{ category()?.name }}
              </a>
            } @else {
              <!-- On niche home — go back to main site -->
              <a href="https://dailyarrayshop.com" class="tda-niche-back-link">
                <i class="bi bi-grid me-1"></i>
                All collections
              </a>
            }
          </div>

        </div>
      </div>
    </nav>
  `,
  styles: [`
    .tda-niche-nav {
      background: rgba(253,248,239,0.95);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid #f0ead8;
      position: sticky;
      top: 0;
      z-index: 1030;
      padding: 0.75rem 0;
    }
    .tda-niche-nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
    .tda-niche-brand {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.25rem;
      font-weight: 500;
      color: #1a1a1a;
      text-decoration: none;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .tda-niche-brand span { color: #b5832a; }
    .tda-niche-name {
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #b5832a;
      text-align: center;
      flex: 1;
    }
    .tda-niche-back {
      flex-shrink: 0;
    }
    .tda-niche-back-link {
      font-size: 0.8125rem;
      font-weight: 400;
      color: #888;
      text-decoration: none;
      display: flex;
      align-items: center;
      transition: color 0.2s;
      white-space: nowrap;
    }
    .tda-niche-back-link:hover { color: #b5832a; }

    @media (max-width: 576px) {
      .tda-niche-name { display: none; }
    }
  `]
})
export class NicheNavbarComponent {
  readonly category = input<Category | null>(null);
  readonly isProductPage = input<boolean>(false);
}
