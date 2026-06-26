import { Component, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MainHomeComponent } from '../main-home/main-home.component';

@Component({
  selector: 'app-home-router',
  standalone: true,
  imports: [CommonModule, MainHomeComponent],
  template: `
   

    <!-- <ng-template #mainHome> -->
      <app-main-home />
    <!-- </ng-template> -->
  `
})
export class HomeRouterComponent {
  // private subdomainService = inject(SubdomainService);

  // hasSubdomain = this.subdomainService.hasSubdomain();
}
