package com.project.sofex.controller;

import com.project.sofex.model.Province;
import com.project.sofex.service.ProvinceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/provinces")
public class ProvinceController {

    @Autowired
    private ProvinceService provinceService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Province> getAllProvinces() {
        return provinceService.getAllProvinces();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Province> getProvinceById(@PathVariable Long id) {
        Optional<Province> province = provinceService.getProvinceById(id);
        return province.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public Province createProvince(@RequestBody Province province) {
        return provinceService.saveProvince(province);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Province> updateProvince(@PathVariable Long id, @RequestBody Province provinceDetails) {
        Optional<Province> province = provinceService.getProvinceById(id);
        if (province.isPresent()) {
            Province existingProvince = province.get();
            existingProvince.setName(provinceDetails.getName());
            return ResponseEntity.ok(provinceService.saveProvince(existingProvince));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteProvince(@PathVariable Long id) {
        provinceService.deleteProvince(id);
        return ResponseEntity.ok().build();
    }
}
