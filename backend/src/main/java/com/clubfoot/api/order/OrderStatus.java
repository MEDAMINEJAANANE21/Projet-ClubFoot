package com.clubfoot.api.order;

import java.util.Set;

public enum OrderStatus {
    PENDING,
    CONFIRMED,
    SHIPPED,
    CANCELLED;

    public boolean canTransitionTo(OrderStatus target) {
        return switch (this) {
            case PENDING -> Set.of(CONFIRMED, CANCELLED).contains(target);
            case CONFIRMED -> Set.of(SHIPPED, CANCELLED).contains(target);
            case SHIPPED, CANCELLED -> false;
        };
    }
}
