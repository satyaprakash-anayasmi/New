package com.example.documentmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        // Automatic JDBC URL conversion for Cloud Environments (Render)
        String dbUrl = System.getenv("RENDER_DB_URL");
        if (dbUrl != null && (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://"))) {
            // Convert to jdbc:postgresql:// and strip embedded credentials
            String jdbcUrl = dbUrl.replaceFirst("postgres(ql)?://", "jdbc:postgresql://")
                    .replaceAll("//.*@", "//");

            // Append SSL mode if not present
            if (!jdbcUrl.contains("sslmode=")) {
                jdbcUrl += (jdbcUrl.contains("?") ? "&" : "?") + "sslmode=require";
            }

            System.setProperty("spring.datasource.url", jdbcUrl);
            System.out.println("Adapted JDBC URL: " + jdbcUrl.split("@")[0] + "@***");
        }

        SpringApplication.run(Application.class, args);
    }
}
