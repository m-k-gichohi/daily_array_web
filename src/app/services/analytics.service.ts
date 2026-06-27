import { Injectable, PLATFORM_ID, inject as angularInject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { inject as vercelInject } from '@vercel/analytics';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private platformId = angularInject(PLATFORM_ID);

  constructor() {
    // Only inject analytics in the browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.initializeAnalytics();
    }
  }

  private initializeAnalytics(): void {
    vercelInject({
      mode: 'auto',
      debug: false
    });
  }
}