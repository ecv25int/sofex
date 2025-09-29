package com.project.sofex.service;

import com.project.sofex.model.District;
import com.project.sofex.repository.DistrictRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DistrictService {
    
    @Autowired
    private DistrictRepository districtRepository;
    
    public List<District> getAllDistricts() {
        return districtRepository.findAll();
    }
    
    public List<District> getDistrictsByCantonId(Long cantonId) {
        return districtRepository.findByCantonId(cantonId);
    }
    
    public Optional<District> getDistrictById(Long id) {
        return districtRepository.findById(id);
    }
    
    public District saveDistrict(District district) {
        return districtRepository.save(district);
    }
    
    public void deleteDistrict(Long id) {
        districtRepository.deleteById(id);
    }
}
