import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <footer class="tda-footer mt-5">
      <div class="container py-5">
        <div class="row g-4">

          <!-- Brand -->
          <div class="col-lg-5 col-md-6">
            <a routerLink="/" class="tda-footer-brand d-block mb-3">
              The Daily <span>Array</span>
            </a>
            <p class="tda-footer-text">
              Your go-to source for the best sleep upgrades on Amazon — pillows,
              mattress toppers, bedding and bedroom essentials curated to help you
              sleep deeper and wake up better.
            </p>
            <!-- <div class="d-flex gap-3 mt-3">
              <a href="https://pinterest.com/TheDailyArray" target="_blank" rel="noopener" class="tda-social-link">
                <i class="bi bi-pinterest"></i>
              </a>
              <a href="#" target="_blank" rel="noopener" class="tda-social-link">
                <i class="bi bi-tiktok"></i>
              </a>
              <a href="#" target="_blank" rel="noopener" class="tda-social-link">
                <i class="bi bi-instagram"></i>
              </a>
            </div> -->
          </div>

          <!-- Collections -->
          <div class="col-lg-3 col-md-3 col-6">
            <p class="tda-footer-heading">Collections</p>
            <ul class="list-unstyled tda-footer-links">
              <li><a routerLink="/categories/pillows-bedding">Pillows & Bedding</a></li>
              <li><a routerLink="/categories/mattress-toppers">Mattress Toppers</a></li>
              <li><a routerLink="/categories/bedroom-decor">Bedroom Decor</a></li>
              <li><a routerLink="/categories/budget-upgrades">Budget Upgrades</a></li>
            </ul>
          </div>

          <!-- Follow -->
          <div class="col-lg-2 col-md-3 col-6">
            <p class="tda-footer-heading">Follow Us</p>
            <ul class="list-unstyled tda-footer-links">
              <li><a href="https://pinterest.com/TheDailyArray" target="_blank" rel="noopener">Pinterest</a></li>
              <!-- <li><a href="#" target="_blank" rel="noopener">TikTok</a></li>
              <li><a href="#" target="_blank" rel="noopener">Instagram</a></li> -->
            </ul>
          </div>

        </div>
      </div>

      <div class="tda-footer-bottom">
        <div class="container">
          <div class="row align-items-center py-3 g-2">
            <div class="col-md-6">
              <p class="mb-0 tda-footer-copy">© 2026 The Daily Array. All rights reserved.</p>
            </div>
            <div class="col-md-6 text-md-end">
              <p class="mb-0 tda-footer-disclaimer">
                Amazon affiliate disclosure: We may earn a small commission
                from qualifying purchases at no extra cost to you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .tda-footer {
      background: #1a1a2e;
      color: #a0a8b8;
    }
    .tda-footer-brand {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.5rem;
      font-weight: 500;
      color: #f5f0e8;
      text-decoration: none;
    }
    .tda-footer-brand span { color: #c9a84c; }
    .tda-footer-text {
      font-size: 0.8125rem;
      line-height: 1.7;
      color: #a0a8b8;
      max-width: 340px;
    }
    .tda-social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 50%;
      color: #a0a8b8;
      font-size: 0.875rem;
      text-decoration: none;
      transition: all 0.2s;
    }
    .tda-social-link:hover {
      background: #c9a84c;
      border-color: #c9a84c;
      color: #1a1a2e;
    }
    .tda-footer-heading {
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #c9a84c;
      margin-bottom: 1rem;
    }
    .tda-footer-links li { margin-bottom: 0.625rem; }
    .tda-footer-links a {
      font-size: 0.8125rem;
      color: #a0a8b8;
      text-decoration: none;
      transition: color 0.2s;
    }
    .tda-footer-links a:hover { color: #f5f0e8; }
    .tda-footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.07);
    }
    .tda-footer-copy,
    .tda-footer-disclaimer {
      font-size: 0.75rem;
      color: #a0a8b8;
      opacity: 0.7;
      line-height: 1.5;
    }
  `]
})
export class FooterComponent {}
