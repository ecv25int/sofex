package com.project.sofex.service;

import com.project.sofex.model.ProductImage;
import com.project.sofex.repository.ProductImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductImageService {
    @Autowired
    private ProductImageRepository productImageRepository;

    public List<ProductImage> getAll() {
        return productImageRepository.findAll();
    }

    public Optional<ProductImage> getById(Long id) {
        return productImageRepository.findById(id);
    }

    public List<ProductImage> getByProductId(Long productId) {
        return productImageRepository.findByProductId(productId);
    }

    public ProductImage create(ProductImage productImage) {
        return productImageRepository.save(productImage);
    }

    public void delete(Long id) {
        productImageRepository.deleteById(id);
    }
}
