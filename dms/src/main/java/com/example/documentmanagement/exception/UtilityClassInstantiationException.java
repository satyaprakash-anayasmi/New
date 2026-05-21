package com.example.documentmanagement.exception;

public class UtilityClassInstantiationException extends UnsupportedOperationException {
    
    public UtilityClassInstantiationException() {
        super("Utility classes cannot be instantiated.");
    }
}
