package com.project.sofex.repository;

import com.project.sofex.model.Siteguid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SiteguidRepository extends JpaRepository<Siteguid, Long> {
}
