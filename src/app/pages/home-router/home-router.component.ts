import { Component, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MainHomeComponent } from '../main-home/main-home.component';
import { NicheHomeComponent } from '../niche-home/niche-home.component';
import { SubdomainService } from '../../services/subdomain.service';

@Component({
  selector: 'app-home-router',
  standalone: true,
  imports: [CommonModule, NgIf, MainHomeComponent, NicheHomeComponent],
  template: `
    <ng-container *ngIf="hasSubdomain; else mainHome">
      <app-niche-home />
    </ng-container>

    <ng-template #mainHome>
      <app-main-home />
    </ng-template>
  `
})
export class HomeRouterComponent {
  private subdomainService = inject(SubdomainService);

  hasSubdomain = this.subdomainService.hasSubdomain();
}
