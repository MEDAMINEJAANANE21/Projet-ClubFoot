package com.clubfoot.api.order;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<CustomerOrder, Long> {

    // Charge les lignes dans la même requête pour éviter le problème N+1.
    @EntityGraph(attributePaths = "lines")
    List<CustomerOrder> findAllByOrderByCreatedAtDesc();
}
