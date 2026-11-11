package com.clubfoot.api.product;

import java.math.BigDecimal;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record ProductRequest(
        @NotBlank(message = "Le nom est obligatoire.")
        @Size(max = 120, message = "Le nom ne doit pas dépasser 120 caractères.")
        String name,

        @NotNull(message = "La catégorie est obligatoire.")
        ProductCategory category,

        @NotBlank(message = "La couleur est obligatoire.")
        @Size(max = 40, message = "La couleur ne doit pas dépasser 40 caractères.")
        String color,

        @NotNull(message = "Le prix est obligatoire.")
        @Positive(message = "Le prix doit être positif.")
        @Digits(integer = 8, fraction = 2, message = "Le prix doit avoir au plus 2 décimales.")
        BigDecimal price,

        @NotBlank(message = "L'image est obligatoire.")
        @Size(max = 255, message = "Le chemin de l'image ne doit pas dépasser 255 caractères.")
        String imageUrl,

        @Size(max = 40, message = "Le badge ne doit pas dépasser 40 caractères.")
        String badge) {
}
