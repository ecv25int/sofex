package com.project.sofex.controller;

import com.project.sofex.model.Canton;
import com.project.sofex.service.CantonService;
import com.project.sofex.service.ProvinceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cantons")
public class CantonController {

    @Autowired
    private CantonService cantonService;

    @Autowired
    private ProvinceService provinceService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Canton> getAllCantons() {
        return cantonService.getAllCantons();
    }

    @GetMapping("/province/{provinceId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Canton> getCantonsByProvinceId(@PathVariable Long provinceId) {
        return cantonService.getCantonsByProvinceId(provinceId);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Canton> getCantonById(@PathVariable Long id) {
        Optional<Canton> canton = cantonService.getCantonById(id);
        return canton.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Canton> createCanton(@RequestBody Canton cantonRequest) {
        return provinceService.getProvinceById(cantonRequest.getProvince().getId())
                .map(province -> {
                    Canton canton = new Canton();
                    canton.setName(cantonRequest.getName());
                    canton.setProvince(province);
                    return ResponseEntity.ok(cantonService.saveCanton(canton));
                })
                .orElse(ResponseEntity.badRequest().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Canton> updateCanton(@PathVariable Long id, @RequestBody Canton cantonDetails) {
        Optional<Canton> canton = cantonService.getCantonById(id);
        if (canton.isPresent()) {
            Canton existingCanton = canton.get();
            existingCanton.setName(cantonDetails.getName());
            if (cantonDetails.getProvince() != null) {
                return provinceService.getProvinceById(cantonDetails.getProvince().getId())
                        .map(province -> {
                            existingCanton.setProvince(province);
                            return ResponseEntity.ok(cantonService.saveCanton(existingCanton));
                        })
                        .orElse(ResponseEntity.badRequest().build());
            }
            return ResponseEntity.ok(cantonService.saveCanton(existingCanton));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteCanton(@PathVariable Long id) {
        cantonService.deleteCanton(id);
        return ResponseEntity.ok().build();
    }
}
