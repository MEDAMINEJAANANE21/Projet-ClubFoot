import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthStore } from '../../../core/auth/auth-store';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayout {
  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly tabs = [
    { path: 'commandes', label: 'Commandes' },
    { path: 'adhesions', label: 'Adhésions' },
    { path: 'messages', label: 'Messages' },
  ] as const;

  protected logout(): void {
    this.authStore.logout();
    void this.router.navigate(['/admin/connexion']);
  }
}
