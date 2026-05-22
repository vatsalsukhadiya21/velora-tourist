package com.velora.api.exception;

/**
 * Thrown when an authentication or authorization check fails.
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }
}
