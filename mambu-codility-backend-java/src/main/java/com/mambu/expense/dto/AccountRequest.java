package com.mambu.expense.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record AccountRequest(
        @NotBlank(message = "Name is required")
        String name,

        @NotNull(message = "Initial balance is required")
        @DecimalMin(value = "0.00", message = "Initial balance cannot be negative")
        BigDecimal initialBalance
) {
}
