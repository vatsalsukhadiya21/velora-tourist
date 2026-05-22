package com.velora.api.exception;

/**
 * Thrown when the client sends an invalid or malformed request.
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
