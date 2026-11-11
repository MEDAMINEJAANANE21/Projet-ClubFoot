package com.clubfoot.api.order;

import java.time.Clock;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clubfoot.api.common.InvalidRequestException;
import com.clubfoot.api.common.ResourceNotFoundException;
import com.clubfoot.api.product.Product;
import com.clubfoot.api.product.ProductService;

@Service
@Transactional(readOnly = true)
public class OrderService {

    private static final String RESOURCE_NAME = "Commande";
    private static final int MAX_QUANTITY_PER_PRODUCT = 20;

    private final OrderRepository orderRepository;
    private final ProductService productService;
    private final OrderReferenceGenerator referenceGenerator;
    private final Clock clock;

    public OrderService(
            OrderRepository orderRepository,
            ProductService productService,
            OrderReferenceGenerator referenceGenerator,
            Clock clock) {
        this.orderRepository = orderRepository;
        this.productService = productService;
        this.referenceGenerator = referenceGenerator;
        this.clock = clock;
    }

    @Transactional
    public OrderResponse create(CreateOrderRequest request) {
        Map<Long, Integer> quantities = mergeQuantitiesByProduct(request.lines());
        Map<Long, Product> products = loadProducts(quantities);

        CustomerOrder order = new CustomerOrder(referenceGenerator.next(), request.customer(), clock.instant());
        quantities.forEach((productId, quantity) -> order.addLine(products.get(productId), quantity));

        return OrderResponse.from(orderRepository.save(order));
    }

    public List<OrderResponse> findAll() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream().map(OrderResponse::from).toList();
    }

    @Transactional
    public OrderResponse updateStatus(Long id, OrderStatus status) {
        CustomerOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(RESOURCE_NAME, id));
        order.changeStatus(status);
        return OrderResponse.from(order);
    }

    // Un même produit envoyé sur deux lignes devient une seule ligne avec la quantité cumulée.
    private static Map<Long, Integer> mergeQuantitiesByProduct(List<CreateOrderRequest.Line> lines) {
        Map<Long, Integer> quantities = lines.stream().collect(Collectors.toMap(
                CreateOrderRequest.Line::productId,
                CreateOrderRequest.Line::quantity,
                Integer::sum,
                LinkedHashMap::new));

        quantities.forEach((productId, quantity) -> {
            if (quantity > MAX_QUANTITY_PER_PRODUCT) {
                throw new InvalidRequestException("La quantité maximale par produit est %d (produit %d)."
                        .formatted(MAX_QUANTITY_PER_PRODUCT, productId));
            }
        });
        return quantities;
    }

    private Map<Long, Product> loadProducts(Map<Long, Integer> quantities) {
        Map<Long, Product> products = productService.findAllByIds(quantities.keySet()).stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));

        quantities.keySet().stream()
                .filter(productId -> !products.containsKey(productId))
                .findFirst()
                .ifPresent(productId -> {
                    throw new InvalidRequestException("Produit introuvable (id = %d).".formatted(productId));
                });
        return products;
    }
}
