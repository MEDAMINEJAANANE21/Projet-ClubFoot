package com.clubfoot.api.auth;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.emptyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;

import com.clubfoot.api.ApiIntegrationTest;

class AuthApiTest extends ApiIntegrationTest {

    @Test
    void returnsTokenForValidCredentials() throws Exception {
        mockMvc.perform(withJson(post("/api/auth/login"), """
                        {"username": "admin", "password": "test-password"}
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value(not(emptyString())))
                .andExpect(jsonPath("$.username").value("admin"))
                .andExpect(jsonPath("$.expiresAt").exists());
    }

    @Test
    void rejectsWrongPassword() throws Exception {
        mockMvc.perform(withJson(post("/api/auth/login"), """
                        {"username": "admin", "password": "mauvais"}
                        """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.title").value("Authentification refusée"));
    }

    @Test
    void rejectsBlankFields() throws Exception {
        mockMvc.perform(withJson(post("/api/auth/login"), """
                        {"username": "", "password": ""}
                        """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.username").exists())
                .andExpect(jsonPath("$.errors.password").exists());
    }
}
