package com.example.documentmanagement.config;

import com.example.documentmanagement.repository.MasterDetailRepository;
import com.example.documentmanagement.repository.MasterHeaderRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import java.util.Optional;

/**
 * DataInitializer — DISABLED.
 * All seeding and deduplication is now handled by MasterDataSeeder.
 * This class is kept as a stub to avoid import errors in case it's referenced anywhere.
 */
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final MasterHeaderRepository headerRepository;
    private final MasterDetailRepository detailRepository;
    // No longer implements CommandLineRunner — effectively disabled.
}
