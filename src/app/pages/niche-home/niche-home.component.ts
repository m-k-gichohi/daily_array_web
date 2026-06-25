import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SubdomainService } from '../../services/subdomain.service';
import { SupabaseService } from '../../services/supabase.service';
import { Category } from '../../models';
import { NicheNavbarComponent } from '../../components/niche-navbar/niche-navbar.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-niche-home',
  standalone: true,
  imports: [NicheNavbarComponent],
  templateUrl: './niche-home.component.html',
  styleUrls: ['./niche-home.component.css'],
})
export class NicheHomeComponent implements OnInit {
  private subdomainService = inject(SubdomainService);
  private supabaseService = inject(SupabaseService);
  readonly heroHtml = signal<SafeHtml | null>(null);
  private readonly sanitizer = inject(DomSanitizer);

  private readonly subdomain = this.subdomainService.getSubdomain() ?? 'Daily';
  category = signal<Category | null>(null);
  loading = signal(true);

  ngOnInit() {
    this.fetchCategory();
  }

  private async fetchCategory() {
    try {
      if (this.subdomain && this.subdomain !== 'Daily') {
        const cat = await this.supabaseService.getCategoryBySubdomain(this.subdomain);
        this.category.set(cat);

        // Sanitize hero HTML if provided
        if (cat && cat.hero_html) {
          this.heroHtml.set(this.sanitizer.bypassSecurityTrustHtml(cat.hero_html));
        }
      }
    } catch (err) {
      console.error('Failed to load category:', err);
    } finally {
      this.loading.set(false);
    }
  }

  

  get displayName(): string {
    return (
      this.category()?.name ?? this.subdomain.charAt(0).toUpperCase() + this.subdomain.slice(1)
    );
  }
}
