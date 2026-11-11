package com.clubfoot.api.membership;

import java.time.Clock;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clubfoot.api.common.ResourceNotFoundException;

@Service
@Transactional(readOnly = true)
public class MembershipService {

    private static final String RESOURCE_NAME = "Demande d'adhésion";

    private final MembershipRepository membershipRepository;
    private final Clock clock;

    public MembershipService(MembershipRepository membershipRepository, Clock clock) {
        this.membershipRepository = membershipRepository;
        this.clock = clock;
    }

    @Transactional
    public MembershipResponse create(MembershipRequest request) {
        MembershipApplication application = new MembershipApplication(request, clock.instant());
        return MembershipResponse.from(membershipRepository.save(application));
    }

    public List<MembershipResponse> findAll(MembershipStatus status) {
        List<MembershipApplication> applications = status == null
                ? membershipRepository.findAllByOrderByCreatedAtDesc()
                : membershipRepository.findByStatusOrderByCreatedAtDesc(status);
        return applications.stream().map(MembershipResponse::from).toList();
    }

    @Transactional
    public MembershipResponse updateStatus(Long id, MembershipStatus status) {
        MembershipApplication application = membershipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(RESOURCE_NAME, id));
        application.changeStatus(status);
        return MembershipResponse.from(application);
    }
}
