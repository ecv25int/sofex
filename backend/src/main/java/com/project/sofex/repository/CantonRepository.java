package com.project.sofex.repository;

import com.project.sofex.model.Canton;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CantonRepository extends JpaRepository<Canton, Long> {
    List<Canton> findByProvinceId(Long provinceId);
}
