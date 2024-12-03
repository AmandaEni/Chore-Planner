package com.choreplanner.backend.service;

import com.choreplanner.backend.model.Task;
import com.choreplanner.backend.model.User;
import com.choreplanner.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    /**
     * Adds a new task to the database.
     * @param task The task to add.
     * @return The saved task.
     */
    public Task addTask(Task task) {
        return taskRepository.save(task);
    }

    /**
     * Retrieves a task by its ID.
     * @param id The ID of the task.
     * @return Optional containing the task if found, otherwise empty.
     */
    public Optional<Task> getTaskById(String id) {
        return taskRepository.findById(id);
    }

    /**
     * Updates an existing task.
     * @param task The updated task object.
     * @return The saved task after the update.
     */
    public Task updateTask(Task task) {
        return taskRepository.save(task);
    }

    /**
     * Deletes a task by its ID.
     * @param id The ID of the task to delete.
     */
    public void deleteTask(String id) {
        taskRepository.deleteById(id);
    }

    /**
     * Retrieves all tasks for a specific user.
     * @param user The user whose tasks are to be retrieved.
     * @return A list of tasks belonging to the user.
     */
    public List<Task> getTasksForUser(User user) {
        return taskRepository.findByUser(user);
    }

    /**
     * Retrieves tasks for a specific user with a given priority.
     * @param priority The priority of the tasks.
     * @param user The user who owns the tasks.
     * @return A list of tasks matching the priority for the user.
     */
    public List<Task> getTasksByPriorityForUser(String priority, User user) {
        return taskRepository.findByPriorityAndUser(priority, user);
    }

    /**
     * Retrieves tasks for a specific user with a given status.
     * @param status The status of the tasks.
     * @param user The user who owns the tasks.
     * @return A list of tasks matching the status for the user.
     */
    public List<Task> getTasksByStatusForUser(String status, User user) {
        return taskRepository.findByStatusAndUser(status, user);
    }

    /**
     * Retrieves overdue tasks for a specific user.
     * @param user The user whose overdue tasks are to be retrieved.
     * @param currentDateTime The current date and time for comparison.
     * @return A list of overdue tasks for the user.
     */
    public List<Task> getOverdueTasksForUser(User user, LocalDateTime currentDateTime) {
        return taskRepository.findByUserAndDeadlineBefore(user, currentDateTime);
    }

    /**
     * Retrieves tasks within a specified date range for a specific user.
     * @param user The user who owns the tasks.
     * @param start The start date of the range.
     * @param end The end date of the range.
     * @return A list of tasks within the date range for the user.
     */
    public List<Task> getTasksForUserBetweenDates(User user, LocalDateTime start, LocalDateTime end) {
        return taskRepository.findByUserAndDeadlineBetween(user, start, end);
    }

    /**
     * Retrieves tasks for a specific user ordered by deadline.
     * @param user The user whose tasks are to be retrieved.
     * @return A list of tasks ordered by deadline for the user.
     */
    public List<Task> getTasksForUserOrderedByDeadline(User user) {
        return taskRepository.findByUserOrderByDeadlineAsc(user);
    }

    /**
     * Adds a new task for a specific user.
     * @param task The task to add.
     * @param user The user who owns the task.
     * @return The saved task associated with the user.
     */
    public Task addTaskForUser(Task task, User user) {
        task.setUser(user); // Associate task with the user
        return taskRepository.save(task);
    }

    /**
     * Retrieves a task by its ID, ensuring it belongs to the specified user.
     * @param id The ID of the task.
     * @param user The user who owns the task.
     * @return Optional containing the task if found and belongs to the user, otherwise empty.
     */
    public Optional<Task> getTaskByIdAndUser(String id, User user) {
        Optional<Task> task = taskRepository.findById(id);
        if (task.isPresent() && task.get().getUser().equals(user)) {
            return task;
        }
        return Optional.empty();
    }

    /**
     * Updates an existing task for a specific user, ensuring it belongs to the user.
     * @param task The updated task object.
     * @param user The user who owns the task.
     * @return Optional containing the updated task if successful, otherwise empty.
     */
    public Optional<Task> updateTaskForUser(Task task, User user) {
        Optional<Task> existingTask = taskRepository.findById(task.getId());
        if (existingTask.isPresent() && existingTask.get().getUser().equals(user)) {
            task.setUser(user); // Maintain association with the user
            return Optional.of(taskRepository.save(task));
        }
        return Optional.empty();
    }

    /**
     * Deletes a task by its ID, ensuring it belongs to the specified user.
     * @param id The ID of the task.
     * @param user The user who owns the task.
     * @return True if the deletion was successful, otherwise false.
     */
    public boolean deleteTaskForUser(String id, User user) {
        Optional<Task> task = taskRepository.findById(id);
        if (task.isPresent() && task.get().getUser().equals(user)) {
            taskRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
