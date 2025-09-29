package com.project.sofex.controller;

import com.project.sofex.model.License;
import com.project.sofex.service.LicenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/licenses")
public class LicenseController {
    @Autowired
    private LicenseService licenseService;

    @GetMapping
    public List<License> getAll() {
        return licenseService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<License> getById(@PathVariable Long id) {
        Optional<License> license = licenseService.findById(id);
        return license.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public License create(@RequestBody License license) {
        return licenseService.save(license);
    }

    @PutMapping("/{id}")
    public ResponseEntity<License> update(@PathVariable Long id, @RequestBody License license) {
        if (!licenseService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        license.setId(id);
        return ResponseEntity.ok(licenseService.save(license));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!licenseService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        licenseService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
