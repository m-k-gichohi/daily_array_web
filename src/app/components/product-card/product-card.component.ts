import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink,CommonModule],
  template: `
    <a [routerLink]="['/products', product().slug]" class="tda-product-card card h-100 text-decoration-none">

      <!-- Image -->
      <div class="tda-card-img-wrap">
        <img
          [src]="product().image_url || 'assets/placeholder.jpg'"
          [alt]="product().name"
          class="tda-card-img"
          loading="lazy"
          (error)="onImgError($event)"
        />
        @if (product().category?.name) {
          <span class="tda-card-category-badge">{{ product().category!.name }}</span>
        }
        @if (product().is_featured) {
          <span class="tda-card-featured-badge">
            <i class="bi bi-star-fill me-1"></i>Featured
          </span>
        }
      </div>

      <!-- Body -->
      <div class="card-body d-flex flex-column p-3">
        <p class="tda-card-category mb-1">{{ product().category?.name }}</p>
        <h5 class="tda-card-title mb-2">{{ product().name }}</h5>
        <p class="tda-card-tagline mb-3 grow">{{ product().tagline }}</p>

       
      </div>

    </a>
  `,
  styles: [`
    .tda-product-card {
      border: 1px solid #f0ead8;
      border-radius: 4px;
      overflow: hidden;
      transition: transform 0.25s cubic-bezier(.25,.46,.45,.94),
                  box-shadow 0.25s cubic-bezier(.25,.46,.45,.94),
                  border-color 0.25s;
      color: inherit;
      background: #fff;
    }
    .tda-product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.09);
      border-color: #d4c5a9;
    }
    .tda-card-img-wrap {
      position: relative;
      aspect-ratio: 4/3;
      overflow: hidden;
      background: #f8f5ef;
    }
    .tda-card-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.5s cubic-bezier(.25,.46,.45,.94);
    }
    .tda-product-card:hover .tda-card-img { transform: scale(1.05); }
    .tda-card-category-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      font-size: 0.625rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      background: rgba(252,250,245,0.95);
      color: #b5832a;
      padding: 3px 8px;
      backdrop-filter: blur(8px);
    }
    .tda-card-featured-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 0.625rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      background: #b5832a;
      color: #fff;
      padding: 3px 8px;
    }
    .tda-card-category {
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #b5832a;
      margin: 0;
    }
    .tda-card-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.125rem;
      font-weight: 500;
      color: #1a1a1a;
      line-height: 1.3;
    }
    .tda-card-tagline {
      font-size: 0.8125rem;
      color: #888;
      line-height: 1.55;
    }

    .tda-product-card:hover .tda-card-cta { color: #b5832a; }
  `]
})
export class ProductCardComponent {
  // Angular 21 signal-based input
  readonly product = input.required<Product>();

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/placeholder.jpg';
  }
}
