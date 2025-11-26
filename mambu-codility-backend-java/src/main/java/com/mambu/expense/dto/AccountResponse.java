package com.mambu.expense.dto;

import java.math.BigDecimal;

public record AccountResponse(Long id, String name, BigDecimal balance) {
}
