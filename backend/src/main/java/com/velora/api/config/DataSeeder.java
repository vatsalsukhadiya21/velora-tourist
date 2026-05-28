package com.velora.api.config;

import com.velora.api.model.Category;
import com.velora.api.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seeds the database with default categories on application startup
 * if no categories exist.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    private static final List<Category> DEFAULT_CATEGORIES = List.of(
            Category.builder().name("Adventure").slug("adventure").build(),
            Category.builder().name("Nature").slug("nature").build(),
            Category.builder().name("Peaceful").slug("peaceful").build(),
            Category.builder().name("Solo Travel").slug("solo-travel").build(),
            Category.builder().name("Food Experience").slug("food-experience").build(),
            Category.builder().name("Hidden Gems").slug("hidden-gems").build(),
            Category.builder().name("Cultural Experience").slug("cultural-experience").build(),
            Category.builder().name("Nightlife").slug("nightlife").build(),
            Category.builder().name("Spiritual").slug("spiritual").build(),
            Category.builder().name("Budget Travel").slug("budget-travel").build()
    );

    @Override
    public void run(String... args) {
        int created = 0;
        for (Category seed : DEFAULT_CATEGORIES) {
            if (categoryRepository.findBySlug(seed.getSlug()).isEmpty()) {
                categoryRepository.save(seed);
                created++;
            }
        }
        if (created > 0) {
            log.info("Seeded {} default categories", created);
        }
    }
}
