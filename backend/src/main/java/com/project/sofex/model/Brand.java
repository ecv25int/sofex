package com.project.sofex.model;

import jakarta.persistence.*;
import java.time.Instant;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "brand")
public class Brand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Boolean state;

    @Column(nullable = false)
    private String createdBy;

    @Column(nullable = false)
    private Instant date;

    @Column
    private Instant modifiedDate;

    @Column
    private String modifiedBy;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Boolean getState() { return state; }
    public void setState(Boolean state) { this.state = state; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public Instant getDate() { return date; }
    public void setDate(Instant date) { this.date = date; }

    public Instant getModifiedDate() { return modifiedDate; }
    public void setModifiedDate(Instant modifiedDate) { this.modifiedDate = modifiedDate; }

    public String getModifiedBy() { return modifiedBy; }
    public void setModifiedBy(String modifiedBy) { this.modifiedBy = modifiedBy; }
}
