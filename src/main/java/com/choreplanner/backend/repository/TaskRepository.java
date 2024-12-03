package com.choreplanner.backend.repository;

import com.choreplanner.backend.model.Task;
import com.choreplanner.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for managing tasks in the MongoDB database.
 * Extends Spring Data's MongoRepository for CRUD operations and custom queries.
 */
@Repository
public interface TaskRepository extends MongoRepository<Task, String> {

    /**
     * Find all tasks associated with a specific user.
     *
     * @param user The user whose tasks are being retrieved.
     * @return A list of tasks belonging to the given user.
     */
    List<Task> findByUser(User user);

    /**
     * Find tasks for a specific user with a given priority.
     *
     * @param priority The priority level of the tasks (e.g., "High", "Medium", "Low").
     * @param user     The user whose tasks are being retrieved.
     * @return A list of tasks with the specified priority for the given user.
     */
    List<Task> findByPriorityAndUser(String priority, User user);

    /**
     * Find tasks for a specific user by status.
     *
     * @param status The status of the tasks (e.g., "Pending", "Completed").
     * @param user   The user whose tasks are being retrieved.
     * @return A list of tasks with the specified status for the given user.
     */
    List<Task> findByStatusAndUser(String status, User user);

    /**
     * Find tasks for a specific user that are due before a certain deadline.
     *
     * @param user     The user whose tasks are being retrieved.
     * @param deadline The deadline before which the tasks are due.
     * @return A list of tasks due before the specified deadline for the given user.
     */
    List<Task> findByUserAndDeadlineBefore(User user, LocalDateTime deadline);

    /**
     * Find tasks for a specific user between two deadlines (e.g., for a weekly view).
     *
     * @param user  The user whose tasks are being retrieved.
     * @param start The start of the deadline range.
     * @param end   The end of the deadline range.
     * @return A list of tasks with deadlines between the specified range for the given user.
     */
    List<Task> findByUserAndDeadlineBetween(User user, LocalDateTime start, LocalDateTime end);

    /**
     * Find tasks for a specific user and order them by deadline (ascending order).
     *
     * @param user The user whose tasks are being retrieved.
     * @return A list of tasks sorted by deadline in ascending order for the given user.
     */
    List<Task> findByUserOrderByDeadlineAsc(User user);
}