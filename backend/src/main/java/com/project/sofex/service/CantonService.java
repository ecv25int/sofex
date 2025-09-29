package com.project.sofex.service;

import com.project.sofex.model.Canton;
import com.project.sofex.repository.CantonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CantonService {
    
    @Autowired
    private CantonRepository cantonRepository;
    
    public List<Canton> getAllCantons() {
        return cantonRepository.findAll();
    }
    
    public List<Canton> getCantonsByProvinceId(Long provinceId) {
        return cantonRepository.findByProvinceId(provinceId);
    }
    
    public Optional<Canton> getCantonById(Long id) {
        return cantonRepository.findById(id);
    }
    
    public Canton saveCanton(Canton canton) {
        return cantonRepository.save(canton);
    }
    
    public void deleteCanton(Long id) {
        cantonRepository.deleteById(id);
    }
}
