package com.clubfoot.api.common.validation;

import java.time.Clock;
import java.time.LocalDate;
import java.time.Period;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class AgeRangeValidator implements ConstraintValidator<AgeRange, LocalDate> {

    private final Clock clock;
    private int minAge;
    private int maxAge;

    public AgeRangeValidator() {
        this(Clock.systemDefaultZone());
    }

    AgeRangeValidator(Clock clock) {
        this.clock = clock;
    }

    @Override
    public void initialize(AgeRange constraint) {
        minAge = constraint.min();
        maxAge = constraint.max();
    }

    @Override
    public boolean isValid(LocalDate birthDate, ConstraintValidatorContext context) {
        // Le cas null est laissé à @NotNull, pour n'afficher qu'un seul message.
        return birthDate == null || isAgeBetween(birthDate, LocalDate.now(clock), minAge, maxAge);
    }

    static boolean isAgeBetween(LocalDate birthDate, LocalDate today, int minAge, int maxAge) {
        if (birthDate.isAfter(today)) {
            return false;
        }
        int age = Period.between(birthDate, today).getYears();
        return age >= minAge && age <= maxAge;
    }
}
