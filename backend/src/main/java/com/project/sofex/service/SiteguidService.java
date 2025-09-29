package com.project.sofex.service;

import com.project.sofex.model.Siteguid;
import com.project.sofex.repository.SiteguidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SiteguidService {
    @Autowired
    private SiteguidRepository siteguidRepository;

    public List<Siteguid> findAll() {
        return siteguidRepository.findAll();
    }

    public Optional<Siteguid> findById(Long id) {
        return siteguidRepository.findById(id);
    }

    public Siteguid save(Siteguid siteguid) {
        return siteguidRepository.save(siteguid);
    }

    public void deleteById(Long id) {
        siteguidRepository.deleteById(id);
    }
}
