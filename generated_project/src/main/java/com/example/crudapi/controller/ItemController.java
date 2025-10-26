package com.example.crudapi.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import com.example.crudapi.model.Item;
import com.example.crudapi.service.ItemService;
import java.util.List;
import java.util.Optional;

/**
 * REST controller exposing CRUD operations for {@link Item}.
 *
 * The controller is mapped to {@code /items} and delegates all business logic to
 * {@link ItemService}. Responses are wrapped in {@link ResponseEntity} to allow
 * explicit HTTP status handling.
 */
@RestController
@RequestMapping("/items")
@Validated
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    /**
     * Create a new {@link Item}.
     *
     * @param item the item to create
     * @return the created item with HTTP status 201 (Created)
     */
    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<Item> create(@RequestBody Item item) {
        Item created = itemService.createItem(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Retrieve an {@link Item} by its identifier.
     *
     * @param id the item identifier
     * @return the item if found (200 OK) or 404 Not Found otherwise
     */
    @GetMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<Item> get(@PathVariable Long id) {
        Optional<Item> optItem = itemService.getItem(id);
        return optItem.map(item -> ResponseEntity.ok(item))
                      .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * Update an existing {@link Item}.
     *
     * @param id   the identifier of the item to update
     * @param item the new item data
     * @return the updated item (200 OK) or 404 Not Found if the item does not exist
     */
    @PutMapping(value = "/{id}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Item> update(@PathVariable Long id, @RequestBody Item item) {
        Optional<Item> updated = itemService.updateItem(id, item);
        return updated.map(i -> ResponseEntity.ok(i))
                      .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * List all items.
     *
     * @return list of all {@link Item} objects
     */
    @GetMapping(produces = "application/json")
    public List<Item> listAll() {
        return itemService.getAllItems();
    }
}
