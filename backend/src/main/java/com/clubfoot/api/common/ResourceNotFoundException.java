package com.clubfoot.api.common;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resourceName, Long id) {
        super("%s introuvable (id = %d).".formatted(resourceName, id));
    }
}
