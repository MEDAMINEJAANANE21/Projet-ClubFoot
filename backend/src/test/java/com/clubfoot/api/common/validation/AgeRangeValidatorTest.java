package com.clubfoot.api.common.validation;

import static com.clubfoot.api.common.validation.AgeRangeValidator.isAgeBetween;
import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;

import org.junit.jupiter.api.Test;

class AgeRangeValidatorTest {

    private static final LocalDate TODAY = LocalDate.of(2026, 6, 15);
    private static final int MIN_AGE = 5;
    private static final int MAX_AGE = 110;

    @Test
    void acceptsAgeInsideRange() {
        assertThat(isAgeBetween(LocalDate.of(2001, 5, 12), TODAY, MIN_AGE, MAX_AGE)).isTrue();
    }

    @Test
    void acceptsExactlyMinimumAgeOnBirthday() {
        assertThat(isAgeBetween(LocalDate.of(2021, 6, 15), TODAY, MIN_AGE, MAX_AGE)).isTrue();
    }

    @Test
    void rejectsAgeJustBelowMinimum() {
        assertThat(isAgeBetween(LocalDate.of(2021, 6, 16), TODAY, MIN_AGE, MAX_AGE)).isFalse();
    }

    @Test
    void rejectsFutureDate() {
        assertThat(isAgeBetween(LocalDate.of(2030, 1, 1), TODAY, MIN_AGE, MAX_AGE)).isFalse();
    }

    @Test
    void leavesNullToNotNullConstraint() {
        AgeRangeValidator validator = new AgeRangeValidator(Clock.fixed(Instant.parse("2026-06-15T10:00:00Z"), ZoneOffset.UTC));
        assertThat(validator.isValid(null, null)).isTrue();
    }
}
