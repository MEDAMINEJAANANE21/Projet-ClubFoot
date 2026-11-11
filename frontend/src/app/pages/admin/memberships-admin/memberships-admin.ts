import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';

import { MembershipApi } from '../../../core/api/membership-api';
import { Membership, MembershipStatus } from '../../../core/api/models';
import {
  DOCUMENT_LABELS,
  GENDER_LABELS,
  MEMBERSHIP_STATUS_LABELS,
  MEMBERSHIP_STATUS_TONES,
} from '../../../shared/formatting/labels';
import { RemoteList } from '../remote-list';

type StatusFilter = MembershipStatus | 'ALL';

@Component({
  selector: 'app-memberships-admin',
  imports: [DatePipe],
  templateUrl: './memberships-admin.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembershipsAdmin {
  private readonly membershipApi = inject(MembershipApi);

  protected readonly memberships = new RemoteList<Membership>(() => this.membershipApi.list(), inject(DestroyRef));
  protected readonly statusLabels = MEMBERSHIP_STATUS_LABELS;
  protected readonly statusTones = MEMBERSHIP_STATUS_TONES;
  protected readonly documentLabels = DOCUMENT_LABELS;
  protected readonly genderLabels = GENDER_LABELS;

  protected readonly filters: readonly { value: StatusFilter; label: string }[] = [
    { value: 'ALL', label: 'Toutes' },
    { value: 'PENDING', label: 'En attente' },
    { value: 'APPROVED', label: 'Acceptées' },
    { value: 'REJECTED', label: 'Refusées' },
  ];
  protected readonly selectedStatus = signal<StatusFilter>('ALL');

  protected readonly visibleMemberships = computed(() => {
    const status = this.selectedStatus();
    const items = this.memberships.items();
    return status === 'ALL' ? items : items.filter((membership) => membership.status === status);
  });

  constructor() {
    this.memberships.load();
  }

  protected decide(membership: Membership, status: MembershipStatus): void {
    this.memberships.update(this.membershipApi.updateStatus(membership.id, status));
  }
}
