package com.example.crudapi.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.crudapi.model.Item;
import com.example.crudapi.repository.ItemRepository;
import java.util.List;
import java.util.Optional;

/**
 * Service layer handling business logic for {@link Item} entities.
 *
 * All write operations are wrapped in a {@link Transactional} annotation to ensure
 * data integrity. The repository is injected via constructor injection, which is
 * the recommended approach for Spring components.
 */
@Service
public class ItemService {

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    /**
     * Persists a new {@link Item}.
     *
     * @param item the item to create; must not be {@code null}
     * @return the persisted item with generated ID
     * @throws IllegalArgumentException if {@code item} is {@code null}
     */
    @Transactional
    public Item createItem(Item item) {
        if (item == null) {
            throw new IllegalArgumentException("Item must not be null");
        }
        return itemRepository.save(item);
    }

    /**
     * Retrieves an {@link Item} by its identifier.
     *
     * @param id the identifier of the item; must not be {@code null}
     * @return an {@link Optional} containing the found item or empty if not present
     * @throws IllegalArgumentException if {@code id} is {@code null}
     */
    public Optional<Item> getItem(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Id must not be null");
        }
        return itemRepository.findById(id);
    }

    /**
     * Retrieves all {@link Item} entities.
     *
     * @return a list of all items; never {@code null}
     */
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    /**
     * Updates an existing {@link Item}.
     *
     * @param id      the identifier of the item to update; must not be {@code null}
     * @param updated the item containing new values; must not be {@code null}
     * @return an {@link Optional} containing the updated item, or empty if the item does not exist
     * @throws IllegalArgumentException if {@code id} or {@code updated} is {@code null}
     */
    @Transactional
    public Optional<Item> updateItem(Long id, Item updated) {
        if (id == null) {
            throw new IllegalArgumentException("Id must not be null");
        }
        if (updated == null) {
            throw new IllegalArgumentException("Updated item must not be null");
        }
        return itemRepository.findById(id)
                .map(existing -> {
                    // Update mutable fields; ID remains unchanged
                    existing.setName(updated.getName());
                    existing.setDescription(updated.getDescription());
                    existing.setPrice(updated.getPrice());
                    return itemRepository.save(existing);
                });
    }
}
