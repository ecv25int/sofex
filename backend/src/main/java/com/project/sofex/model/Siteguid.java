package com.project.sofex.model;

import jakarta.persistence.*;

@Entity
@Table(name = "siteguid")
public class Siteguid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column
    private String permissions;

    @Column
    private String reports;

    @Column(nullable = false)
    private Boolean sflag;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPermissions() { return permissions; }
    public void setPermissions(String permissions) { this.permissions = permissions; }

    public String getReports() { return reports; }
    public void setReports(String reports) { this.reports = reports; }

    public Boolean getSflag() { return sflag; }
    public void setSflag(Boolean sflag) { this.sflag = sflag; }
}
