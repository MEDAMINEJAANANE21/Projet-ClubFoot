package com.clubfoot.api.order;

/**
 * Coordonnées du client, regroupées pour éviter un constructeur à rallonge (refactoring « Introduce Parameter Object »).
 */
public record CustomerDetails(String fullName, String email, String phone, String address, String city) {
}
