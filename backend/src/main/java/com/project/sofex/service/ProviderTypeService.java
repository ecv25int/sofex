package com.project.sofex.service;

import com.project.sofex.model.ProviderType;
import com.project.sofex.repository.ProviderTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProviderTypeService {
    @Autowired
    private ProviderTypeRepository providerTypeRepository;

    public List<ProviderType> findAll() {
        return providerTypeRepository.findAll();
    }

    public Optional<ProviderType> findById(Long id) {
        return providerTypeRepository.findById(id);
    }

    public ProviderType save(ProviderType providerType) {
        return providerTypeRepository.save(providerType);
    }

    public void deleteById(Long id) {
        providerTypeRepository.deleteById(id);
    }
}
