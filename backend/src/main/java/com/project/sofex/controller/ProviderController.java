package com.project.sofex.controller;

import com.project.sofex.model.Provider;
import com.project.sofex.service.ProviderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/providers")
public class ProviderController {
    private final ProviderService providerService;

    public ProviderController(ProviderService providerService) {
        this.providerService = providerService;
    }

    @GetMapping
    public List<Provider> getAll() {
        return providerService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Provider> getById(@PathVariable Long id) {
        return providerService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Provider create(@RequestBody Provider provider) {
        return providerService.save(provider);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Provider> update(@PathVariable Long id, @RequestBody Provider provider) {
        if (!providerService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        provider.setId(id);
        return ResponseEntity.ok(providerService.save(provider));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!providerService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        providerService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
