package com.clubfoot.api.order;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clubfoot.api.config.OpenApiConfig;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Commandes")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @Operation(summary = "Passe une commande ; le total est calculé à partir des prix en base")
    public ResponseEntity<OrderResponse> create(@Valid @RequestBody CreateOrderRequest request) {
        OrderResponse created = orderService.create(request);
        return ResponseEntity.created(URI.create("/api/orders/" + created.id())).body(created);
    }

    @GetMapping
    @Operation(summary = "Liste les commandes, de la plus récente à la plus ancienne (admin)")
    @SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
    public List<OrderResponse> findAll() {
        return orderService.findAll();
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Change le statut d'une commande (admin)")
    @SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
    public OrderResponse updateStatus(@PathVariable Long id, @Valid @RequestBody OrderStatusUpdate update) {
        return orderService.updateStatus(id, update.status());
    }
}
