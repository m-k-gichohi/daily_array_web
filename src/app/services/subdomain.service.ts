import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SubdomainService {
  getSubdomain(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return environment.devSubdomain ?? null;
    }

    const parts = hostname.split('.');
    if (parts.length < 3) {
      return null;
    }

    return parts[0];
  }

  hasSubdomain(): boolean {
    return !!this.getSubdomain();
  }
}
// import { Injectable, signal, inject } from '@angular/core';
// import { SupabaseService } from './supabase.service';
// import { Category } from '../models';
// import { environment } from '../../environments/environment';

// @Injectable({ providedIn: 'root' })
// export class SubdomainService {
//   private readonly supabase = inject(SupabaseService);

//   // The detected subdomain slug e.g. "pillows"

//   readonly subdomain = signal<string | null>(null);

//   // The resolved category for this subdomain
//   readonly nicheCategory = signal<Category | null>(null);

//   // Whether we are currently on a niche subdomain
//   readonly isNiche = signal(false);

//   // Main domain — used for "Back to home" links
//   readonly mainDomain = 'https://dailyarrayshop.com';

//   /**
//    * Call once on app init.
//    * Reads window.location.hostname, extracts subdomain,
//    * queries Supabase for the matching category.
//    */
//   async init(): Promise<void> {
//     if (typeof window === 'undefined') {
//       const devSub = (environment as any).devSubdomain ?? null;
//       if (!devSub) {
//         this.isNiche.set(false);
//         this.subdomain.set(null);
//         this.nicheCategory.set(null);
//         return;
//       }

//       this.subdomain.set(devSub);
//     //   const category = await this.supabase.getCategoryBySubdomain(devSub);

//     //         console.log("dadadddadd category",category);

//     //   if (category) {
//     //     this.nicheCategory.set(category);
//     //     this.isNiche.set(true);
//     //   } else {
//     //     this.isNiche.set(false);
//     //     this.subdomain.set(null);
//     //   }
//       return;
//     }

//     const hostname = window.location.hostname;
//     const sub = this.extractSubdomain(hostname);

//     if (!sub) {
//       this.isNiche.set(false);
//       this.subdomain.set(null);
//       this.nicheCategory.set(null);
//       return;
//     }

//     this.subdomain.set(sub);

//     const category = await this.supabase.getCategoryBySubdomain(sub);

//      console.log("dadadddadd category",category);

//     if (category) {
//       this.nicheCategory.set(category);
//       this.isNiche.set(true);
//     } else {
//       this.isNiche.set(false);
//       this.subdomain.set(null);
//     }
//   }

//   // ── YOUR ORIGINAL METHODS — preserved as-is ──

//   /** Synchronous subdomain getter — use for quick checks */
//   getSubdomain(): string | null {
//     if (typeof window === 'undefined') {
//       return (environment as any).devSubdomain ?? null;
//     }
//     return this.extractSubdomain(window.location.hostname);
//   }

//   /** Returns true if currently on any subdomain */
//   hasSubdomain(): boolean {
//     return !!this.getSubdomain();
//   }

//   /**
//    * Extract subdomain from hostname — your original logic preserved,
//    * extended with www guard and SSR safety.
//    *
//    * e.g. "pillows.dailyarrayshop.com" → "pillows"
//    * e.g. "www.dailyarrayshop.com"     → null
//    * e.g. "dailyarrayshop.com"         → null
//    * e.g. "localhost"                  → environment.devSubdomain ?? null
//    * e.g. "127.0.0.1"                  → environment.devSubdomain ?? null
//    */
//   private extractSubdomain(hostname: string): string | null {
//     if (typeof window === 'undefined') return null;

//     // Strip port if present
//     const host = hostname.split(':')[0];

//     // Local dev — use devSubdomain from environment
//     if (host === 'localhost' || host === '127.0.0.1') {
//       return (environment as any).devSubdomain ?? null;
//     }

//     const parts = host.split('.');

//     // Need at least 3 parts for a subdomain: sub.domain.tld
//     if (parts.length < 3) return null;

//     // Ignore www
//     if (parts[0] === 'www') return null;

//     return parts[0];
//   }



//   /**
//    * Build a URL for a product on the current niche subdomain.
//    * e.g. /products/cooling-gel-pillow
//    * On niche: https://pillows.dailyarrayshop.com/products/cooling-gel-pillow
//    * On main:  /products/cooling-gel-pillow
//    */
//   buildProductUrl(slug: string): string {
//     if (this.isNiche() && this.subdomain()) {
//       return `https://${this.subdomain()}.dailyarrayshop.com/products/${slug}`;
//     }
//     return `/products/${slug}`;
//   }

//   /**
//    * Build the niche home URL.
//    * On niche: https://pillows.dailyarrayshop.com
//    * On main:  /categories/pillows-bedding
//    */
//   buildNicheHomeUrl(): string {
//     if (this.isNiche() && this.subdomain()) {
//       return `https://${this.subdomain()}.dailyarrayshop.com`;
//     }
//     const cat = this.nicheCategory();
//     return cat ? `/categories/${cat.slug}` : '/';
//   }
// }