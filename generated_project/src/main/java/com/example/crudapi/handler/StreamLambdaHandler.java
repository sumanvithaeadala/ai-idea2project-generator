package com.example.crudapi.handler;

import java.util.Map;

import org.springframework.cloud.function.adapter.aws.SpringBootRequestHandler;
import com.example.crudapi.CrudApiApplication;

/**
 * AWS Lambda handler that bridges API Gateway events to the Spring MVC application.
 *
 * Extends {@link SpringBootRequestHandler} which bootstraps the Spring context using
 * {@link CrudApiApplication}. The generic types indicate that the handler expects a
 * {@code Map<String, Object>} as the input event (the typical structure of an API
 * Gateway proxy request) and returns a {@code Map<String, Object>} representing the
 * response.
 *
 * No additional code is required; the parent class implements the {@code handleRequest}
 * method that Lambda will invoke. The handler class name and method signature are
 * referenced in the SAM template as:
 *
 * <pre>
 * Handler: com.example.crudapi.handler.StreamLambdaHandler::handleRequest
 * </pre>
 */
public class StreamLambdaHandler extends SpringBootRequestHandler<Map<String, Object>, Map<String, Object>> {
    // Inherit all functionality from SpringBootRequestHandler.
    // The default constructor will initialize the Spring context using CrudApiApplication.
}
