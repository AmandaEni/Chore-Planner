package com.choreplanner.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class AppConfig {

    /**
     * Bean for password encoding using the BCrypt hashing algorithm.
     * This ensures secure storage of user passwords in the database.
     *
     * @return PasswordEncoder configured with BCrypt hashing.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configures CORS (Cross-Origin Resource Sharing) settings.
     * Allows front-end applications to interact with the back-end API securely.
     *
     * @return CorsConfigurationSource that defines allowed origins, headers, and methods.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5174")); // Allowed frontend origins
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allowed HTTP methods
        configuration.setAllowCredentials(true);
        configuration.addAllowedHeader("*"); // Allow all headers

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Apply configuration to all endpoints
        return source;
    }


    /**
     * Configures application-level security settings.
     * Secures endpoints and defines which ones require authentication.
     *
     * @param http HttpSecurity object used for configuring security.
     * @return SecurityFilterChain defining application security rules.
     * @throws Exception if an error occurs during security configuration.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable() // Disable CSRF for API development (consider enabling it in production)
            .cors().and()
            .authorizeRequests()
            .antMatchers("/api/auth/signup", "/api/auth/login").permitAll() // Publicly accessible endpoints
            .anyRequest().authenticated(); // All other endpoints require authentication
            

        return http.build();
    }
}