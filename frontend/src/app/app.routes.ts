import { Routes } from '@angular/router';

import { adminGuard } from './core/auth/admin.guard';

const SITE_NAME = 'Wydad AC';

export const routes: Routes = [
  {
    path: '',
    title: 'Wydad Athletic Club',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'histoire',
    title: `Histoire du club · ${SITE_NAME}`,
    loadComponent: () => import('./pages/history/history').then((m) => m.History),
  },
  {
    path: 'boutique',
    title: `Boutique · ${SITE_NAME}`,
    loadComponent: () => import('./pages/shop/shop').then((m) => m.Shop),
  },
  {
    path: 'commande',
    title: `Commande · ${SITE_NAME}`,
    loadComponent: () => import('./pages/checkout/checkout').then((m) => m.Checkout),
  },
  {
    path: 'adhesion',
    title: `Adhésion · ${SITE_NAME}`,
    loadComponent: () => import('./pages/membership/membership').then((m) => m.MembershipPage),
  },
  {
    path: 'contact',
    title: `Contact · ${SITE_NAME}`,
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
  },
  {
    path: 'admin/connexion',
    title: `Connexion admin · ${SITE_NAME}`,
    loadComponent: () => import('./pages/admin/login/login').then((m) => m.Login),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/admin-layout/admin-layout').then((m) => m.AdminLayout),
    loadChildren: () => import('./pages/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: '**',
    title: `Page introuvable · ${SITE_NAME}`,
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
