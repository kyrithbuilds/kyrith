<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/require_login.php';
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/csrf.php';
require_once __DIR__ . '/includes/paths.php';
require_once __DIR__ . '/includes/lookup-options.php';
require_once __DIR__ . '/includes/settings-sections.php';

$pdo = db();
$user = admin_current_user();

$partners = $pdo->query(
    'SELECT name, split_ratio, is_active FROM partners ORDER BY name ASC'
)->fetchAll();

$incomeCategories = $pdo->query(
    'SELECT id, name, is_active FROM income_categories ORDER BY name ASC'
)->fetchAll();

$expenseCategories = $pdo->query(
    'SELECT id, name, is_active FROM expense_categories ORDER BY name ASC'
)->fetchAll();

$lookupReady = lookup_is_available($pdo);
$lookupError = 'Run schema-patch-lookups.sql in phpMyAdmin to enable configurable options in Settings.';

try {
    $clientStatuses = lookup_options_list($pdo, LOOKUP_CLIENT_STATUS);
    $projectStatuses = lookup_options_list($pdo, LOOKUP_PROJECT_STATUS);
    $projectTypes = lookup_options_list($pdo, LOOKUP_PROJECT_TYPE);
    $invoiceStatuses = lookup_options_list($pdo, LOOKUP_INVOICE_STATUS);
} catch (Throwable $e) {
    $lookupReady = false;
    $lookupError = 'Could not load configurable options. Run schema-patch-lookups.sql in phpMyAdmin.';
    $clientStatuses = $projectStatuses = $projectTypes = $invoiceStatuses = [];
}

$pageTitle = 'Settings';
$currentPage = 'settings';

require __DIR__ . '/includes/layout-top.php';
?>

<div class="page-header">
    <h1>Settings</h1>
    <p>Manage dropdown options, categories, and your account</p>
</div>

<?php if (!$lookupReady): ?>
    <div class="alert alert-warning settings-alert"><?= h($lookupError) ?></div>
<?php endif; ?>

<div class="settings-grid settings-grid-wide">
    <div class="settings-card">
        <h2>Your account</h2>
        <table class="data-table">
            <tbody>
                <tr>
                    <th style="width:140px">Name</th>
                    <td><?= h($user['name'] ?? '') ?></td>
                </tr>
                <tr>
                    <th>Email</th>
                    <td><?= h($user['email'] ?? '') ?></td>
                </tr>
                <tr>
                    <th>Role</th>
                    <td><?= h($user['role'] ?? '') ?></td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="settings-card">
        <h2>Partners</h2>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Split ratio</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($partners as $partner): ?>
                    <tr>
                        <td><?= h((string) $partner['name']) ?></td>
                        <td><?= h(number_format((float) $partner['split_ratio'] * 100, 2)) ?>%</td>
                        <td><?= (int) $partner['is_active'] === 1 ? 'Active' : 'Inactive' ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>

    <?php
    settings_render_category_section('income', 'Income categories', 'Shown when adding or editing income.', $incomeCategories);
    settings_render_category_section('expense', 'Expense categories', 'Shown when adding or editing expenses.', $expenseCategories);
    ?>

    <?php if ($lookupReady): ?>
        <?php
        settings_render_lookup_section(LOOKUP_CLIENT_STATUS, 'Client statuses', 'Pipeline stages for clients.', $clientStatuses);
        settings_render_lookup_section(LOOKUP_PROJECT_STATUS, 'Project statuses', 'Lifecycle stages for projects.', $projectStatuses);
        settings_render_lookup_section(LOOKUP_PROJECT_TYPE, 'Project types', 'Billing model for each project (e.g. Fixed Cost, Hourly).', $projectTypes);
        settings_render_lookup_section(LOOKUP_INVOICE_STATUS, 'Invoice statuses', 'Tracking stages for invoices.', $invoiceStatuses);
        ?>
    <?php endif; ?>
</div>

<div class="modal-backdrop" id="settings-option-modal" hidden>
    <div class="modal-card" role="dialog">
        <h2 id="settings-option-modal-title">Add option</h2>
        <form id="settings-option-form" novalidate>
            <?= csrf_field() ?>
            <input type="hidden" id="settings-option-id" value="">
            <input type="hidden" id="settings-option-kind" value="">
            <input type="hidden" id="settings-option-group-key" value="">
            <input type="hidden" id="settings-option-category-kind" value="">
            <div class="form-group">
                <label for="settings-option-label">Name</label>
                <input type="text" id="settings-option-label" maxlength="80" required>
            </div>
            <div class="form-group settings-active-field" id="settings-active-field" hidden>
                <label class="checkbox-label">
                    <input type="checkbox" id="settings-option-active" checked>
                    Active
                </label>
            </div>
            <p class="form-error" id="settings-option-form-error" hidden></p>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" id="settings-option-close">Cancel</button>
                <button type="submit" class="btn">Save</button>
            </div>
        </form>
    </div>
</div>

<script>
window.KB_SETTINGS_CONFIG = <?= json_encode([
    'apis' => [
        'lookupCreate' => admin_api_path('lookup-options-create.php'),
        'lookupUpdate' => admin_api_path('lookup-options-update.php'),
        'lookupDelete' => admin_api_path('lookup-options-delete.php'),
        'incomeCreate' => admin_api_path('income-categories-create.php'),
        'incomeUpdate' => admin_api_path('income-categories-update.php'),
        'incomeDelete' => admin_api_path('income-categories-delete.php'),
        'expenseCreate' => admin_api_path('expense-categories-create.php'),
        'expenseUpdate' => admin_api_path('expense-categories-update.php'),
        'expenseDelete' => admin_api_path('expense-categories-delete.php'),
    ],
], JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;
</script>
<?php
$extraScripts = '<script src="/assets/js/settings-page.js" defer></script>';
require __DIR__ . '/includes/layout-bottom.php';
