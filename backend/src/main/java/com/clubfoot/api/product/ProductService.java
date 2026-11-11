package com.clubfoot.api.product;

import java.util.Collection;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clubfoot.api.common.ResourceNotFoundException;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private static final String RESOURCE_NAME = "Produit";

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductResponse> findAll(ProductCategory category) {
        List<Product> products = category == null
                ? productRepository.findAllByOrderByIdAsc()
                : productRepository.findByCategoryOrderByIdAsc(category);
        return products.stream().map(ProductResponse::from).toList();
    }

    public ProductResponse findById(Long id) {
        return ProductResponse.from(getProduct(id));
    }

    public List<Product> findAllByIds(Collection<Long> ids) {
        return productRepository.findAllById(ids);
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Product product = new Product(
                request.name(), request.category(), request.color(),
                request.price(), request.imageUrl(), request.badge());
        return ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = getProduct(id);
        product.update(
                request.name(), request.category(), request.color(),
                request.price(), request.imageUrl(), request.badge());
        return ProductResponse.from(product);
    }

    @Transactional
    public void delete(Long id) {
        productRepository.delete(getProduct(id));
    }

    private Product getProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(RESOURCE_NAME, id));
    }
}
