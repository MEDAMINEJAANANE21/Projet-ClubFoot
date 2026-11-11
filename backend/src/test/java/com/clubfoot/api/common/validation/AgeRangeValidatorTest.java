package com.clubfoot.api.common.validation;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.annotation.Annotation;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import jakarta.validation.Payload;

class AgeRangeValidatorTest {

    private static final Clock FIXED_CLOCK = Clock.fixed(Instant.parse("2026-06-15T10:00:00Z"), ZoneOffset.UTC);

    private final AgeRangeValidator validator = new AgeRangeValidator(FIXED_CLOCK);

    @BeforeEach
    void setUp() {
        validator.initialize(ageRange(5, 110));
    }

    private static AgeRange ageRange(int min, int max) {
        return new AgeRange() {
            @Override
            public int min() {
                return min;
            }

            @Override
            public int max() {
                return max;
            }

            @Override
            public String message() {
                return "";
            }

            @Override
            public Class<?>[] groups() {
                return new Class<?>[0];
            }

            @Override
            @SuppressWarnings("unchecked")
            public Class<? extends Payload>[] payload() {
                return new Class[0];
            }

            @Override
            public Class<? extends Annotation> annotationType() {
                return AgeRange.class;
            }
        };
    }

    @Test
    void acceptsAgeInsideRange() {
        assertThat(validator.isValid(LocalDate.of(2001, 5, 12), null)).isTrue();
    }

    @Test
    void acceptsExactlyMinimumAgeOnBirthday() {
        assertThat(validator.isValid(LocalDate.of(2021, 6, 15), null)).isTrue();
    }

    @Test
    void rejectsAgeJustBelowMinimum() {
        assertThat(validator.isValid(LocalDate.of(2021, 6, 16), null)).isFalse();
    }

    @Test
    void rejectsFutureDate() {
        assertThat(validator.isValid(LocalDate.of(2030, 1, 1), null)).isFalse();
    }

    @Test
    void leavesNullToNotNullConstraint() {
        assertThat(validator.isValid(null, null)).isTrue();
    }
}
