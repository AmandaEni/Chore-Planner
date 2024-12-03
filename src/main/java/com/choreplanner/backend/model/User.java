package com.choreplanner.backend.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Represents a user in the chore planner application.
 * This model is designed for MongoDB integration.
 */
@Document(collection = "users") // Maps this class to the "users" collection in MongoDB
public class User implements Serializable {

    @Id
    private String id; // MongoDB uses String-based ObjectId for document IDs

    @Indexed(unique = true) // Ensures email is unique in the database
    @Field("email")
    private String email;
    
    @Field("password")
    private String password;

    @Field("first_name")
    private String first_name;

    @Field("last_name")
    private String last_name;

    @CreatedDate
    private LocalDateTime createdAt; // Automatically set when the document is created

    @LastModifiedDate
    private LocalDateTime updatedAt; // Automatically updated when the document is modified

    // Default constructor
    public User() {}

    // Constructor for initial user creation
    public User(String email, String password, String first_name, String last_name) {
        this.email = email;
        this.password = password;
        this.first_name = first_name;
        this.last_name = last_name;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return first_name;
    }

    public void setFirstName(String first_name) {
        this.first_name = first_name;
    }

    public String getLastName() {
        return last_name;
    }

    public void setLastName(String last_name) {
        this.last_name = last_name;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Custom Methods for User Management

    /**
     * Validates the password against the provided input.
     * This can be extended with bcrypt or other password hashing mechanisms.
     *
     * @param rawPassword Raw password input to validate.
     * @return True if passwords match, false otherwise.
     */
    public boolean validatePassword(String rawPassword) {
        // Implement password validation logic (e.g., bcrypt comparison)
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.matches(rawPassword, this.password);
    }

    /**
     * Updates the user's profile information.
     * Used for user profile updates through the application.
     *
     * @param first_name Updated first name.
     * @param last_name  Updated last name.
     */
    public void updateProfile(String first_name, String last_name) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.updatedAt = LocalDateTime.now(); // Update timestamp
    }

    // Custom toString for Debugging
    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", email='" + email + '\'' +
                ", first_name='" + first_name + '\'' +
                ", last_name='" + last_name + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}