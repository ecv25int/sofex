package com.project.sofex.service;

import com.project.sofex.model.Sale;
import com.project.sofex.model.SaleItem;
import com.project.sofex.model.Inventory;
import com.project.sofex.repository.SaleRepository;
import com.project.sofex.service.InventoryService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SaleService {
    private final SaleRepository saleRepository;
    private final InventoryService inventoryService;

    public SaleService(SaleRepository saleRepository, InventoryService inventoryService) {
        this.saleRepository = saleRepository;
        this.inventoryService = inventoryService;
    }

    public List<Sale> findAll() {
        return saleRepository.findAll();
    }

    public Optional<Sale> findById(Long id) {
        return saleRepository.findById(id);
    }

    public Sale save(Sale sale) {
        if (sale.getDate() == null) sale.setDate(LocalDateTime.now());
        double total = 0;
        if (sale.getItems() != null) {
            for (SaleItem item : sale.getItems()) {
                item.setSale(sale); // Set the parent sale reference
                total += (item.getPrice() != null ? item.getPrice() : 0) * (item.getQuantity() != null ? item.getQuantity() : 0);
                // Decrement inventory for each sold item
                inventoryService.decrementInventory(item.getProductId(), item.getQuantity());
            }
        }
        sale.setTotal(total);
        return saleRepository.save(sale);
    }
}
