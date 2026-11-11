package com.clubfoot.api.order;

import java.util.List;

import com.clubfoot.api.common.validation.PhoneNumber;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateOrderRequest(
        @NotBlank(message = "Le nom est obligatoire.")
        @Size(max = 120, message = "Le nom ne doit pas dépasser 120 caractères.")
        String fullName,

        @NotBlank(message = "L'e-mail est obligatoire.")
        @Email(message = "Adresse e-mail invalide.")
        @Size(max = 160, message = "L'e-mail ne doit pas dépasser 160 caractères.")
        String email,

        @NotBlank(message = "Le téléphone est obligatoire.")
        @Pattern(regexp = PhoneNumber.PATTERN, message = PhoneNumber.MESSAGE)
        String phone,

        @NotBlank(message = "L'adresse est obligatoire.")
        @Size(max = 255, message = "L'adresse ne doit pas dépasser 255 caractères.")
        String address,

        @NotBlank(message = "La ville est obligatoire.")
        @Size(max = 80, message = "La ville ne doit pas dépasser 80 caractères.")
        String city,

        @NotEmpty(message = "La commande doit contenir au moins un article.")
        @Size(max = 20, message = "La commande ne peut pas contenir plus de 20 lignes.")
        List<@Valid @NotNull Line> lines) {

    public record Line(
            @NotNull(message = "Le produit est obligatoire.")
            Long productId,

            @NotNull(message = "La quantité est obligatoire.")
            @Min(value = 1, message = "La quantité minimale est 1.")
            @Max(value = 20, message = "La quantité maximale est 20.")
            Integer quantity) {
    }

    CustomerDetails customer() {
        return new CustomerDetails(fullName, email, phone, address, city);
    }
}
