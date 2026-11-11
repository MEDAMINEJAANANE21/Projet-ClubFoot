package com.clubfoot.api.order;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.matchesPattern;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;

import com.clubfoot.api.ApiIntegrationTest;
import com.jayway.jsonpath.JsonPath;

class OrderApiTest extends ApiIntegrationTest {

    private static String orderWithLines(String lines) {
        return """
                {
                  "fullName": "Amine Test",
                  "email": "amine@exemple.com",
                  "phone": "06 12 34 56 78",
                  "address": "12 rue Exemple",
                  "city": "Casablanca",
                  "lines": %s
                }
                """.formatted(lines);
    }

    private Integer createOrder() throws Exception {
        String response = mockMvc.perform(withJson(post("/api/orders"), orderWithLines("""
                        [{"productId": 1, "quantity": 1}]
                        """)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(response, "$.id");
    }

    @Test
    void computesTotalFromDatabasePrices() throws Exception {
        mockMvc.perform(withJson(post("/api/orders"), orderWithLines("""
                        [{"productId": 1, "quantity": 2}, {"productId": 5, "quantity": 1}]
                        """)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.reference").value(matchesPattern("WAC-\\d{8}-[A-Z2-9]{6}")))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.total").value(2200.0))
                .andExpect(jsonPath("$.lines", hasSize(2)))
                .andExpect(jsonPath("$.lines[0].productName").value("Maillot 87 ans"))
                .andExpect(jsonPath("$.lines[0].subtotal").value(1600.0));
    }

    @Test
    void mergesLinesForTheSameProduct() throws Exception {
        mockMvc.perform(withJson(post("/api/orders"), orderWithLines("""
                        [{"productId": 2, "quantity": 1}, {"productId": 2, "quantity": 2}]
                        """)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.lines", hasSize(1)))
                .andExpect(jsonPath("$.lines[0].quantity").value(3))
                .andExpect(jsonPath("$.total").value(2400.0));
    }

    @Test
    void rejectsUnknownProduct() throws Exception {
        mockMvc.perform(withJson(post("/api/orders"), orderWithLines("""
                        [{"productId": 999, "quantity": 1}]
                        """)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.detail").value("Produit introuvable (id = 999)."));
    }

    @Test
    void rejectsInvalidCustomerAndQuantity() throws Exception {
        String body = orderWithLines("""
                [{"productId": 1, "quantity": 0}]
                """).replace("amine@exemple.com", "pas-un-email").replace("06 12 34 56 78", "123");

        mockMvc.perform(withJson(post("/api/orders"), body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.email").value("Adresse e-mail invalide."))
                .andExpect(jsonPath("$.errors.phone").exists())
                .andExpect(jsonPath("$.errors['lines[0].quantity']").value("La quantité minimale est 1."));
    }

    @Test
    void listingRequiresAdmin() throws Exception {
        createOrder();

        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(asAdmin(get("/api/orders")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void followsAllowedStatusTransitions() throws Exception {
        Integer id = createOrder();

        mockMvc.perform(withJson(asAdmin(patch("/api/orders/{id}/status", id)), """
                        {"status": "SHIPPED"}
                        """))
                .andExpect(status().isBadRequest());

        mockMvc.perform(withJson(asAdmin(patch("/api/orders/{id}/status", id)), """
                        {"status": "CONFIRMED"}
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
    }
}
