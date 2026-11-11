package com.clubfoot.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class ClubfootApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ClubfootApiApplication.class, args);
    }
}
