import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../models';

@Component({
  selector: 'app-category-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <a [routerLink]="['/categories', category().slug]" class="tda-cat-card d-block text-decoration-none p-4">
      <p class="tda-cat-num mb-2">0{{ index() + 1 }}</p>
      <h5 class="tda-cat-name mb-2">{{ category().name }}</h5>
      <p class="tda-cat-desc mb-3">{{ category().description }}</p>
      <span class="tda-cat-link">
        Explore <i class="bi bi-arrow-right ms-1"></i>
      </span>
    </a>
  `,
  styles: [`
    .tda-cat-card {
      background: #fff;
      border: 1px solid #f0ead8;
      border-radius: 4px;
      position: relative;
      overflow: hidden;
      color: inherit;
      transition: all 0.25s cubic-bezier(.25,.46,.45,.94);
    }
    .tda-cat-card::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 2px;
      background: #b5832a;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s cubic-bezier(.25,.46,.45,.94);
    }
    .tda-cat-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 28px rgba(0,0,0,0.07);
      border-color: #d4c5a9;
    }
    .tda-cat-card:hover::after { transform: scaleX(1); }
    .tda-cat-num {
      font-family: 'Cormorant Garamond', serif;
      font-size: 2.5rem;
      font-weight: 300;
      color: rgba(181, 131, 42, 0.18);
      line-height: 1;
    }
    .tda-cat-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.2rem;
      font-weight: 500;
      color: #1a1a1a;
      line-height: 1.3;
    }
    .tda-cat-desc {
      font-size: 0.8125rem;
      color: #888;
      line-height: 1.6;
    }
    .tda-cat-link {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #b5832a;
      transition: gap 0.2s;
    }
    .tda-cat-card:hover .tda-cat-link { text-decoration: underline; }
  `]
})
export class CategoryCardComponent {
  readonly category = input.required<Category>();
  readonly index = input<number>(0);
}
