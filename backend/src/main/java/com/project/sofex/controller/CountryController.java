package com.project.sofex.controller;

import com.project.sofex.model.Country;
import com.project.sofex.service.CountryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/countries")
public class CountryController {
    @Autowired
    private CountryService countryService;

    @GetMapping
    public List<Country> getAll() {
        return countryService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Country> getById(@PathVariable Long id) {
        Optional<Country> country = countryService.findById(id);
        return country.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Country create(@RequestBody Country country) {
        return countryService.save(country);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Country> update(@PathVariable Long id, @RequestBody Country country) {
        if (!countryService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        country.setId(id);
        return ResponseEntity.ok(countryService.save(country));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!countryService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        countryService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
