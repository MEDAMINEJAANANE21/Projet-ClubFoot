package com.clubfoot.api.contact;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;

import com.clubfoot.api.ApiIntegrationTest;
import com.jayway.jsonpath.JsonPath;

class ContactMessageApiTest extends ApiIntegrationTest {

    private static final String VALID_MESSAGE = """
            {
              "name": "Amine",
              "email": "amine@exemple.com",
              "subject": "SHOP",
              "message": "Bonjour, quand le maillot third sera-t-il de nouveau disponible ?"
            }
            """;

    @Test
    void storesMessageAsUnread() throws Exception {
        mockMvc.perform(withJson(post("/api/contact-messages"), VALID_MESSAGE))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.read").value(false));
    }

    @Test
    void rejectsTooShortMessage() throws Exception {
        mockMvc.perform(withJson(post("/api/contact-messages"), VALID_MESSAGE.replaceAll("Bonjour.*\\?", "Trop court")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.message")
                        .value("Le message doit contenir entre 20 et 2000 caractères."));
    }

    @Test
    void adminCanListAndMarkAsRead() throws Exception {
        String response = mockMvc.perform(withJson(post("/api/contact-messages"), VALID_MESSAGE))
                .andReturn().getResponse().getContentAsString();
        Integer id = JsonPath.read(response, "$.id");

        mockMvc.perform(asAdmin(get("/api/contact-messages")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
        mockMvc.perform(asAdmin(patch("/api/contact-messages/{id}/read", id)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.read").value(true));
    }
}
