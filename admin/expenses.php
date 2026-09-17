<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/require_login.php';
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/csrf.php';
require_once __DIR__ . '/includes/finance-calculations.php';
require_once __DIR__ . '/includes/paths.php';
require_once __DIR__ . '/includes/date-range.php';
require_once __DIR__ . '/includes/finance-toolbar.php';
require_once __DIR__ . '/includes/empty-state.php';

$pdo = db();

$range = (string) ($_GET['range'] ?? 'all');
$customFrom = (string) ($_GET['from'] ?? '');
$customTo = (string) ($_GET['to'] ?? '');
$sort = (string) ($_GET['sort'] ?? 'date');
$dir = (string) ($_GET['dir'] ?? 'desc');

$bounds = finance_resolve_date_range($range, $customFrom, $customTo);
if ($range === 'custom' && $bounds === null) {
    $range = 'all';
    $bounds = null;
}

$dateSql = finance_date_sql_clause($bounds, 'e.expense_date');
$sortMap = [
    'name' => 'e.name',
    'date' => 'e.expense_date',
    'amount' => 'e.amount',
    'category' => 'c.name',
    'partner' => 'p.name',
];
$sortKey = in_array($sort, array_keys($sortMap), true) ? $sort : 'date';
$orderColumn = $sortMap[$sortKey];
$orderDir = strtolower($dir) === 'asc' ? 'ASC' : 'DESC';

$sql = 'SELECT e.id, e.name, e.description, e.expense_date, e.amount,
               e.category_id, e.paid_by_partner_id,
               c.name AS category_name, p.name AS partner_name
        FROM expenses e
        INNER JOIN expense_categories c ON c.id = e.category_id
        INNER JOIN partners p ON p.id = e.paid_by_partner_id
        WHERE 1=1' . $dateSql['clause'] . "
        ORDER BY {$orderColumn} {$orderDir}, e.id DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($dateSql['params']);
$rows = $stmt->fetchAll();

$categories = $pdo->query(
    'SELECT id, name FROM expense_categories WHERE is_active = 1 ORDER BY name ASC'
)->fetchAll();
$partners = finance_active_partners($pdo);

$pageTitle = 'Expenses';
$currentPage = 'expenses';
$pageUrl = admin_path('expenses');
$isFiltered = $range !== 'all';

require __DIR__ . '/includes/layout-top.php';
?>

<div class="page-header page-header-row">
    <div>
        <h1>Expenses</h1>
        <p>All business costs</p>
    </div>
    <button type="button" class="btn btn-inline" id="finance-add-btn" data-mode="create">Add expense</button>
</div>

<?php finance_render_toolbar($pageUrl, $range, $customFrom, $customTo, $sort, $dir, count($rows)); ?>

<div class="table-card">
    <table class="data-table finance-table" id="finance-table">
        <thead>
            <tr>
                <th><?= finance_sort_link($pageUrl, 'name', 'Name', $sort, $dir, $range, $customFrom, $customTo) ?></th>
                <th>Description</th>
                <th><?= finance_sort_link($pageUrl, 'date', 'Date', $sort, $dir, $range, $customFrom, $customTo) ?></th>
                <th><?= finance_sort_link($pageUrl, 'amount', 'Amount', $sort, $dir, $range, $customFrom, $customTo) ?></th>
                <th><?= finance_sort_link($pageUrl, 'category', 'Category', $sort, $dir, $range, $customFrom, $customTo) ?></th>
                <th><?= finance_sort_link($pageUrl, 'partner', 'Paid by', $sort, $dir, $range, $customFrom, $customTo) ?></th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <?php if ($rows === []): ?>
                <?php
                render_table_empty_state([
                    'colspan' => 7,
                    'icon' => empty_state_icon_wallet(),
                    'title' => $isFiltered ? 'No expenses found' : 'No expenses yet',
                    'message' => $isFiltered
                        ? 'No expenses found for this date range — try a different range.'
                        : 'No expenses logged yet — add your first expense to start tracking.',
                    'action_id' => 'finance-add-btn',
                    'action_label' => 'Add expense',
                    'clear_url' => $isFiltered ? $pageUrl : '',
                ]);
                ?>
            <?php else: ?>
                <?php foreach ($rows as $row): ?>
                    <tr
                        data-id="<?= (int) $row['id'] ?>"
                        data-name="<?= h((string) $row['name']) ?>"
                        data-description="<?= h((string) ($row['description'] ?? '')) ?>"
                        data-date="<?= h((string) $row['expense_date']) ?>"
                        data-amount="<?= h((string) $row['amount']) ?>"
                        data-category-id="<?= (int) $row['category_id'] ?>"
                        data-partner-id="<?= (int) $row['paid_by_partner_id'] ?>"
                    >
                        <td><?= h((string) $row['name']) ?></td>
                        <td class="cell-muted"><?= h((string) ($row['description'] ?? '—')) ?></td>
                        <td><?= h(finance_format_display_date((string) $row['expense_date'])) ?></td>
                        <td class="cell-amount"><?= h(finance_format_inr((float) $row['amount'])) ?></td>
                        <td><?= h((string) $row['category_name']) ?></td>
                        <td><?= h((string) $row['partner_name']) ?></td>
                        <td class="cell-actions">
                            <button type="button" class="link-btn finance-edit-btn">Edit</button>
                            <button type="button" class="link-btn link-danger finance-delete-btn">Delete</button>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<div class="modal-backdrop" id="finance-modal" hidden>
    <div class="modal-card" role="dialog">
        <h2 id="finance-modal-title">Add expense</h2>
        <form id="finance-form" novalidate>
            <input type="hidden" name="csrf_token" value="<?= h(csrf_token()) ?>">
            <input type="hidden" name="id" id="finance-id" value="">
            <div class="form-group">
                <label for="finance-name">Name</label>
                <input type="text" id="finance-name" name="name" maxlength="150" required>
            </div>
            <div class="form-group">
                <label for="finance-description">Description</label>
                <textarea id="finance-description" name="description"></textarea>
            </div>
            <div class="form-group">
                <label for="finance-date">Date</label>
                <input type="date" id="finance-date" name="expense_date" value="<?= h(date('Y-m-d')) ?>" required>
            </div>
            <div class="form-group">
                <label for="finance-amount">Amount (₹)</label>
                <input type="number" id="finance-amount" name="amount" min="0.01" step="0.01" required>
            </div>
            <div class="form-group">
                <label for="finance-category">Category</label>
                <select id="finance-category" name="category_id" required>
                    <option value="">Select category</option>
                    <?php foreach ($categories as $cat): ?>
                        <option value="<?= (int) $cat['id'] ?>"><?= h((string) $cat['name']) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="form-group">
                <label for="finance-partner">Paid by</label>
                <select id="finance-partner" name="paid_by_partner_id" required>
                    <option value="">Select partner</option>
                    <?php foreach ($partners as $partner): ?>
                        <option value="<?= (int) $partner['id'] ?>"><?= h((string) $partner['name']) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div id="finance-form-error" class="alert alert-error" hidden></div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary btn-inline" id="finance-modal-close">Cancel</button>
                <button type="submit" class="btn btn-inline">Save</button>
            </div>
        </form>
    </div>
</div>

<?php
$extraScripts = '<script>
window.KB_FINANCE = {
    type: "expense",
    createUrl: "/api/expenses-create.php",
    updateUrl: "/api/expenses-update.php",
    deleteUrl: "/api/expenses-delete.php",
    dateField: "expense_date",
    partnerField: "paid_by_partner_id"
};
</script>
<script src="/assets/js/finance-crud.js" defer></script>
<script src="/assets/js/finance-filters.js" defer></script>';

require __DIR__ . '/includes/layout-bottom.php';
