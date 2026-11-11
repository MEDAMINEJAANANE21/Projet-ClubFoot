import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Membership, MembershipRequest, MembershipStatus } from './models';

@Injectable({ providedIn: 'root' })
export class MembershipApi {
  private readonly http = inject(HttpClient);

  create(request: MembershipRequest): Observable<Membership> {
    return this.http.post<Membership>('/api/memberships', request);
  }

  list(): Observable<Membership[]> {
    return this.http.get<Membership[]>('/api/memberships');
  }

  updateStatus(id: number, status: MembershipStatus): Observable<Membership> {
    return this.http.patch<Membership>(`/api/memberships/${id}/status`, { status });
  }
}
