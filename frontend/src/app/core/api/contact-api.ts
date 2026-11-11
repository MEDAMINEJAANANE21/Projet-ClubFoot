import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ContactMessage, ContactMessageRequest } from './models';

@Injectable({ providedIn: 'root' })
export class ContactApi {
  private readonly http = inject(HttpClient);

  send(request: ContactMessageRequest): Observable<ContactMessage> {
    return this.http.post<ContactMessage>('/api/contact-messages', request);
  }

  list(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>('/api/contact-messages');
  }

  markAsRead(id: number): Observable<ContactMessage> {
    return this.http.patch<ContactMessage>(`/api/contact-messages/${id}/read`, {});
  }
}
