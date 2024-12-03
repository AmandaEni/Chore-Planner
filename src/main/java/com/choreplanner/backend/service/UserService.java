package com.choreplanner.backend.service;

import com.choreplanner.backend.model.User;
import com.choreplanner.backend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Secret key for JWT token generation (store securely in environment variables)
    private static final String SECRET_KEY = "your-secret-key";

    // Token expiration time (e.g., 1 day in milliseconds)
    private static final long EXPIRATION_TIME = 86400000L;

    /**
     * Registers a new user by encoding their password and saving their details.
     * @param user The user to register.
     * @return The registered user.
     */
    public User registerUser(User user) {
        // Check if the email is already in use
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already in use.");
        }

        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Save the user to the database
        return userRepository.save(user);
    }

    /**
     * Logs in a user by verifying their credentials.
     * @param email The email of the user.
     * @param password The password of the user.
     * @return An Optional containing the authenticated user if valid, otherwise empty.
     */
    public String generateToken(User user) {
        Claims claims = Jwts.claims().setSubject(user.getEmail());
        claims.put("userId", user.getId());
    
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }
    
    public Optional<User> loginUser(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
    
        if (user.isEmpty()) {
            System.out.println("No user found with email: " + email);
            return Optional.empty();
        }
    
        if (!passwordEncoder.matches(password, user.get().getPassword())) {
            System.out.println("Password mismatch for email: " + email);
            return Optional.empty();
        }
    
        return user;
    }
    

    /**
     * Validates a JWT token by checking its signature, expiration, and user association.
     * @param token The JWT token to validate.
     * @param userId The user ID to match against the token's claims.
     * @return True if the token is valid, otherwise false.
     */
    public boolean isValidToken(String token, String userId) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody();

            String tokenUserId = claims.get("userId").toString();
            return tokenUserId.equals(userId) && claims.getExpiration().after(new Date());
        } catch (Exception e) {
            return false; // Invalid token
        }
    }

    /**
     * Finds a user by their email address.
     * @param email The email to search for.
     * @return An Optional containing the user if found, otherwise empty.
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Retrieves a user by their ID.
     * @param userId The ID of the user to retrieve.
     * @return An Optional containing the user if found, otherwise empty.
     */
    public Optional<User> getUserById(String userId) {
        return userRepository.findById(userId);
    }
}