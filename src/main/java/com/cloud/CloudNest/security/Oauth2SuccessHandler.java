package com.cloud.CloudNest.security;

import com.cloud.CloudNest.dto.UserDto;
import com.cloud.CloudNest.dto.response.AuthResponse;
import com.cloud.CloudNest.entities.UserData;
import com.cloud.CloudNest.repository.UserDataRepository;
import com.cloud.CloudNest.services.UserService;
import com.cloud.CloudNest.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class Oauth2SuccessHandler
        implements AuthenticationSuccessHandler {

    private final UserDataRepository userDataRepository;

    private final UserService userService;

    private final ObjectMapper objectMapper;

    @Value("${ui.frontend.uri}")
    private String frontedUrl;


    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {
        try {
            // Convert Authentication
            OAuth2AuthenticationToken authenticationToken =
                    (OAuth2AuthenticationToken) authentication;

            // Get OAuth user
            OAuth2User oauthUser = authenticationToken.getPrincipal();

            // Get provider
            String providerType = authenticationToken
                    .getAuthorizedClientRegistrationId()
                    .toLowerCase();

            // Get provider unique ID
            String providerId = determineProviderId(oauthUser, providerType);

            // Get email
            String email = getEmail(oauthUser, providerType);

            log.info("OAuth login successful | provider={} | email={}", providerType, email);

            // Find / Create user
            UserData userData = processOAuthUser(email, providerType, providerId);

            // Generate JWT
            String jwtToken = JwtUtil.getToken(userData.getUserName() != null ? userData.getUserName() : email);

            // Redirect to frontend React OAuth callback route with JWT token
            String redirectUrl = frontedUrl + "oauth/callback?token=" + jwtToken;
            response.sendRedirect(redirectUrl);
        } catch (Exception ex) {
            log.error("Error during OAuth authentication success processing", ex);
            String errorMsg = java.net.URLEncoder.encode(
                    ex.getMessage() != null ? ex.getMessage() : "OAuth authentication failed",
                    java.nio.charset.StandardCharsets.UTF_8
            );
            response.sendRedirect(frontedUrl + "login?error=" + errorMsg);
        }
    }


    /**
     * Find existing OAuth user or create new user.
     */
    private UserData processOAuthUser(
            String email,
            String providerType,
            String providerId
    ) {

        // Search by OAuth provider
        UserData userByProvider =
                userDataRepository
                        .findByProvideTypeAndProvideId(
                                providerType,
                                providerId
                        )
                        .orElse(null);

        // Search by email
        UserData userByEmail =
                userDataRepository
                        .findByMail(email);


        // Case 1: Completely new user
        if (userByProvider == null && userByEmail == null) {

            return registerNewOAuthUser(
                    email,
                    providerType,
                    providerId
            );
        }


        // Case 2: User already logged in with same provider
        if (userByProvider != null) {

            return updateOAuthUserIfRequired(
                    userByProvider,
                    email
            );
        }


        // Case 3: Email exists -> Link OAuth provider to existing user
        if (userByEmail != null) {
            if (userByEmail.getProvideType() == null || userByEmail.getProvideType().isBlank()) {
                userByEmail.setProvideType(providerType);
                userByEmail.setProvideId(providerId);
                return userDataRepository.save(userByEmail);
            }
            return userByEmail;
        }

        return registerNewOAuthUser(email, providerType, providerId);
    }


    /**
     * Register new OAuth user.
     */
    private UserData registerNewOAuthUser(
            String email,
            String providerType,
            String providerId
    ) {

        log.info(
                "Creating new OAuth user | email={} | provider={}",
                email,
                providerType
        );

        UserData userData =
                new UserData();

        userData.setUserName(email);

        userData.setMail(email);

        userData.setProvideType(providerType);

        userData.setProvideId(providerId);

        /*
         * Your service should save and return UserData
         */

        return userService.registerUserByAuth(UserDto.toDto(userData)).toEntity();
    }


    /**
     * Update OAuth user if required.
     */
    private UserData updateOAuthUserIfRequired(
            UserData userData,
            String email
    ) {

        if (!email.equals(userData.getMail())) {

            log.info(
                    "Updating OAuth user email | old={} | new={}",
                    userData.getMail(),
                    email
            );

            userData.setMail(email);

            userData.setUserName(email);

            return userService.registerUserByAuth(
                    UserDto.toDto(userData)
            ).toEntity();
        }

        return userData;
    }


    /**
     * Extract email from OAuth provider.
     */
    private String getEmail(
            OAuth2User oauthUser,
            String providerType
    ) {

        String email =
                oauthUser.getAttribute("email") != null ? oauthUser.getAttribute("email") : oauthUser.getAttribute("login");

        if (email != null && !email.isBlank()) {
            return email;
        }

        throw new IllegalArgumentException(
                "Email not provided by OAuth provider: "
                        + providerType
        );
    }


    /**
     * Extract unique provider ID.
     */
    private String determineProviderId(
            OAuth2User oauthUser,
            String providerType
    ) {

        return switch (providerType) {

            case "google" -> {

                String sub =
                        oauthUser.getAttribute("sub");

                if (sub == null) {
                    throw new IllegalArgumentException(
                            "Google provider ID not found"
                    );
                }

                yield sub;
            }

            case "github" -> {

                Object id =
                        oauthUser.getAttribute("id");

                if (id == null) {
                    throw new IllegalArgumentException(
                            "GitHub provider ID not found"
                    );
                }

                yield id.toString();
            }

            default -> throw new IllegalArgumentException(
                    "Unsupported OAuth provider: "
                            + providerType
            );
        };
    }


    /**
     * Write JSON response.
     */
    private void writeResponse(
            HttpServletResponse response,
            AuthResponse authResponse
    ) throws IOException {

        response.setStatus(
                HttpStatus.OK.value()
        );

        response.setContentType(
                MediaType.APPLICATION_JSON_VALUE
        );

        response.setCharacterEncoding(
                "UTF-8"
        );

        objectMapper.writeValue(
                response.getOutputStream(),
                authResponse
        );
    }
}