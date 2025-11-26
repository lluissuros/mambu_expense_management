package com.mambu.expense.config;

import com.mambu.expense.dto.AccountRequest;
import com.mambu.expense.dto.AccountResponse;
import com.mambu.expense.dto.TransactionRequest;
import com.mambu.expense.model.TransactionType;
import com.mambu.expense.service.AccountService;
import com.mambu.expense.service.TransactionService;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final AccountService accountService;
    private final TransactionService transactionService;

    public DataSeeder(AccountService accountService, TransactionService transactionService) {
        this.accountService = accountService;
        this.transactionService = transactionService;
    }

    @Override
    public void run(String... args) {
        if (!accountService.listAccounts().isEmpty()) {
            return; // already seeded
        }

        AccountResponse account = accountService.create(new AccountRequest("Seed Account", BigDecimal.ZERO));
        Long accountId = account.id();

        transactionService.create(accountId, new TransactionRequest(
                "Seed Expense",
                LocalDate.now(),
                new BigDecimal("2000.00"),
                TransactionType.EXPENSE
        ));

        transactionService.create(accountId, new TransactionRequest(
                "Seed Income",
                LocalDate.now(),
                new BigDecimal("3000.00"),
                TransactionType.INCOME
        ));
    }
}
