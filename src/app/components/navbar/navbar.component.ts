import { Component, signal, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg tda-navbar" [class.tda-navbar--scrolled]="scrolled()">
      <div class="container">

        <!-- Brand -->
        <a class="navbar-brand tda-brand" routerLink="/">
          The Daily <span>Array</span>
        </a>

        <!-- Mobile toggler -->

        <button class="navbar-toggler border-0 shadow-none"
          type="button"
          (click)="toggleMenu()"
          [attr.aria-expanded]="menuOpen()"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Links -->
        <div class="collapse navbar-collapse" [class.show]="menuOpen()">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0 gap-lg-1">
            <li class="nav-item">
              <a class="nav-link" routerLink="/" routerLinkActive="active"
                [routerLinkActiveOptions]="{exact:true}" (click)="closeMenu()">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/categories/pillows-bedding"
                routerLinkActive="active" (click)="closeMenu()">Pillows</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/categories/mattress-toppers"
                routerLinkActive="active" (click)="closeMenu()">Mattress Toppers</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/categories/bedroom-decor"
                routerLinkActive="active" (click)="closeMenu()">Bedroom Decor</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/categories/budget-upgrades"
                routerLinkActive="active" (click)="closeMenu()">Under $50</a>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  `,
  styles: [`
    .tda-navbar {
      background: rgba(253, 248, 239, 0.95);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid transparent;
      transition: border-color 0.3s, box-shadow 0.3s;
      position: sticky;
      top: 0;
      z-index: 1030;
      padding: 0.75rem 0;
    }
    .tda-navbar--scrolled {
      border-color: #f0ead8;
      box-shadow: 0 2px 20px rgba(0,0,0,0.06);
    }
    .tda-brand {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.4rem;
      font-weight: 500;
      color: #1a1a1a !important;
      letter-spacing: 0.01em;
    }
    .tda-brand span { color: #b5832a; }
    .navbar-collapse {
      visibility: visible !important;
    }
    .nav-link {
      font-size: 0.8125rem;
      font-weight: 400;
      color: #666 !important;
      letter-spacing: 0.03em;
      padding: 0.4rem 0.75rem !important;
      transition: color 0.2s;
    }
    .nav-link:hover,
    .nav-link.active { color: #1a1a1a !important; }
    .navbar-toggler:focus { box-shadow: none; }
    .navbar-toggler .bi { font-size: 1.25rem; color: #1a1a1a; }
  `]
})
export class NavbarComponent {
  scrolled = signal(false);
  menuOpen = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 10);
  }

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
