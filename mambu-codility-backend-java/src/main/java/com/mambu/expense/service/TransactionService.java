package com.mambu.expense.service;

import com.mambu.expense.dto.TransactionRequest;
import com.mambu.expense.dto.TransactionResponse;
import com.mambu.expense.model.Account;
import com.mambu.expense.model.Transaction;
import com.mambu.expense.model.TransactionType;
import com.mambu.expense.repository.TransactionRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountService accountService;
    private final ChangeNotificationService notificationService;

    public TransactionService(TransactionRepository transactionRepository,
                              AccountService accountService,
                              ChangeNotificationService notificationService) {
        this.transactionRepository = transactionRepository;
        this.accountService = accountService;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> listForAccount(Long accountId) {
        accountService.getAccountOrThrow(accountId);
        return transactionRepository.findByAccountIdOrderByDateDesc(accountId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public TransactionResponse create(Long accountId, TransactionRequest request) {
        Account account = accountService.getAccountOrThrow(accountId);

        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setDescription(request.description());
        transaction.setDate(request.date());
        transaction.setAmount(request.amount());
        transaction.setType(request.type());

        BigDecimal signedAmount = request.type() == TransactionType.INCOME
                ? request.amount()
                : request.amount().negate();
        account.setBalance(account.getBalance().add(signedAmount));
        account.getTransactions().add(transaction);

        Transaction saved = transactionRepository.save(transaction);
        notificationService.notifyChange("transaction", "created", accountId);
        notificationService.notifyChange("account", "updated", accountId);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long accountId, Long transactionId) {
        Account account = accountService.getAccountOrThrow(accountId);
        Transaction transaction = transactionRepository.findByIdAndAccountId(transactionId, accountId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Transaction not found for this account"));

        BigDecimal signedAmount = transaction.getType() == TransactionType.INCOME
                ? transaction.getAmount()
                : transaction.getAmount().negate();
        account.setBalance(account.getBalance().subtract(signedAmount));
        account.getTransactions().remove(transaction);

        transactionRepository.delete(transaction);
        notificationService.notifyChange("transaction", "deleted", accountId);
        notificationService.notifyChange("account", "updated", accountId);
    }

    @Transactional
    public void deleteById(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found"));

        Account account = transaction.getAccount();
        BigDecimal signedAmount = transaction.getType() == TransactionType.INCOME
                ? transaction.getAmount()
                : transaction.getAmount().negate();
        account.setBalance(account.getBalance().subtract(signedAmount));
        account.getTransactions().remove(transaction);

        transactionRepository.delete(transaction);
        notificationService.notifyChange("transaction", "deleted", account.getId());
        notificationService.notifyChange("account", "updated", account.getId());
    }

    private TransactionResponse toResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getAccount().getId(),
                transaction.getDescription(),
                transaction.getDate(),
                transaction.getAmount(),
                transaction.getType()
        );
    }
}
