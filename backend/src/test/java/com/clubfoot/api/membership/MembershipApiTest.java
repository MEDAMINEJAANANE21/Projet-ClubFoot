package com.clubfoot.api.membership;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;

import com.clubfoot.api.ApiIntegrationTest;
import com.jayway.jsonpath.JsonPath;

class MembershipApiTest extends ApiIntegrationTest {

    private static String application(LocalDate birthDate, boolean consent) {
        return """
                {
                  "fullName": "Amine Test",
                  "birthDate": "%s",
                  "gender": "MALE",
                  "email": "amine@exemple.com",
                  "phone": "+212 6 12 34 56 78",
                  "address": "12 rue Exemple, Casablanca",
                  "country": "Maroc",
                  "documents": ["NATIONAL_ID_CARD", "ID_PHOTO"],
                  "consent": %s
                }
                """.formatted(birthDate, consent);
    }

    @Test
    void createsPendingApplication() throws Exception {
        mockMvc.perform(withJson(post("/api/memberships"), application(LocalDate.of(2001, 5, 12), true)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.documents", hasSize(2)));
    }

    @Test
    void rejectsTooYoungApplicantAndMissingConsent() throws Exception {
        mockMvc.perform(withJson(post("/api/memberships"), application(LocalDate.now().minusYears(2), false)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.birthDate").value("L'âge doit être compris entre 5 et 110 ans."))
                .andExpect(jsonPath("$.errors.consent").exists());
    }

    @Test
    void adminCanApproveAndFilterApplications() throws Exception {
        String response = mockMvc.perform(withJson(post("/api/memberships"), application(LocalDate.of(1995, 1, 1), true)))
                .andReturn().getResponse().getContentAsString();
        Integer id = JsonPath.read(response, "$.id");

        mockMvc.perform(withJson(asAdmin(patch("/api/memberships/{id}/status", id)), """
                        {"status": "APPROVED"}
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("APPROVED"));

        mockMvc.perform(asAdmin(get("/api/memberships").param("status", "APPROVED")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
        mockMvc.perform(asAdmin(get("/api/memberships").param("status", "PENDING")))
                .andExpect(jsonPath("$", hasSize(0)));
    }
}
