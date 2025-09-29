package com.project.sofex.service;

import com.project.sofex.model.Inventory;
import com.project.sofex.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {
    @Autowired
    private InventoryRepository inventoryRepository;

    public List<Inventory> getAllInventories() {
        return inventoryRepository.findAll();
    }

    public List<Inventory> getLast5Inventories() {
        return inventoryRepository.findTop5ByOrderByDateDesc();
    }

    public Optional<Inventory> getInventory(Long id) {
        return inventoryRepository.findById(id);
    }

    public Inventory createInventory(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    public Inventory updateInventory(Long id, Inventory inventory) {
        if (!inventoryRepository.existsById(id)) {
            throw new IllegalArgumentException("Inventory with given ID does not exist");
        }
        inventory.setId(id);
        return inventoryRepository.save(inventory);
    }

    public void deleteInventory(Long id) {
        inventoryRepository.deleteById(id);
    }

    // Decrement inventory for a product by quantity (across all warehouses, prioritizing by date ascending)
    public void decrementInventory(Long productId, Integer quantityToDecrement) {
        if (productId == null || quantityToDecrement == null || quantityToDecrement <= 0) return;
        List<Inventory> inventories = inventoryRepository.findAll();
        // Filter for product and sort by date (FIFO)
        inventories = inventories.stream()
            .filter(inv -> productId.equals(inv.getIdProduct()) && inv.getQuantity() > 0)
            .sorted((a, b) -> a.getDate().compareTo(b.getDate()))
            .toList();
        int remaining = quantityToDecrement;
        for (Inventory inv : inventories) {
            if (remaining <= 0) break;
            int available = inv.getQuantity();
            int toDeduct = Math.min(available, remaining);
            inv.setQuantity(available - toDeduct);
            inventoryRepository.save(inv);
            remaining -= toDeduct;
        }
        if (remaining > 0) {
            throw new IllegalArgumentException("Not enough inventory for product ID: " + productId);
        }
    }
}
// ...existing code...
