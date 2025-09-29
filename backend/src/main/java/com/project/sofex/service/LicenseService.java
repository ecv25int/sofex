package com.project.sofex.service;

import com.project.sofex.model.License;
import com.project.sofex.repository.LicenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LicenseService {
    @Autowired
    private LicenseRepository licenseRepository;

    public List<License> findAll() {
        return licenseRepository.findAll();
    }

    public Optional<License> findById(Long id) {
        return licenseRepository.findById(id);
    }

    public License save(License license) {
        return licenseRepository.save(license);
    }

    public void deleteById(Long id) {
        licenseRepository.deleteById(id);
    }
}
