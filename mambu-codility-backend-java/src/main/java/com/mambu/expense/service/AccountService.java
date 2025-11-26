package com.mambu.expense.service;

import com.mambu.expense.repository.AccountRepository;
import com.mambu.expense.dto.AccountRequest;
import com.mambu.expense.dto.AccountResponse;
import com.mambu.expense.model.Account;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final ChangeNotificationService notificationService;

    public AccountService(AccountRepository accountRepository, ChangeNotificationService notificationService) {
        this.accountRepository = accountRepository;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public List<AccountResponse> listAccounts() {
        return accountRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AccountResponse create(AccountRequest request) {
        Account account = new Account();
        account.setName(request.name());
        account.setBalance(request.initialBalance());
        Account saved = accountRepository.save(account);

        notificationService.notifyChange("account", "created", saved.getId());
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        Account account = getAccountOrThrow(id);
        accountRepository.delete(account);
        notificationService.notifyChange("account", "deleted", id);
    }

    public Account getAccountOrThrow(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found"));
    }

    private AccountResponse toResponse(Account account) {
        return new AccountResponse(account.getId(), account.getName(), account.getBalance());
    }
}
