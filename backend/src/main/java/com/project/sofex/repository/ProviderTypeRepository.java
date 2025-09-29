package com.project.sofex.repository;

import com.project.sofex.model.ProviderType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProviderTypeRepository extends JpaRepository<ProviderType, Long> {
    boolean existsByCode(String code);
}
