package com.clubfoot.api.membership;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clubfoot.api.config.OpenApiConfig;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/memberships")
@Tag(name = "Adhésions")
public class MembershipController {

    private final MembershipService membershipService;

    public MembershipController(MembershipService membershipService) {
        this.membershipService = membershipService;
    }

    @PostMapping
    @Operation(summary = "Envoie une demande d'adhésion")
    public ResponseEntity<MembershipResponse> create(@Valid @RequestBody MembershipRequest request) {
        MembershipResponse created = membershipService.create(request);
        return ResponseEntity.created(URI.create("/api/memberships/" + created.id())).body(created);
    }

    @GetMapping
    @Operation(summary = "Liste les demandes d'adhésion, avec un filtre optionnel par statut (admin)")
    @SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
    public List<MembershipResponse> findAll(@RequestParam(required = false) MembershipStatus status) {
        return membershipService.findAll(status);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Accepte ou refuse une demande d'adhésion (admin)")
    @SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
    public MembershipResponse updateStatus(@PathVariable Long id, @Valid @RequestBody MembershipStatusUpdate update) {
        return membershipService.updateStatus(id, update.status());
    }
}
