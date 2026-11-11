package com.clubfoot.api.order;

import jakarta.validation.constraints.NotNull;

public record OrderStatusUpdate(@NotNull(message = "Le statut est obligatoire.") OrderStatus status) {
}
