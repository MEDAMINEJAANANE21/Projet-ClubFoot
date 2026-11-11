import { Injectable, signal } from '@angular/core';

const DISPLAY_DURATION_MS = 2500;

@Injectable({ providedIn: 'root' })
export class ToastStore {
  readonly message = signal<string | null>(null);
  private timeoutId: ReturnType<typeof setTimeout> | undefined;

  show(message: string): void {
    this.message.set(message);
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => this.message.set(null), DISPLAY_DURATION_MS);
  }
}
