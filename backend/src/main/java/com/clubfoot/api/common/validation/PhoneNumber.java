package com.clubfoot.api.common.validation;

/**
 * Format de téléphone accepté : {@code 06 12 34 56 78} ou {@code +212 6 12 34 56 78}
 * (espaces, points et tirets autorisés entre les chiffres).
 */
public final class PhoneNumber {

    public static final String PATTERN = "^(\\+\\d{2,3}\\s?|0)(\\d[\\s.-]?){8}\\d$";
    public static final String MESSAGE = "Numéro invalide (exemple : 06 12 34 56 78 ou +212 6 12 34 56 78).";

    private PhoneNumber() {
    }
}
