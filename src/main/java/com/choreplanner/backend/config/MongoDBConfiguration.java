package com.choreplanner.backend.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

/**
 * MongoDB Configuration class for connecting to the MongoDB database.
 */
@Configuration
@EnableMongoAuditing
@EnableMongoRepositories(basePackages = "com.choreplanner.backend.repository")
public class MongoDBConfiguration {

    // Update this connection string with your MongoDB cluster details
    private static final String CONNECTION_STRING = "mongodb+srv://Darcy01:Gfac66%402022.@myfirstcluster.xn7cz.mongodb.net/choreplanner";
    private static final String DATABASE_NAME = "choreplanner";

    /**
     * Configures the MongoDB client connection.
     *
     * @return A configured instance of MongoClient.
     */
    @Bean
    public MongoClient mongoClient() {
        ConnectionString connectionString = new ConnectionString(CONNECTION_STRING);
        MongoClientSettings settings = MongoClientSettings.builder()
                .applyConnectionString(connectionString)
                .retryWrites(true) // Enable retryable writes for improved reliability
                .build();
        return MongoClients.create(settings);
    }

    /**
     * Configures the MongoDatabaseFactory with the MongoClient and database name.
     *
     * @return An instance of MongoDatabaseFactory.
     */
    @Bean
    public MongoDatabaseFactory mongoDatabaseFactory() {
        return new SimpleMongoClientDatabaseFactory(mongoClient(), DATABASE_NAME);
    }

    /**
     * Configures the MongoTemplate for performing database operations.
     *
     * @return An instance of MongoTemplate.
     */
    @Bean
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoDatabaseFactory());
    }
}
