package com.clubfoot.api.product;

import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        String name,
        ProductCategory category,
        String color,
        BigDecimal price,
        String imageUrl,
        String badge) {

    static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getCategory(),
                product.getColor(),
                product.getPrice(),
                product.getImageUrl(),
                product.getBadge());
    }
}
