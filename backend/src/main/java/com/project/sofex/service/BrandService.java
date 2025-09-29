package com.project.sofex.service;

import com.project.sofex.model.Brand;
import com.project.sofex.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.time.Instant;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
public class BrandService {
    @Autowired
    private BrandRepository brandRepository;

    public List<Brand> findAll() {
        return brandRepository.findAll();
    }

    public Optional<Brand> findById(Long id) {
        return brandRepository.findById(id);
    }

    public Brand save(Brand brand) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUser = authentication != null ? authentication.getName() : "system";

        if (brand.getId() == null) {
            // Creating new brand
            brand.setCreatedBy(currentUser);
            brand.setDate(Instant.now());
            brand.setModifiedBy(null);
            brand.setModifiedDate(null);
        } else {
            // Updating existing brand
            Optional<Brand> existingOpt = brandRepository.findById(brand.getId());
            if (existingOpt.isPresent()) {
                Brand existing = existingOpt.get();
                brand.setCreatedBy(existing.getCreatedBy());
                brand.setDate(existing.getDate());
            } else {
                // fallback if not found
                brand.setCreatedBy(currentUser);
                brand.setDate(Instant.now());
            }
            brand.setModifiedBy(currentUser);
            brand.setModifiedDate(Instant.now());
        }
        return brandRepository.save(brand);
    }

    public void deleteById(Long id) {
        brandRepository.deleteById(id);
    }
}
