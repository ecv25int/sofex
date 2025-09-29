package com.project.sofex.controller;

import com.project.sofex.model.Currency;
import com.project.sofex.service.CurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/currencies")
public class CurrencyController {
    @Autowired
    private CurrencyService currencyService;

    @GetMapping
    public List<Currency> getAll() {
        return currencyService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Currency> getById(@PathVariable Long id) {
        Optional<Currency> currency = currencyService.findById(id);
        return currency.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Currency create(@RequestBody Currency currency) {
        return currencyService.save(currency);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Currency> update(@PathVariable Long id, @RequestBody Currency currency) {
        if (!currencyService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        currency.setId(id);
        return ResponseEntity.ok(currencyService.save(currency));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!currencyService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        currencyService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
