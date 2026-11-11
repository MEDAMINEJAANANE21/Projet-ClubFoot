package com.clubfoot.api.contact;

import java.time.Instant;

public record ContactMessageResponse(
        Long id,
        String name,
        String email,
        ContactSubject subject,
        String message,
        boolean read,
        Instant createdAt) {

    static ContactMessageResponse from(ContactMessage contactMessage) {
        return new ContactMessageResponse(
                contactMessage.getId(),
                contactMessage.getName(),
                contactMessage.getEmail(),
                contactMessage.getSubject(),
                contactMessage.getMessage(),
                contactMessage.isRead(),
                contactMessage.getCreatedAt());
    }
}
