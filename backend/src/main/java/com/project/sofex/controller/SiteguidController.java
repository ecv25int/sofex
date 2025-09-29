package com.project.sofex.controller;

import com.project.sofex.model.Siteguid;
import com.project.sofex.service.SiteguidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/siteguids")
public class SiteguidController {
    @Autowired
    private SiteguidService siteguidService;

    @GetMapping
    public List<Siteguid> getAll() {
        return siteguidService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Siteguid> getById(@PathVariable Long id) {
        Optional<Siteguid> siteguid = siteguidService.findById(id);
        return siteguid.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Siteguid create(@RequestBody Siteguid siteguid) {
        return siteguidService.save(siteguid);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Siteguid> update(@PathVariable Long id, @RequestBody Siteguid siteguid) {
        if (!siteguidService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        siteguid.setId(id);
        return ResponseEntity.ok(siteguidService.save(siteguid));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!siteguidService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        siteguidService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
