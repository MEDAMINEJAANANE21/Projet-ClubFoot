package com.clubfoot.api.order;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

class OrderStatusTest {

    @ParameterizedTest(name = "{0} -> {1} : {2}")
    @CsvSource({
            "PENDING,   CONFIRMED, true",
            "PENDING,   CANCELLED, true",
            "PENDING,   SHIPPED,   false",
            "CONFIRMED, SHIPPED,   true",
            "CONFIRMED, PENDING,   false",
            "SHIPPED,   CANCELLED, false",
            "CANCELLED, CONFIRMED, false"
    })
    void allowsOnlyForwardTransitions(OrderStatus from, OrderStatus to, boolean allowed) {
        assertThat(from.canTransitionTo(to)).isEqualTo(allowed);
    }
}
