package com.choreplanner.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Represents a task in the chore planner application.
 * This model is designed to store task information in a MongoDB collection.
 */
@Document(collection = "tasks") // Maps this class to the "tasks" collection in MongoDB
public class Task {

    @Id
    private String id; // MongoDB uses String-based ObjectId for document IDs

    private String name; // Name of the task
    private String description; // Detailed description of the task
    private String priority; // Priority level (e.g., High, Medium, Low)
    private LocalDateTime deadline; // Task deadline
    private String status; // Current status (e.g., Pending, In Progress, Completed)

    // Many-to-One relationship to associate each task with a specific user
    @DBRef // Creates a reference to a User document in the "users" collection
    private User user;

    // Default Constructor
    public Task() {}

    // Parameterized Constructor
    public Task(String name, String description, String priority, LocalDateTime deadline, String status, User user) {
        this.name = name;
        this.description = description;
        this.priority = priority;
        this.deadline = deadline;
        this.status = status;
        this.user = user;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // Task Management Methods

    /**
     * Updates the status of the task.
     *
     * @param newStatus New status for the task (e.g., Pending, Completed).
     */
    public void updateStatus(String newStatus) {
        this.status = newStatus;
    }

    /**
     * Updates the priority level of the task.
     *
     * @param newPriority New priority level (e.g., High, Medium, Low).
     */
    public void updatePriority(String newPriority) {
        this.priority = newPriority;
    }

    /**
     * Updates or extends the deadline for the task.
     *
     * @param newDeadline New deadline for the task.
     */
    public void updateDeadline(LocalDateTime newDeadline) {
        this.deadline = newDeadline;
    }

    // Custom toString for Debugging
    @Override
    public String toString() {
        return "Task{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", priority='" + priority + '\'' +
                ", deadline=" + deadline +
                ", status='" + status + '\'' +
                ", user=" + (user != null ? user.getId() : null) +
                '}';
    }
}