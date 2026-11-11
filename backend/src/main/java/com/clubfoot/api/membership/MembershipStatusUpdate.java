package com.clubfoot.api.membership;

import jakarta.validation.constraints.NotNull;

public record MembershipStatusUpdate(@NotNull(message = "Le statut est obligatoire.") MembershipStatus status) {
}
