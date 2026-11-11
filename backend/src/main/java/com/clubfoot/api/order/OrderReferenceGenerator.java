package com.clubfoot.api.order;

import java.security.SecureRandom;
import java.time.Clock;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Component;

/**
 * Génère une référence lisible, par exemple {@code WAC-20261111-K7P2QX}.
 */
@Component
public class OrderReferenceGenerator {

    private static final String PREFIX = "WAC";
    // Sans 0, O, 1 ni I pour éviter les confusions à la lecture.
    private static final String ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int SUFFIX_LENGTH = 6;
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.BASIC_ISO_DATE;

    private final SecureRandom random = new SecureRandom();
    private final Clock clock;

    public OrderReferenceGenerator(Clock clock) {
        this.clock = clock;
    }

    public String next() {
        StringBuilder suffix = new StringBuilder(SUFFIX_LENGTH);
        for (int i = 0; i < SUFFIX_LENGTH; i++) {
            suffix.append(ALPHABET.charAt(random.nextInt(ALPHABET.length())));
        }
        return "%s-%s-%s".formatted(PREFIX, LocalDate.now(clock).format(DATE_FORMAT), suffix);
    }
}
