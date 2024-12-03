package com.choreplanner.backend.repository;

import com.choreplanner.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.lang.NonNull;

import java.util.Optional;

/**
 * Repository interface for managing users in the MongoDB database.
 * Extends Spring Data's MongoRepository for CRUD operations and custom queries.
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {

    /**
     * Find user by email.
     *
     * @param email The email address of the user to retrieve.
     * @return An Optional containing the User if found, or empty otherwise.
     */
    @NonNull
    Optional<User> findByEmail(@NonNull String email);

    /**
     * Check if a user with the given email exists.
     *
     * @param email The email address to check.
     * @return True if a user with the given email exists, otherwise false.
     */
    boolean existsByEmail(@NonNull String email);

    /**
     * Find user by email and password.
     * Note: Password verification should ideally happen after retrieval using a hashed password.
     *
     * @param email    The email address of the user.
     * @param password The password of the user.
     * @return An Optional containing the User if found, or empty otherwise.
     */
    @NonNull
    Optional<User> findByEmailAndPassword(@NonNull String email, @NonNull String password);

    /**
     * Retrieve user by ID.
     *
     * @param id The ID of the user to retrieve.
     * @return An Optional containing the User if found, or empty otherwise.
     */
    @NonNull
    Optional<User> findById(@NonNull String id);
}