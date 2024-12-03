package com.choreplanner.backend.controller;

import com.choreplanner.backend.model.User;
import com.choreplanner.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5174", allowedHeaders = "*")
@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * Handles user signup requests.
     * Validates input, checks for existing email, securely hashes passwords, and registers new users.
     *
     * @param user User object containing signup data.
     * @return ResponseEntity with a success message and user ID or an error message.
     */

    
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
            // Validate required fields
            if (user.getEmail() == null || user.getPassword() == null || user.getFirstName() == null || user.getLastName() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("All fields are required.");
            }

            // Check if email is already in use
            if (userService.findByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already in use.");
            }

            // Register the user
            User registeredUser = userService.registerUser(user);

            // Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully.");
            response.put("userId", registeredUser.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Handles user login requests.
     * Validates credentials, authenticates users, and generates a session or token upon success.
     *
     * @param credentials Map containing "email" and "password".
     * @return ResponseEntity with an authentication token or an error message.
     */
    @CrossOrigin(origins = "http://localhost:5174", allowedHeaders = "*")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
    try {
        // Step 1: Extract and Validate Input
        String email = credentials.get("email").trim().toLowerCase();
        if (email == null || email.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is required.");
        }
        String password = credentials.get("password");

        // Validate email and password
        if (email == null || email.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is required.");
        }
        if (password == null || password.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password is required.");
        }
        System.out.println("Login attempt for email: " + email);

        // Step 2: Authenticate User
        Optional<User> optionalUser = userService.loginUser(email, password);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
        }

        // Retrieve the authenticated user
        User user = optionalUser.get();

        // Step 3: Generate Token
        String token = userService.generateToken(user);
        System.out.println("Generated Token: " + token); // Debugging purposes

        

        // Step 4: Prepare Success Response
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful.");
        response.put("userId", user.getId());
        response.put("first_name", user.getFirstName());
        response.put("last_name", user.getLastName());
        response.put("email", user.getEmail());
        response.put("token", token);

        // Return the successful login response with user details and token
        return ResponseEntity.ok(response);
        

    } catch (IllegalArgumentException e) {
        // Handle specific known exception
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request data: " + e.getMessage());
    } catch (Exception e) {
        // Step 5: Handle Unexpected Exceptions
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An unexpected error occurred during login: " + e.getMessage());
    }
    }


    /**
     * Retrieves user details based on the user ID.
     * Validates the provided token before returning user details.
     *
     * @param userId ID of the user.
     * @param token  Authorization token provided in the request header.
     * @return ResponseEntity with user details or an error message.
     */
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserDetails(@PathVariable String userId, @RequestHeader("Authorization") String token) {
        try {
            // Validate token
            if (!userService.isValidToken(token, userId)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
            }

            // Retrieve user details
            Optional<User> user = userService.getUserById(userId);
            if (user.isPresent()) {
                return ResponseEntity.ok(user.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
            }

        } catch (Exception e) {
            // Log the error for debugging (optional)
            e.printStackTrace();

            // Return internal server error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving user details: " + e.getMessage());
        }
    }
}
