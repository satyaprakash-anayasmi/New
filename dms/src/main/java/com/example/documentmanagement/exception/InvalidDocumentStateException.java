package com.example.documentmanagement.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidDocumentStateException extends RuntimeException {
    
    public InvalidDocumentStateException(String message) {
        super(message);
    }

    public InvalidDocumentStateException(String message, Throwable cause) {
        super(message, cause);
    }
}
