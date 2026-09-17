<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/require_login.php';
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/csrf.php';
require_once __DIR__ . '/includes/paths.php';
require_once __DIR__ . '/includes/entity-helpers.php';
require_once __DIR__ . '/includes/entity-toolbar.php';
require_once __DIR__ . '/includes/lookup-options.php';
require_once __DIR__ . '/includes/empty-state.php';

$pdo = db();

$statusFilter = (string) ($_GET['status'] ?? 'all');
$statusOptions = lookup_filter_options($pdo, LOOKUP_CLIENT_STATUS);
$allowedFilters = array_keys($statusOptions);
if (!in_array($statusFilter, $allowedFilters, true)) {
    $statusFilter = 'all';
}

$sql = 'SELECT id, company_name, contact_name, contact_email, contact_phone,
               billing_address, status, notes, created_at
        FROM clients
        WHERE 1=1';
$params = [];

if ($statusFilter !== 'all') {
    $sql .= ' AND status = :status';
    $params['status'] = $statusFilter;
}

$sql .= ' ORDER BY company_name ASC, id DESC';

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();

$clientStatuses = lookup_options_list($pdo, LOOKUP_CLIENT_STATUS, true);

$recordsJson = [];
foreach ($rows as $row) {
    $recordsJson[(string) $row['id']] = [
        'id' => (int) $row['id'],
        'company_name' => (string) $row['company_name'],
        'contact_name' => (string) ($row['contact_name'] ?? ''),
        'contact_email' => (string) ($row['contact_email'] ?? ''),
        'contact_phone' => (string) ($row['contact_phone'] ?? ''),
        'billing_address' => (string) ($row['billing_address'] ?? ''),
        'status' => (string) $row['status'],
        'notes' => (string) ($row['notes'] ?? ''),
        'label' => (string) $row['company_name'],
    ];
}

$pageTitle = 'Clients';
$currentPage = 'clients';
$pageUrl = admin_path('clients');
$isFiltered = $statusFilter !== 'all';

require __DIR__ . '/includes/layout-top.php';
?>

<?php lookup_render_setup_banner($pdo); ?>

<div class="page-header page-header-row">
    <div>
        <h1>Clients</h1>
        <p>Manage leads and active client relationships</p>
    </div>
    <button type="button" class="btn btn-inline" id="clients-add-btn">Add client</button>
</div>

<?php
entity_render_toolbar(
    $pageUrl,
    $statusFilter,
    $statusOptions,
    count($rows),
    'client'
);
?>

<div class="table-card">
    <table class="data-table" id="clients-table">
        <thead>
            <tr>
                <th>Company</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <?php if ($rows === []): ?>
                <?php
                render_table_empty_state([
                    'colspan' => 6,
                    'icon' => empty_state_icon_users(),
                    'title' => $isFiltered ? 'No clients found' : 'No clients yet',
                    'message' => $isFiltered
                        ? 'No clients match this status filter — try a different status.'
                        : 'No clients yet — add your first client to get started.',
                    'action_id' => 'clients-add-btn',
                    'action_label' => 'Add client',
                    'clear_url' => $isFiltered ? $pageUrl : '',
                ]);
                ?>
            <?php else: ?>
                <?php foreach ($rows as $row): ?>
                    <tr data-client-id="<?= (int) $row['id'] ?>">
                        <td><?= h((string) $row['company_name']) ?></td>
                        <td class="cell-muted"><?= h((string) ($row['contact_name'] ?: '—')) ?></td>
                        <td class="cell-muted"><?= h((string) ($row['contact_email'] ?: '—')) ?></td>
                        <td class="cell-muted"><?= h((string) ($row['contact_phone'] ?: '—')) ?></td>
                        <td><?= entity_status_badge_for($pdo, LOOKUP_CLIENT_STATUS, (string) $row['status']) ?></td>
                        <td class="cell-actions">
                            <button type="button" class="link-btn client-edit-btn">Edit</button>
                            <button type="button" class="link-btn link-danger client-delete-btn">Delete</button>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<div class="modal-backdrop" id="clients-edit-modal" hidden>
    <div class="modal-card modal-card-wide" role="dialog">
        <h2 id="clients-edit-title">Add client</h2>
        <form id="clients-edit-form" novalidate>
            <?= csrf_field() ?>
            <input type="hidden" id="clients-edit-id" value="">
            <div class="form-row">
                <div class="form-group">
                    <label for="client_company_name">Company name</label>
                    <input type="text" id="client_company_name" name="company_name" maxlength="150" required>
                </div>
                <div class="form-group">
                    <label for="client_status">Status</label>
                    <select id="client_status" name="status" required>
                        <?php foreach ($clientStatuses as $status): ?>
                            <option value="<?= h((string) $status['option_key']) ?>">
                                <?= h((string) $status['label']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="client_contact_name">Contact name</label>
                    <input type="text" id="client_contact_name" name="contact_name" maxlength="150">
                </div>
                <div class="form-group">
                    <label for="client_contact_email">Email</label>
                    <input type="email" id="client_contact_email" name="contact_email" maxlength="150">
                </div>
            </div>
            <div class="form-group">
                <label for="client_contact_phone">Phone</label>
                <input type="text" id="client_contact_phone" name="contact_phone" maxlength="30">
            </div>
            <div class="form-group">
                <label for="client_billing_address">Billing address</label>
                <textarea id="client_billing_address" name="billing_address" rows="2"></textarea>
            </div>
            <div class="form-group">
                <label for="client_notes">Notes</label>
                <textarea id="client_notes" name="notes" rows="2"></textarea>
            </div>
            <p class="form-error" id="clients-edit-form-error" hidden></p>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" id="clients-edit-close">Cancel</button>
                <button type="submit" class="btn">Save client</button>
            </div>
        </form>
    </div>
</div>

<script>
window.KB_CLIENTS_CONFIG = <?= json_encode([
    'records' => $recordsJson,
    'apis' => [
        'create' => admin_api_path('clients-create.php'),
        'update' => admin_api_path('clients-update.php'),
        'delete' => admin_api_path('clients-delete.php'),
    ],
], JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;
</script>
<?php
$extraScripts = '<script src="/assets/js/entity-crud.js" defer></script>'
    . '<script src="/assets/js/clients-page.js" defer></script>';
require __DIR__ . '/includes/layout-bottom.php';
