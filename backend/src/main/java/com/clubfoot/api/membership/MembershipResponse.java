package com.clubfoot.api.membership;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;

public record MembershipResponse(
        Long id,
        String fullName,
        LocalDate birthDate,
        Gender gender,
        String email,
        String phone,
        String address,
        String country,
        Set<IdentityDocument> documents,
        MembershipStatus status,
        Instant createdAt) {

    static MembershipResponse from(MembershipApplication application) {
        return new MembershipResponse(
                application.getId(),
                application.getFullName(),
                application.getBirthDate(),
                application.getGender(),
                application.getEmail(),
                application.getPhone(),
                application.getAddress(),
                application.getCountry(),
                Set.copyOf(application.getDocuments()),
                application.getStatus(),
                application.getCreatedAt());
    }
}
