<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/require_login.php';
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/csrf.php';
require_once __DIR__ . '/includes/finance-calculations.php';

$pdo = db();
$summary = finance_calculate_settlement_summary($pdo);
$monthly = finance_monthly_income_expenses($pdo);
$byCategory = finance_expenses_by_category($pdo);
$partners = finance_active_partners($pdo);

$pageTitle = 'Dashboard';
$currentPage = 'dashboard';
$extraHead = '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js" defer></script>';

require __DIR__ . '/includes/layout-top.php';

$isSettled = $summary['debtor_name'] === null;
?>

<div class="page-header">
    <h1>Dashboard</h1>
    <p>Partner balance and finance overview</p>
</div>

<div class="balance-hero<?= $isSettled ? ' is-settled' : ' is-owed' ?>">
    <p class="balance-hero-label">Current balance</p>
    <p class="balance-hero-amount"><?= h($summary['balance_message']) ?></p>
</div>

<div class="actions-row">
    <button type="button" class="btn btn-inline" id="open-settlement-modal">Log a settlement payment</button>
</div>

<div class="metrics-grid">
    <div class="metric-card">
        <p class="metric-label">Total income</p>
        <p class="metric-value"><?= h(finance_format_inr($summary['total_income'])) ?></p>
    </div>
    <div class="metric-card">
        <p class="metric-label">Total expenses</p>
        <p class="metric-value"><?= h(finance_format_inr($summary['total_expenses'])) ?></p>
    </div>
    <?php foreach ($summary['partners'] as $partner): ?>
        <div class="metric-card">
            <p class="metric-label"><?= h($partner['name']) ?></p>
            <p class="metric-value"><?= h(finance_format_inr($partner['income_received'])) ?></p>
            <p class="metric-sub">
                Received (fair share <?= h(finance_format_inr($partner['fair_share_income'])) ?>)
                · Paid <?= h(finance_format_inr($partner['expenses_paid'])) ?>
                (fair share <?= h(finance_format_inr($partner['fair_share_expense'])) ?>)
            </p>
        </div>
    <?php endforeach; ?>
</div>

<div class="charts-grid">
    <div class="chart-card">
        <h2>Income vs expenses by month</h2>
        <div class="chart-wrap">
            <canvas id="chart-monthly"></canvas>
        </div>
    </div>
    <div class="chart-card">
        <h2>Expenses by category</h2>
        <div class="chart-wrap">
            <canvas id="chart-categories"></canvas>
        </div>
    </div>
</div>

<div class="modal-backdrop" id="settlement-modal" hidden>
    <div class="modal-card" role="dialog" aria-labelledby="settlement-modal-title">
        <h2 id="settlement-modal-title">Log settlement payment</h2>
        <form id="dashboard-settlement-form" novalidate>
            <input type="hidden" name="csrf_token" value="<?= h(csrf_token()) ?>">
            <div class="form-group">
                <label for="from_partner_id">From</label>
                <select id="from_partner_id" name="from_partner_id" required>
                    <option value="">Select partner</option>
                    <?php foreach ($partners as $partner): ?>
                        <option value="<?= (int) $partner['id'] ?>"><?= h($partner['name']) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="form-group">
                <label for="to_partner_id">To</label>
                <select id="to_partner_id" name="to_partner_id" required>
                    <option value="">Select partner</option>
                    <?php foreach ($partners as $partner): ?>
                        <option value="<?= (int) $partner['id'] ?>"><?= h($partner['name']) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="form-group">
                <label for="amount">Amount (₹)</label>
                <input type="number" id="amount" name="amount" min="0.01" step="0.01" required>
            </div>
            <div class="form-group">
                <label for="settlement_date">Date</label>
                <input type="date" id="settlement_date" name="settlement_date" value="<?= h(date('Y-m-d')) ?>" required>
            </div>
            <div class="form-group">
                <label for="note">Note (optional)</label>
                <textarea id="note" name="note" maxlength="255"></textarea>
            </div>
            <div id="dashboard-settlement-form-error" class="alert alert-error" hidden></div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary btn-inline" id="close-settlement-modal">Cancel</button>
                <button type="submit" class="btn btn-inline">Save settlement</button>
            </div>
        </form>
    </div>
</div>

<?php
$chartData = json_encode([
    'monthly' => $monthly,
    'categories' => $byCategory,
], JSON_THROW_ON_ERROR);

$extraScripts = <<<HTML
<script>
window.KB_CHART_DATA = {$chartData};
</script>
<script src="/assets/js/dashboard.js" defer></script>
HTML;

require __DIR__ . '/includes/layout-bottom.php';
