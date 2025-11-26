package com.mambu.expense.dto;

import com.mambu.expense.model.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionRequest(
        @NotBlank(message = "Description is required")
        String description,

        @NotNull(message = "Date is required")
        LocalDate date,

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
        BigDecimal amount,

        @NotNull(message = "Type is required")
        TransactionType type
) {
}
