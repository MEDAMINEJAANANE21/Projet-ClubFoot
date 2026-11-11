package com.clubfoot.api.membership;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MembershipRepository extends JpaRepository<MembershipApplication, Long> {

    @EntityGraph(attributePaths = "documents")
    List<MembershipApplication> findAllByOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = "documents")
    List<MembershipApplication> findByStatusOrderByCreatedAtDesc(MembershipStatus status);
}
