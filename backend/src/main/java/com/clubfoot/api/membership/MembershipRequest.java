package com.clubfoot.api.membership;

import java.time.LocalDate;
import java.util.Set;

import com.clubfoot.api.common.validation.AgeRange;
import com.clubfoot.api.common.validation.PhoneNumber;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record MembershipRequest(
        @NotBlank(message = "Le nom complet est obligatoire.")
        @Size(max = 120, message = "Le nom ne doit pas dépasser 120 caractères.")
        String fullName,

        @NotNull(message = "La date de naissance est obligatoire.")
        @AgeRange(min = 5, max = 110)
        LocalDate birthDate,

        @NotNull(message = "Le sexe est obligatoire.")
        Gender gender,

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

        @NotBlank(message = "Le pays est obligatoire.")
        @Size(max = 60, message = "Le pays ne doit pas dépasser 60 caractères.")
        String country,

        @NotEmpty(message = "Cochez au moins une pièce justificative.")
        Set<@NotNull IdentityDocument> documents,

        @NotNull(message = "Vous devez accepter le traitement de vos données.")
        @AssertTrue(message = "Vous devez accepter le traitement de vos données.")
        Boolean consent) {
}
