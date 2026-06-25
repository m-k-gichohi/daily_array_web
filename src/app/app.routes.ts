import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home-router/home-router.component').then(m => m.HomeRouterComponent)
  },
  {
    path: 'categories/:slug',
    loadComponent: () => import('./pages/category/category.component').then(m => m.CategoryComponent)
  },
  {
    path: 'products/:slug',
    loadComponent: () => import('./pages/product/product.component').then(m => m.ProductComponent)
  },

    {
    path: 'privacy-policy',
    loadComponent: () => import('./pages/privacy-policy/privacy-policy').then(m => m.PrivacyPolicyComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
