<?php

declare(strict_types=1);

/**
 * Partner balance math — must match the KyrithBuilds finance spreadsheet.
 *
 * @return array{
 *   total_income: float,
 *   total_expenses: float,
 *   total_settlements: float,
 *   current_balance: float,
 *   partners: list<array{
 *     id: int,
 *     name: string,
 *     split_ratio: float,
 *     income_received: float,
 *     expenses_paid: float,
 *     settlements_paid: float,
 *     settlements_received: float,
 *     cash_balance: float,
 *     fair_share_income: float,
 *     fair_share_expense: float,
 *     income_imbalance: float,
 *     expense_imbalance: float,
 *     net_position: float
 *   }>,
 *   balance_message: string,
 *   debtor_name: string|null,
 *   creditor_name: string|null,
 *   amount_owed: float
 * }
 */
function finance_calculate_settlement_summary(PDO $pdo): array
{
    $totalIncome = (float) $pdo->query('SELECT COALESCE(SUM(amount), 0) FROM income')->fetchColumn();
    $totalExpenses = (float) $pdo->query('SELECT COALESCE(SUM(amount), 0) FROM expenses')->fetchColumn();

    $partnersStmt = $pdo->query(
        'SELECT id, name, split_ratio
         FROM partners
         WHERE is_active = 1
         ORDER BY id ASC'
    );
    $partners = $partnersStmt->fetchAll();

    $incomeByPartner = [];
    $stmt = $pdo->query(
        'SELECT received_by_partner_id AS partner_id, COALESCE(SUM(amount), 0) AS total
         FROM income
         GROUP BY received_by_partner_id'
    );
    foreach ($stmt->fetchAll() as $row) {
        $incomeByPartner[(int) $row['partner_id']] = (float) $row['total'];
    }

    $expenseByPartner = [];
    $stmt = $pdo->query(
        'SELECT paid_by_partner_id AS partner_id, COALESCE(SUM(amount), 0) AS total
         FROM expenses
         GROUP BY paid_by_partner_id'
    );
    foreach ($stmt->fetchAll() as $row) {
        $expenseByPartner[(int) $row['partner_id']] = (float) $row['total'];
    }

    $settlementsOut = [];
    $settlementsIn = [];
    $stmt = $pdo->query(
        'SELECT from_partner_id, to_partner_id, COALESCE(SUM(amount), 0) AS total
         FROM settlements
         GROUP BY from_partner_id, to_partner_id'
    );
    foreach ($stmt->fetchAll() as $row) {
        $fromId = (int) $row['from_partner_id'];
        $toId = (int) $row['to_partner_id'];
        $amount = (float) $row['total'];
        $settlementsOut[$fromId][$toId] = ($settlementsOut[$fromId][$toId] ?? 0) + $amount;
        $settlementsIn[$toId][$fromId] = ($settlementsIn[$toId][$fromId] ?? 0) + $amount;
    }

    $partnerRows = [];
    foreach ($partners as $partner) {
        $id = (int) $partner['id'];
        $splitRatio = (float) $partner['split_ratio'];
        $incomeReceived = $incomeByPartner[$id] ?? 0.0;
        $expensesPaid = $expenseByPartner[$id] ?? 0.0;
        $fairShareIncome = $totalIncome * $splitRatio;
        $fairShareExpense = $totalExpenses * $splitRatio;
        $incomeImbalance = $incomeReceived - $fairShareIncome;
        $expenseImbalance = $expensesPaid - $fairShareExpense;

        $settlementsPaid = 0.0;
        $settlementsReceived = 0.0;
        if (isset($settlementsOut[$id])) {
            foreach ($settlementsOut[$id] as $amount) {
                $settlementsPaid += $amount;
            }
        }
        if (isset($settlementsIn[$id])) {
            foreach ($settlementsIn[$id] as $amount) {
                $settlementsReceived += $amount;
            }
        }

        $netSettled = $settlementsPaid - $settlementsReceived;
        $cashBalance = $incomeReceived - $expensesPaid - $settlementsPaid + $settlementsReceived;
        $netPosition = $incomeImbalance - $expenseImbalance - $netSettled;

        $partnerRows[] = [
            'id' => $id,
            'name' => (string) $partner['name'],
            'split_ratio' => $splitRatio,
            'income_received' => $incomeReceived,
            'expenses_paid' => $expensesPaid,
            'settlements_paid' => $settlementsPaid,
            'settlements_received' => $settlementsReceived,
            'cash_balance' => $cashBalance,
            'fair_share_income' => $fairShareIncome,
            'fair_share_expense' => $fairShareExpense,
            'income_imbalance' => $incomeImbalance,
            'expense_imbalance' => $expenseImbalance,
            'net_position' => $netPosition,
        ];
    }

    $debtorName = null;
    $creditorName = null;
    $amountOwed = 0.0;

    if (count($partnerRows) === 2) {
        $a = $partnerRows[0];
        $b = $partnerRows[1];

        if ($a['net_position'] > 0.005) {
            $debtorName = $a['name'];
            $creditorName = $b['name'];
            $amountOwed = $a['net_position'];
        } elseif ($b['net_position'] > 0.005) {
            $debtorName = $b['name'];
            $creditorName = $a['name'];
            $amountOwed = $b['net_position'];
        }
    }

    if ($debtorName !== null && $creditorName !== null) {
        $balanceMessage = sprintf(
            '%s owes %s %s',
            $debtorName,
            $creditorName,
            finance_format_inr($amountOwed)
        );
    } else {
        $balanceMessage = 'All settled';
    }

    $totalSettlements = (float) $pdo->query('SELECT COALESCE(SUM(amount), 0) FROM settlements')->fetchColumn();

    return [
        'total_income' => $totalIncome,
        'total_expenses' => $totalExpenses,
        'total_settlements' => $totalSettlements,
        'current_balance' => $totalIncome - $totalExpenses,
        'partners' => $partnerRows,
        'balance_message' => $balanceMessage,
        'debtor_name' => $debtorName,
        'creditor_name' => $creditorName,
        'amount_owed' => $amountOwed,
    ];
}

function finance_format_inr(float $amount): string
{
    return '₹' . number_format($amount, 2, '.', ',');
}

function finance_format_display_date(string $date): string
{
    $dt = DateTimeImmutable::createFromFormat('Y-m-d', $date);
    return $dt ? $dt->format('d M Y') : $date;
}

/**
 * @return list<array{month: string, income: float, expenses: float}>
 */
function finance_monthly_income_expenses(PDO $pdo): array
{
    $incomeRows = $pdo->query(
        "SELECT DATE_FORMAT(income_date, '%Y-%m') AS month_key,
                COALESCE(SUM(amount), 0) AS total
         FROM income
         GROUP BY month_key
         ORDER BY month_key ASC"
    )->fetchAll();

    $expenseRows = $pdo->query(
        "SELECT DATE_FORMAT(expense_date, '%Y-%m') AS month_key,
                COALESCE(SUM(amount), 0) AS total
         FROM expenses
         GROUP BY month_key
         ORDER BY month_key ASC"
    )->fetchAll();

    $months = [];
    foreach ($incomeRows as $row) {
        $months[(string) $row['month_key']] = ['income' => (float) $row['total'], 'expenses' => 0.0];
    }
    foreach ($expenseRows as $row) {
        $key = (string) $row['month_key'];
        if (!isset($months[$key])) {
            $months[$key] = ['income' => 0.0, 'expenses' => 0.0];
        }
        $months[$key]['expenses'] = (float) $row['total'];
    }

    ksort($months);

    $result = [];
    foreach ($months as $monthKey => $totals) {
        $label = date('M Y', strtotime($monthKey . '-01'));
        $result[] = [
            'month' => $label,
            'income' => $totals['income'],
            'expenses' => $totals['expenses'],
        ];
    }

    return $result;
}

/**
 * @return list<array{category: string, amount: float}>
 */
function finance_expenses_by_category(PDO $pdo): array
{
    $stmt = $pdo->query(
        'SELECT c.name AS category, COALESCE(SUM(e.amount), 0) AS amount
         FROM expenses e
         INNER JOIN expense_categories c ON c.id = e.category_id
         GROUP BY c.id, c.name
         ORDER BY amount DESC'
    );

    $rows = [];
    foreach ($stmt->fetchAll() as $row) {
        $rows[] = [
            'category' => (string) $row['category'],
            'amount' => (float) $row['amount'],
        ];
    }

    return $rows;
}

/**
 * @return list<array{id: int, name: string}>
 */
function finance_active_partners(PDO $pdo): array
{
    $stmt = $pdo->query(
        'SELECT id, name FROM partners WHERE is_active = 1 ORDER BY name ASC'
    );

    $rows = [];
    foreach ($stmt->fetchAll() as $row) {
        $rows[] = [
            'id' => (int) $row['id'],
            'name' => (string) $row['name'],
        ];
    }

    return $rows;
}
