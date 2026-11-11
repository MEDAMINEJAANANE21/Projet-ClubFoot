package com.clubfoot.api.order;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long id,
        String reference,
        String customerName,
        String email,
        String phone,
        String address,
        String city,
        OrderStatus status,
        BigDecimal total,
        Instant createdAt,
        List<Line> lines) {

    public record Line(Long productId, String productName, BigDecimal unitPrice, int quantity, BigDecimal subtotal) {

        static Line from(OrderLine line) {
            return new Line(
                    line.getProductId(), line.getProductName(), line.getUnitPrice(), line.getQuantity(), line.subtotal());
        }
    }

    static OrderResponse from(CustomerOrder order) {
        return new OrderResponse(
                order.getId(),
                order.getReference(),
                order.getCustomerName(),
                order.getCustomerEmail(),
                order.getCustomerPhone(),
                order.getShippingAddress(),
                order.getCity(),
                order.getStatus(),
                order.getTotal(),
                order.getCreatedAt(),
                order.getLines().stream().map(Line::from).toList());
    }
}
