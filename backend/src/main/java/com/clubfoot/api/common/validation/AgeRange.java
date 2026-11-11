package com.clubfoot.api.common.validation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

/**
 * Vérifie qu'une date de naissance correspond à un âge compris entre {@code min} et {@code max} ans.
 */
@Documented
@Constraint(validatedBy = AgeRangeValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.RECORD_COMPONENT})
@Retention(RetentionPolicy.RUNTIME)
public @interface AgeRange {

    int min();

    int max();

    String message() default "L'âge doit être compris entre {min} et {max} ans.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
