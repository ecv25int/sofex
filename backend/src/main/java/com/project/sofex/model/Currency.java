package com.project.sofex.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "currency")
public class Currency {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(precision = 19, scale = 4)
    private BigDecimal dollarExchangeRate;

    @Column(precision = 19, scale = 4)
    private BigDecimal euroExchangeRate;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getDollarExchangeRate() { return dollarExchangeRate; }
    public void setDollarExchangeRate(BigDecimal dollarExchangeRate) { this.dollarExchangeRate = dollarExchangeRate; }

    public BigDecimal getEuroExchangeRate() { return euroExchangeRate; }
    public void setEuroExchangeRate(BigDecimal euroExchangeRate) { this.euroExchangeRate = euroExchangeRate; }
}
