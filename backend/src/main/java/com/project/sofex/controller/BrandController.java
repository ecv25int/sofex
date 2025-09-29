package com.project.sofex.controller;

import com.project.sofex.model.Brand;
import com.project.sofex.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/brands")
public class BrandController {
    @Autowired
    private BrandService brandService;

    @GetMapping
    public List<Brand> getAll() {
        return brandService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Brand> getById(@PathVariable Long id) {
        Optional<Brand> brand = brandService.findById(id);
        return brand.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Brand create(@RequestBody Brand brand) {
        return brandService.save(brand);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Brand> update(@PathVariable Long id, @RequestBody Brand brand) {
        if (!brandService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        brand.setId(id);
        return ResponseEntity.ok(brandService.save(brand));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!brandService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        brandService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
