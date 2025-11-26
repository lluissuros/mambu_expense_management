package com.mambu.expense.repository;

import com.mambu.expense.model.Transaction;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByAccountIdOrderByDateDesc(Long accountId);

    Optional<Transaction> findByIdAndAccountId(Long id, Long accountId);
}
