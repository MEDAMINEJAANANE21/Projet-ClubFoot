package com.clubfoot.api.auth;

import java.time.Instant;

public record TokenResponse(String token, String username, Instant expiresAt) {
}
