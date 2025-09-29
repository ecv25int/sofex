package com.project.sofex.controller;

import com.project.sofex.model.ProductImage;
import com.project.sofex.service.ProductImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/product-images")
public class ProductImageController {
    @Autowired
    private ProductImageService productImageService;

    @GetMapping
    public List<ProductImage> getAll() {
        return productImageService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductImage> getById(@PathVariable Long id) {
        Optional<ProductImage> img = productImageService.getById(id);
        return img.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/product/{productId}")
    public List<ProductImage> getByProductId(@PathVariable Long productId) {
        return productImageService.getByProductId(productId);
    }


    // Accept file upload as multipart/form-data and store as blob
    @PostMapping("/upload")
    public ResponseEntity<ProductImage> uploadImage(
        @RequestParam("productId") Long productId,
        @RequestParam("file") MultipartFile file
    ) {
        try {
            ProductImage img = new ProductImage();
            img.setProductId(productId);
            img.setImageUrl(file.getOriginalFilename());
            img.setImageData(file.getBytes());
            ProductImage saved = productImageService.create(img);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productImageService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/blob/{id}")
    public ResponseEntity<byte[]> getImageBlob(@PathVariable Long id) {
        Optional<ProductImage> imgOpt = productImageService.getById(id);
        if (imgOpt.isEmpty() || imgOpt.get().getImageData() == null) {
            return ResponseEntity.notFound().build();
        }
        ProductImage img = imgOpt.get();
        // Try to guess content type from filename
        String contentType = "application/octet-stream";
        String name = img.getImageUrl();
        if (name != null && name.toLowerCase().endsWith(".png")) contentType = "image/png";
        else if (name != null && name.toLowerCase().endsWith(".jpg") || name.toLowerCase().endsWith(".jpeg")) contentType = "image/jpeg";
        else if (name != null && name.toLowerCase().endsWith(".gif")) contentType = "image/gif";
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + img.getImageUrl() + "\"")
            .contentType(MediaType.parseMediaType(contentType))
            .body(img.getImageData());
    }
}
