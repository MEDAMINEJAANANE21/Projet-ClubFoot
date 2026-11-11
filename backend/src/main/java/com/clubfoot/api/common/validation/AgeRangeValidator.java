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
        if (birthDate == null) {
            return true;
        }
        int age = Period.between(birthDate, LocalDate.now(clock)).getYears();
        return !birthDate.isAfter(LocalDate.now(clock)) && age >= minAge && age <= maxAge;
    }
}
