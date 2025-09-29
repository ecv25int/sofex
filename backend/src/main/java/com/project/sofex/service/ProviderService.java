package com.project.sofex.service;

import com.project.sofex.model.Provider;
import com.project.sofex.repository.ProviderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProviderService {
    private final ProviderRepository providerRepository;

    public ProviderService(ProviderRepository providerRepository) {
        this.providerRepository = providerRepository;
    }

    public List<Provider> findAll() {
        return providerRepository.findAll();
    }

    public Optional<Provider> findById(Long id) {
        return providerRepository.findById(id);
    }

    public Provider save(Provider provider) {
        return providerRepository.save(provider);
    }

    public void deleteById(Long id) {
        providerRepository.deleteById(id);
    }
}
