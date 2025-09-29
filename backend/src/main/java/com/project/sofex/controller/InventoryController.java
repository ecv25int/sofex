package com.project.sofex.controller;

import com.project.sofex.model.Inventory;
import com.project.sofex.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/inventories")
public class InventoryController {
    
    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public List<Inventory> getAll() {
        return inventoryService.getAllInventories();
    }

    @GetMapping("/last5")
    public List<Inventory> getLast5() {
        return inventoryService.getLast5Inventories();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inventory> getOne(@PathVariable Long id) {
        Optional<Inventory> inventory = inventoryService.getInventory(id);
        return inventory.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Inventory create(@RequestBody Inventory inventory) {
        return inventoryService.createInventory(inventory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inventory> update(@PathVariable Long id, @RequestBody Inventory inventory) {
        Inventory updated = inventoryService.updateInventory(id, inventory);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        inventoryService.deleteInventory(id);
        return ResponseEntity.noContent().build();
    }

}
