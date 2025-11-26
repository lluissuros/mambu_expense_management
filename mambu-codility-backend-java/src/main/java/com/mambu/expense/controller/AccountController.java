package com.mambu.expense.controller;

import com.mambu.expense.dto.AccountRequest;
import com.mambu.expense.dto.AccountResponse;
import com.mambu.expense.dto.TransactionRequest;
import com.mambu.expense.dto.TransactionResponse;
import com.mambu.expense.service.AccountService;
import com.mambu.expense.service.TransactionService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/accounts")
@CrossOrigin
public class AccountController {

    private final AccountService accountService;
    private final TransactionService transactionService;

    public AccountController(AccountService accountService, TransactionService transactionService) {
        this.accountService = accountService;
        this.transactionService = transactionService;
    }

    @GetMapping
    public List<AccountResponse> listAccounts() {
        return accountService.listAccounts();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AccountResponse createAccount(@Valid @RequestBody AccountRequest request) {
        return accountService.create(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAccount(@PathVariable Long id) {
        accountService.delete(id);
    }

    @GetMapping("/{id}/transactions")
    public List<TransactionResponse> listTransactions(@PathVariable Long id) {
        return transactionService.listForAccount(id);
    }

    @PostMapping("/{id}/transactions")
    @ResponseStatus(HttpStatus.CREATED)
    public TransactionResponse createTransaction(@PathVariable Long id,
                                                 @Valid @RequestBody TransactionRequest request) {
        return transactionService.create(id, request);
    }

    @DeleteMapping("/{accountId}/transactions/{transactionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTransaction(@PathVariable Long accountId, @PathVariable Long transactionId) {
        transactionService.delete(accountId, transactionId);
    }
}
