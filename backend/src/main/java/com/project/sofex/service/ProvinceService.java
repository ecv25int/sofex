package com.project.sofex.service;

import com.project.sofex.model.Province;
import com.project.sofex.repository.ProvinceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProvinceService {
    
    @Autowired
    private ProvinceRepository provinceRepository;
    
    public List<Province> getAllProvinces() {
        return provinceRepository.findAll();
    }
    
    public Optional<Province> getProvinceById(Long id) {
        return provinceRepository.findById(id);
    }
    
    public Province saveProvince(Province province) {
        return provinceRepository.save(province);
    }
    
    public void deleteProvince(Long id) {
        provinceRepository.deleteById(id);
    }
}
