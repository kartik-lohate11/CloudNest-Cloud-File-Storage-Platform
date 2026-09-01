package com.cloud.CloudNest.config;

import com.cloud.CloudNest.security.JwtFilter;
import com.cloud.CloudNest.security.Oauth2SuccessHandler;
import com.cloud.CloudNest.services.impl.CustomUserDetailServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@Slf4j
public class SecurityConfig {

    private final CustomUserDetailServiceImpl userDetailsService;
    private final JwtFilter jwtFilter;
    private final PasswordEncoder passwordEncoder;
    private final Oauth2SuccessHandler oauth2SuccessHandler;

    public SecurityConfig(
            CustomUserDetailServiceImpl userDetailsService,
            JwtFilter jwtFilter,
            PasswordEncoder passwordEncoder,
            @Lazy Oauth2SuccessHandler oauth2SuccessHandler
    ) {
        this.userDetailsService = userDetailsService;
        this.jwtFilter = jwtFilter;
        this.passwordEncoder = passwordEncoder;
        this.oauth2SuccessHandler = oauth2SuccessHandler;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        return http

                .csrf(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(

                                // Public User APIs
                                "/user/api/login",
                                "/user/api/register",
                                "/user/api/verify",
                                "/user/api/create",
                                "/user/api/send-otp",
                                "/user/api/verify-otp",
                                "/user/api/update-password",
                                "/file/api/public/**",
                                "/user/api/health",

                                // OAuth2 endpoints
                                "/oauth2/**",
                                "/login/oauth2/**",

                                "/favicon.ico",
                                "/error",
                                "/css/**",
                                "/js/**",
                                "/images/**"

                        ).permitAll()

                        .anyRequest().authenticated()
                )

                .authenticationProvider(
                        authenticationProvider()
                )

                // JWT Authentication
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                )

                // OAuth2 Authentication
                .oauth2Login(oauth -> oauth

                        .successHandler(
                                oauth2SuccessHandler
                        )

                        .failureHandler(
                                (request, response, exception) -> {
                                    log.error("OAuth2 login failed", exception);
                                    String errorMsg = java.net.URLEncoder.encode(
                                            exception.getMessage() != null ? exception.getMessage() : "OAuth2 authentication failed",
                                            java.nio.charset.StandardCharsets.UTF_8
                                    );
                                    response.sendRedirect("http://localhost:5173/login?error=" + errorMsg);
                                }
                        )
                )

                .build();
    }


    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(
                        userDetailsService
                );

        provider.setPasswordEncoder(
                passwordEncoder
        );

        return provider;
    }


    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration
    ) throws Exception {

        return authenticationConfiguration
                .getAuthenticationManager();
    }
}