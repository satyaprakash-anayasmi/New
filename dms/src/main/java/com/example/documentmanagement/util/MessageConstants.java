package com.example.documentmanagement.util;

import com.example.documentmanagement.exception.UtilityClassInstantiationException;

public final class MessageConstants {

    private MessageConstants() {
        throw new UtilityClassInstantiationException();
    }

    public static final String DOCUMENT_UPLOAD_SUCCESS = "msg.document.upload.success";
    public static final String UNAUTHORIZED_ACCESS = "msg.unauthorized.access";
    public static final String VALIDATION_ERROR = "msg.validation.error";
    public static final String DOCUMENT_NOT_FOUND = "msg.document.not.found";
    public static final String USER_NOT_FOUND = "msg.user.not.found";
    public static final String LOGIN_SUCCESS = "msg.login.success";
    public static final String DOCUMENT_RETRIEVED_SUCCESS = "msg.document.retrieved.success";
    public static final String DOCUMENTS_RETRIEVED_SUCCESS = "msg.documents.retrieved.success";
    public static final String REVIEWER_ASSIGNED_SUCCESS = "msg.reviewer.assigned.success";
    public static final String DOCUMENT_REVIEWED_SUCCESS = "msg.document.reviewed.success";
    public static final String ERROR_UNEXPECTED = "msg.error.unexpected";
    public static final String ERROR_BAD_CREDENTIALS = "msg.error.bad.credentials";
    public static final String ERROR_FILE_EMPTY = "msg.error.file.empty";
    public static final String ERROR_NOT_IN_REVIEW = "msg.error.not.in.review";
}
