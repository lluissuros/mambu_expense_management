package com.mambu.expense.dto;

import java.time.Instant;

public record ChangeEvent(String resource, String action, Long accountId, Instant at) {
}
