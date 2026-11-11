import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ToastStore } from '../../core/ui/toast-store';

@Component({
  selector: 'app-toast',
  template: `
    <div class="toast" role="status" [class.toast--visible]="toast.message()">
      {{ toast.message() }}
    </div>
  `,
  styles: `
    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      z-index: 60;
      max-width: calc(100% - 32px);
      padding: 12px 20px;
      border-radius: var(--radius);
      background: var(--ink);
      color: var(--paper);
      font-weight: 600;
      box-shadow: var(--shadow);
      opacity: 0;
      pointer-events: none;
      transform: translate(-50%, 16px);
      transition: opacity 0.25s, transform 0.25s;
    }

    .toast--visible {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast {
  protected readonly toast = inject(ToastStore);
}
