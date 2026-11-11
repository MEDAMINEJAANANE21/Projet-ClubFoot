import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section class="section">
      <div class="container not-found">
        <span class="not-found__code" aria-hidden="true">404</span>
        <h1 class="section__title">Page introuvable</h1>
        <p class="section__lead">Cette page n'existe pas ou a été déplacée.</p>
        <a class="btn btn--primary" routerLink="/">Retour à l'accueil</a>
      </div>
    </section>
  `,
  styles: `
    .not-found {
      display: grid;
      justify-items: center;
      gap: 16px;
      text-align: center;
    }

    .not-found__code {
      font-family: var(--font-display);
      font-size: clamp(6rem, 18vw, 10rem);
      font-weight: 800;
      line-height: 1;
      color: var(--red);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {}
