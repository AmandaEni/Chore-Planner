package com.choreplanner.backend.controller;

import com.choreplanner.backend.model.Task;
import com.choreplanner.backend.model.User;
import com.choreplanner.backend.service.TaskService;
import com.choreplanner.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5174", allowedHeaders = "*")
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserService userService;

    /**
     * Retrieve all tasks for the currently authenticated user.
     * Ensures that tasks are filtered by the user to prevent unauthorized access.
     *
     * @return ResponseEntity containing a list of tasks, or 401 Unauthorized if the user is not authenticated.
     */
    
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        User authenticatedUser = getAuthenticatedUser();
        if (authenticatedUser != null) {
            List<Task> tasks = taskService.getTasksForUser(authenticatedUser);
            return ResponseEntity.ok(tasks);
        }
        return ResponseEntity.status(401).build(); // Unauthorized if user is not authenticated
    }

    /**
     * Retrieve a specific task by its ID, ensuring it belongs to the authenticated user.
     *
     * @param id The ID of the task to retrieve.
     * @return ResponseEntity containing the task if it exists and belongs to the user, otherwise 404 or 401.
     */
    
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable String id) {
        User authenticatedUser = getAuthenticatedUser();
        if (authenticatedUser != null) {
            Optional<Task> task = taskService.getTaskById(id);
            if (task.isPresent() && task.get().getUser().getId().equals(authenticatedUser.getId())) {
                return ResponseEntity.ok(task.get());
            }
            return ResponseEntity.status(404).build(); // Task not found or does not belong to user
        }
        return ResponseEntity.status(401).build(); // Unauthorized if user is not authenticated
    }

    /**
     * Create a new task for the authenticated user.
     * Automatically associates the task with the currently authenticated user.
     *
     * @param task The task object to be created, received in the request body.
     * @return ResponseEntity containing the created task, or 401 Unauthorized if the user is not authenticated.
     */
    
    @PostMapping
    public ResponseEntity<Task> addTask(@RequestBody Task task) {
        User authenticatedUser = getAuthenticatedUser();
        if (authenticatedUser != null) {
            task.setUser(authenticatedUser); // Associate task with the authenticated user
            Task createdTask = taskService.addTask(task);
            return ResponseEntity.ok(createdTask);
        }
        return ResponseEntity.status(401).build(); // Unauthorized if user is not authenticated
    }

    /**
     * Update an existing task, ensuring it belongs to the authenticated user.
     * Maintains the association of the task with the user.
     *
     * @param id          The ID of the task to update.
     * @param updatedTask The updated task details from the request body.
     * @return ResponseEntity containing the updated task if successful, or 404/401 if not permitted.
     */
    
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable String id, @RequestBody Task updatedTask) {
        User authenticatedUser = getAuthenticatedUser();
        if (authenticatedUser != null) {
            Optional<Task> existingTask = taskService.getTaskById(id);
            if (existingTask.isPresent() && existingTask.get().getUser().getId().equals(authenticatedUser.getId())) {
                updatedTask.setId(id);
                updatedTask.setUser(authenticatedUser); // Maintain association with the authenticated user
                Task savedTask = taskService.updateTask(updatedTask);
                return ResponseEntity.ok(savedTask);
            }
            return ResponseEntity.status(404).build(); // Task not found or does not belong to user
        }
        return ResponseEntity.status(401).build(); // Unauthorized if user is not authenticated
    }

    /**
     * Delete a task by its ID, ensuring it belongs to the authenticated user.
     *
     * @param id The ID of the task to delete.
     * @return ResponseEntity with status 204 if deleted, or 404/401 if not permitted.
     */
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable String id) {
        User authenticatedUser = getAuthenticatedUser();
        if (authenticatedUser != null) {
            Optional<Task> task = taskService.getTaskById(id);
            if (task.isPresent() && task.get().getUser().getId().equals(authenticatedUser.getId())) {
                taskService.deleteTask(id);
                return ResponseEntity.noContent().build(); // Successfully deleted
            }
            return ResponseEntity.status(404).build(); // Task not found or does not belong to user
        }
        return ResponseEntity.status(401).build(); // Unauthorized if user is not authenticated
    }

    /**
     * Helper method to retrieve the authenticated user from the Spring Security Context.
     * Fetches user details based on the currently authenticated user's email.
     *
     * @return The authenticated User object, or null if no user is authenticated.
     */
    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName(); // Username in this context is the user's email
            return userService.findByEmail(email).orElse(null);
        }
        return null; // No user is authenticated
    }
}