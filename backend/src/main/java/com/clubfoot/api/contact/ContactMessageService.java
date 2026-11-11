package com.clubfoot.api.contact;

import java.time.Clock;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clubfoot.api.common.ResourceNotFoundException;

@Service
@Transactional(readOnly = true)
public class ContactMessageService {

    private static final String RESOURCE_NAME = "Message";

    private final ContactMessageRepository contactMessageRepository;
    private final Clock clock;

    public ContactMessageService(ContactMessageRepository contactMessageRepository, Clock clock) {
        this.contactMessageRepository = contactMessageRepository;
        this.clock = clock;
    }

    @Transactional
    public ContactMessageResponse create(ContactMessageRequest request) {
        ContactMessage contactMessage = new ContactMessage(
                request.name(), request.email(), request.subject(), request.message(), clock.instant());
        return ContactMessageResponse.from(contactMessageRepository.save(contactMessage));
    }

    public List<ContactMessageResponse> findAll() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(ContactMessageResponse::from)
                .toList();
    }

    @Transactional
    public ContactMessageResponse markAsRead(Long id) {
        ContactMessage contactMessage = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(RESOURCE_NAME, id));
        contactMessage.markAsRead();
        return ContactMessageResponse.from(contactMessage);
    }
}
