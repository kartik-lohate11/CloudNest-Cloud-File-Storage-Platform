package com.cloud.CloudNest.exception;

import com.cloud.CloudNest.dto.response.ApiErrorMessage;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ControllerAdvice
public class ExceptionController extends ResponseEntityExceptionHandler {

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  HttpHeaders headers,
                                                                  HttpStatusCode status,
                                                                  WebRequest request) {

        Map<String, String> errorMap = new HashMap<>();
        List<ObjectError> errorList = ex.getBindingResult().getAllErrors();
        Integer count = ex.getBindingResult().getFieldErrorCount();
        errorMap.put("Error Count", String.valueOf(count));

        errorList.forEach(
                (i) -> {
                    errorMap.put(
                            ((FieldError) i).getField(),
                            i.getDefaultMessage()
                    );
                });

        return new ResponseEntity<>(errorMap, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<?> handleUserNotFoundException(UserNotFoundException exception) {
        ApiErrorMessage errorMessage = new ApiErrorMessage(
                exception.getMessage(),
                HttpStatus.NOT_FOUND.name()
        );
        return ResponseEntity.status(404).body(errorMessage);
    }

    @ExceptionHandler(FileUploadingException.class)
    public ResponseEntity<?> handleFileException(FileUploadingException exception) {
        ApiErrorMessage errorMessage = new ApiErrorMessage(
                exception.getMessage(),
                HttpStatus.BAD_REQUEST.name()
        );
        return ResponseEntity.status(403).body(errorMessage);
    }

    @ExceptionHandler(FileNotFoundException.class)
    public ResponseEntity<?> handleFileNotFoundException(FileNotFoundException exception) {
        ApiErrorMessage errorMessage = new ApiErrorMessage(
                exception.getMessage(),
                HttpStatus.BAD_REQUEST.name()
        );
        return ResponseEntity.status(404).body(errorMessage);
    }

    @ExceptionHandler(UserAllReadyExistsException.class)
    public ResponseEntity<?> handleUserAllReadyExistsException(UserAllReadyExistsException exception) {
        ApiErrorMessage errorMessage = new ApiErrorMessage(
                exception.getMessage(),
                HttpStatus.BAD_REQUEST.name()
        );
        return ResponseEntity.status(409).body(errorMessage);
    }

    @ExceptionHandler(UserInvalidInputException.class)
    public ResponseEntity<?> handleUserAllReadyExistsException(UserInvalidInputException exception) {
        ApiErrorMessage errorMessage = new ApiErrorMessage(
                exception.getMessage(),
                HttpStatus.BAD_REQUEST.name()
        );
        return ResponseEntity.status(500).body(errorMessage);
    }

    @ExceptionHandler(StorageLimitExceededException.class)
    public ResponseEntity<?> handleStorageLimitExceededException(StorageLimitExceededException exception) {
        ApiErrorMessage errorMessage = new ApiErrorMessage(
                exception.getMessage(),
                HttpStatus.BAD_REQUEST.name()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
    }
}