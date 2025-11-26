package com.mambu.expense.dto;

import com.mambu.expense.model.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionResponse(
        Long id,
        Long accountId,
        String description,
        LocalDate date,
        BigDecimal amount,
        TransactionType type
) {
}
