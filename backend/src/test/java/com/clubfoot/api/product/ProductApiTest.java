package com.clubfoot.api.product;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;

import com.clubfoot.api.ApiIntegrationTest;

class ProductApiTest extends ApiIntegrationTest {

    private static final String NEW_PRODUCT = """
            {
              "name": "Écharpe",
              "category": "HOODIE",
              "color": "Rouge et blanc",
              "price": 150.00,
              "imageUrl": "/images/boutique/echarpe.jpeg"
            }
            """;

    @Test
    void listsSeededProductsInCatalogOrder() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(8)))
                .andExpect(jsonPath("$[0].name").value("Maillot 87 ans"))
                .andExpect(jsonPath("$[0].badge").value("Édition limitée"));
    }

    @Test
    void filtersByCategory() throws Exception {
        mockMvc.perform(get("/api/products").param("category", "POLO"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)));
    }

    @Test
    void returnsProblemDetailWhenProductDoesNotExist() throws Exception {
        mockMvc.perform(get("/api/products/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.title").value("Ressource introuvable"))
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void refusesCreationWithoutToken() throws Exception {
        mockMvc.perform(withJson(post("/api/products"), NEW_PRODUCT))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void adminCanCreateUpdateAndDeleteProduct() throws Exception {
        String location = mockMvc.perform(withJson(asAdmin(post("/api/products")), NEW_PRODUCT))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(jsonPath("$.name").value("Écharpe"))
                .andReturn().getResponse().getHeader("Location");

        mockMvc.perform(withJson(asAdmin(put(location)), NEW_PRODUCT.replace("150.00", "175.00")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.price").value(175.0));

        mockMvc.perform(asAdmin(delete(location)))
                .andExpect(status().isNoContent());
        mockMvc.perform(get(location))
                .andExpect(status().isNotFound());
    }

    @Test
    void rejectsInvalidProduct() throws Exception {
        mockMvc.perform(withJson(asAdmin(post("/api/products")), """
                        {"name": "", "category": "JERSEY", "color": "Rouge", "price": -5, "imageUrl": "x.jpeg"}
                        """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.name").exists())
                .andExpect(jsonPath("$.errors.price").value("Le prix doit être positif."));
    }
}
