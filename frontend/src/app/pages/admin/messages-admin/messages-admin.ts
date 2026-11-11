import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject } from '@angular/core';

import { ContactApi } from '../../../core/api/contact-api';
import { ContactMessage } from '../../../core/api/models';
import { SUBJECT_LABELS } from '../../../shared/formatting/labels';
import { RemoteList } from '../remote-list';

@Component({
  selector: 'app-messages-admin',
  imports: [DatePipe],
  templateUrl: './messages-admin.html',
  styleUrl: './messages-admin.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesAdmin {
  private readonly contactApi = inject(ContactApi);

  protected readonly messages = new RemoteList<ContactMessage>(() => this.contactApi.list(), inject(DestroyRef));
  protected readonly subjectLabels = SUBJECT_LABELS;
  protected readonly unreadCount = computed(() => this.messages.items().filter((message) => !message.read).length);

  constructor() {
    this.messages.load();
  }

  protected markAsRead(message: ContactMessage): void {
    this.messages.update(this.contactApi.markAsRead(message.id));
  }
}
