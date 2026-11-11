package com.clubfoot.api.product;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProductCategory category;

    @Column(nullable = false, length = 40)
    private String color;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(length = 40)
    private String badge;

    protected Product() {
    }

    public Product(String name, ProductCategory category, String color, BigDecimal price, String imageUrl, String badge) {
        update(name, category, color, price, imageUrl, badge);
    }

    public final void update(
            String name, ProductCategory category, String color, BigDecimal price, String imageUrl, String badge) {
        this.name = name;
        this.category = category;
        this.color = color;
        this.price = price;
        this.imageUrl = imageUrl;
        this.badge = badge;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public ProductCategory getCategory() {
        return category;
    }

    public String getColor() {
        return color;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getBadge() {
        return badge;
    }
}
