package com.clubfoot.api.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ContactMessageRequest(
        @NotBlank(message = "Le nom est obligatoire.")
        @Size(max = 120, message = "Le nom ne doit pas dépasser 120 caractères.")
        String name,

        @NotBlank(message = "L'e-mail est obligatoire.")
        @Email(message = "Adresse e-mail invalide.")
        @Size(max = 160, message = "L'e-mail ne doit pas dépasser 160 caractères.")
        String email,

        @NotNull(message = "Le sujet est obligatoire.")
        ContactSubject subject,

        @NotBlank(message = "Le message est obligatoire.")
        @Size(min = 20, max = 2000, message = "Le message doit contenir entre 20 et 2000 caractères.")
        String message) {
}
