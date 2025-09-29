package com.project.sofex.controller;

import com.project.sofex.model.ProviderType;
import com.project.sofex.service.ProviderTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/provider-types")
public class ProviderTypeController {
    @Autowired
    private ProviderTypeService providerTypeService;

    @GetMapping
    public List<ProviderType> getAll() {
        return providerTypeService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProviderType> getById(@PathVariable Long id) {
        Optional<ProviderType> pt = providerTypeService.findById(id);
        return pt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ProviderType create(@RequestBody ProviderType providerType) {
        return providerTypeService.save(providerType);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProviderType> update(@PathVariable Long id, @RequestBody ProviderType providerType) {
        return providerTypeService.findById(id)
                .map(existing -> {
                    existing.setCode(providerType.getCode());
                    existing.setProviderType(providerType.getProviderType());
                    existing.setActive(providerType.isActive());
                    return ResponseEntity.ok(providerTypeService.save(existing));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!providerTypeService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        providerTypeService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
