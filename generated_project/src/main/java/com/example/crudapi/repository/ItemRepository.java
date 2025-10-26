package com.example.crudapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.crudapi.model.Item;
import java.util.Optional;

/**
 * Spring Data JPA repository for {@link Item} entities.
 *
 * Extends {@link JpaRepository} to provide CRUD operations and pagination/sorting.
 * Additional query methods can be defined here as needed.
 */
@Repository // Optional – Spring will detect interfaces extending JpaRepository automatically
public interface ItemRepository extends JpaRepository<Item, Long> {

    /**
     * Finds an {@link Item} by its name.
     *
     * @param name the name of the item
     * @return an {@link Optional} containing the matching item, or empty if none found
     */
    Optional<Item> findByName(String name);
}
