package com.project.sofex.service;

import com.project.sofex.model.Currency;
import com.project.sofex.repository.CurrencyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CurrencyService {
    @Autowired
    private CurrencyRepository currencyRepository;

    public List<Currency> findAll() {
        return currencyRepository.findAll();
    }

    public Optional<Currency> findById(Long id) {
        return currencyRepository.findById(id);
    }

    public Currency save(Currency currency) {
        return currencyRepository.save(currency);
    }

    public void deleteById(Long id) {
        currencyRepository.deleteById(id);
    }
}
