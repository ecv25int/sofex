package com.project.sofex.controller;

import com.project.sofex.model.District;
import com.project.sofex.service.DistrictService;
import com.project.sofex.service.CantonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/districts")
public class DistrictController {

    @Autowired
    private DistrictService districtService;

    @Autowired
    private CantonService cantonService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<District> getAllDistricts() {
        return districtService.getAllDistricts();
    }

    @GetMapping("/canton/{cantonId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<District> getDistrictsByCantonId(@PathVariable Long cantonId) {
        return districtService.getDistrictsByCantonId(cantonId);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<District> getDistrictById(@PathVariable Long id) {
        Optional<District> district = districtService.getDistrictById(id);
        return district.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<District> createDistrict(@RequestBody District districtRequest) {
        return cantonService.getCantonById(districtRequest.getCanton().getId())
                .map(canton -> {
                    District district = new District();
                    district.setName(districtRequest.getName());
                    district.setCanton(canton);
                    return ResponseEntity.ok(districtService.saveDistrict(district));
                })
                .orElse(ResponseEntity.badRequest().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<District> updateDistrict(@PathVariable Long id, @RequestBody District districtDetails) {
        Optional<District> district = districtService.getDistrictById(id);
        if (district.isPresent()) {
            District existingDistrict = district.get();
            existingDistrict.setName(districtDetails.getName());
            if (districtDetails.getCanton() != null) {
                return cantonService.getCantonById(districtDetails.getCanton().getId())
                        .map(canton -> {
                            existingDistrict.setCanton(canton);
                            return ResponseEntity.ok(districtService.saveDistrict(existingDistrict));
                        })
                        .orElse(ResponseEntity.badRequest().build());
            }
            return ResponseEntity.ok(districtService.saveDistrict(existingDistrict));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteDistrict(@PathVariable Long id) {
        districtService.deleteDistrict(id);
        return ResponseEntity.ok().build();
    }
}
