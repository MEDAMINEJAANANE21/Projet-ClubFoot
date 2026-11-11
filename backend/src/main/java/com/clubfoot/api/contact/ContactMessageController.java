package com.clubfoot.api.contact;

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
@RequestMapping("/api/contact-messages")
@Tag(name = "Messages de contact")
public class ContactMessageController {

    private final ContactMessageService contactMessageService;

    public ContactMessageController(ContactMessageService contactMessageService) {
        this.contactMessageService = contactMessageService;
    }

    @PostMapping
    @Operation(summary = "Envoie un message à l'équipe du site")
    public ResponseEntity<ContactMessageResponse> create(@Valid @RequestBody ContactMessageRequest request) {
        ContactMessageResponse created = contactMessageService.create(request);
        return ResponseEntity.created(URI.create("/api/contact-messages/" + created.id())).body(created);
    }

    @GetMapping
    @Operation(summary = "Liste les messages reçus (admin)")
    @SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
    public List<ContactMessageResponse> findAll() {
        return contactMessageService.findAll();
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Marque un message comme lu (admin)")
    @SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
    public ContactMessageResponse markAsRead(@PathVariable Long id) {
        return contactMessageService.markAsRead(id);
    }
}
