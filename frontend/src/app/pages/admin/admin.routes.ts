import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'commandes' },
  {
    path: 'commandes',
    title: 'Commandes · Admin Wydad AC',
    loadComponent: () => import('./orders-admin/orders-admin').then((m) => m.OrdersAdmin),
  },
  {
    path: 'adhesions',
    title: 'Adhésions · Admin Wydad AC',
    loadComponent: () => import('./memberships-admin/memberships-admin').then((m) => m.MembershipsAdmin),
  },
  {
    path: 'messages',
    title: 'Messages · Admin Wydad AC',
    loadComponent: () => import('./messages-admin/messages-admin').then((m) => m.MessagesAdmin),
  },
];
