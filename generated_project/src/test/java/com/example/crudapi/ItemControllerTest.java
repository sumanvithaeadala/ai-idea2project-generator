package com.example.crudapi;

import com.example.crudapi.model.Item;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for {@link ItemController} using {@link MockMvc}.
 * The tests run with a full Spring context, hitting the real service and repository layers.
 * Each test is wrapped in a transaction that rolls back after execution to keep the database clean.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ItemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createItem_success() throws Exception {
        Item newItem = new Item(null, "Test Item", "A test description", 9.99);
        mockMvc.perform(post("/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newItem)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name", is("Test Item")))
                .andExpect(jsonPath("$.description", is("A test description")))
                .andExpect(jsonPath("$.price", is(9.99)));
    }

    @Test
    void getItem_found() throws Exception {
        // First, create an item to retrieve later
        Item newItem = new Item(null, "GetItem", "Retrieve this item", 19.99);
        MvcResult createResult = mockMvc.perform(post("/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newItem)))
                .andExpect(status().isCreated())
                .andReturn();
        String createResponse = createResult.getResponse().getContentAsString();
        Item createdItem = objectMapper.readValue(createResponse, Item.class);
        Long id = createdItem.getId();

        mockMvc.perform(get("/items/{id}", id)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(id.intValue())))
                .andExpect(jsonPath("$.name", is("GetItem")))
                .andExpect(jsonPath("$.description", is("Retrieve this item")))
                .andExpect(jsonPath("$.price", is(19.99)));
    }

    @Test
    void getItem_notFound() throws Exception {
        mockMvc.perform(get("/items/{id}", Long.MAX_VALUE)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateItem_success() throws Exception {
        // Create initial item
        Item original = new Item(null, "Original", "Original description", 5.0);
        MvcResult createResult = mockMvc.perform(post("/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(original)))
                .andExpect(status().isCreated())
                .andReturn();
        Item created = objectMapper.readValue(createResult.getResponse().getContentAsString(), Item.class);
        Long id = created.getId();

        // Prepare updated data
        Item updated = new Item(null, "Updated", "Updated description", 15.5);

        mockMvc.perform(put("/items/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(id.intValue())))
                .andExpect(jsonPath("$.name", is("Updated")))
                .andExpect(jsonPath("$.description", is("Updated description")))
                .andExpect(jsonPath("$.price", is(15.5)));
    }
}
