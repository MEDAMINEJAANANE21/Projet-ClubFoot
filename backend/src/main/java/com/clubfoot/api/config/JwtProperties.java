package com.clubfoot.api.config;

import java.nio.charset.StandardCharsets;
import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("app.jwt")
public record JwtProperties(String secret, Duration expiration, String issuer) {

    private static final int MIN_SECRET_BYTES = 32;

    public JwtProperties {
        // HS256 exige une clé d'au moins 256 bits : on échoue au démarrage plutôt qu'à la première connexion.
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < MIN_SECRET_BYTES) {
            throw new IllegalArgumentException("app.jwt.secret doit contenir au moins 32 caractères.");
        }
    }
}
