package com.clubfoot.api.config;

import java.time.Clock;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ClockConfig {

    // Injecter l'horloge permet de figer le temps dans les tests.
    @Bean
    Clock clock() {
        return Clock.systemUTC();
    }
}
