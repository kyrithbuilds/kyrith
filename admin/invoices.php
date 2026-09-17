<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/require_login.php';
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/csrf.php';
require_once __DIR__ . '/includes/paths.php';
require_once __DIR__ . '/includes/finance-calculations.php';
require_once __DIR__ . '/includes/entity-helpers.php';
require_once __DIR__ . '/includes/entity-toolbar.php';
require_once __DIR__ . '/includes/lookup-options.php';
require_once __DIR__ . '/includes/empty-state.php';

$pdo = db();

$statusFilter = (string) ($_GET['status'] ?? 'all');
$clientFilter = (int) ($_GET['client_id'] ?? 0);
$statusOptions = lookup_filter_options($pdo, LOOKUP_INVOICE_STATUS);
$allowedFilters = array_keys($statusOptions);
if (!in_array($statusFilter, $allowedFilters, true)) {
    $statusFilter = 'all';
}

$sql = 'SELECT i.id, i.client_id, i.project_id, i.invoice_number, i.status,
               i.issue_date, i.due_date, i.subtotal_amount, i.tax_amount, i.total_amount, i.notes,
               c.company_name AS client_name,
               p.name AS project_name
        FROM invoices i
        INNER JOIN clients c ON c.id = i.client_id
        LEFT JOIN projects p ON p.id = i.project_id
        WHERE 1=1';
$params = [];

if ($statusFilter !== 'all') {
    $sql .= ' AND i.status = :status';
    $params['status'] = $statusFilter;
}

if ($clientFilter > 0) {
    $sql .= ' AND i.client_id = :client_id';
    $params['client_id'] = $clientFilter;
}

$sql .= ' ORDER BY i.issue_date DESC, i.id DESC';

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();

$clients = $pdo->query(
    'SELECT id, company_name FROM clients ORDER BY company_name ASC'
)->fetchAll();

$allProjects = $pdo->query(
    'SELECT id, client_id, name FROM projects ORDER BY name ASC'
)->fetchAll();

$projectsByClient = [];
foreach ($allProjects as $project) {
    $clientKey = (string) $project['client_id'];
    if (!isset($projectsByClient[$clientKey])) {
        $projectsByClient[$clientKey] = [];
    }
    $projectsByClient[$clientKey][] = [
        'id' => (int) $project['id'],
        'name' => (string) $project['name'],
    ];
}

$suggestedInvoiceNumber = invoice_next_number($pdo);
$today = date('Y-m-d');
$invoiceStatuses = lookup_options_list($pdo, LOOKUP_INVOICE_STATUS, true);
$defaultInvoiceStatus = lookup_default_option_key($pdo, LOOKUP_INVOICE_STATUS) ?? 'draft';

$recordsJson = [];
foreach ($rows as $row) {
    $recordsJson[(string) $row['id']] = [
        'id' => (int) $row['id'],
        'client_id' => (int) $row['client_id'],
        'project_id' => $row['project_id'] !== null ? (int) $row['project_id'] : '',
        'invoice_number' => (string) $row['invoice_number'],
        'status' => (string) $row['status'],
        'issue_date' => (string) $row['issue_date'],
        'due_date' => (string) $row['due_date'],
        'subtotal_amount' => (string) $row['subtotal_amount'],
        'tax_amount' => (string) $row['tax_amount'],
        'total_amount' => (string) $row['total_amount'],
        'notes' => (string) ($row['notes'] ?? ''),
        'label' => (string) $row['invoice_number'],
    ];
}

$pageTitle = 'Invoices';
$currentPage = 'invoices';
$pageUrl = admin_path('invoices');
$isFiltered = $statusFilter !== 'all' || $clientFilter > 0;

require __DIR__ . '/includes/layout-top.php';
?>

<?php lookup_render_setup_banner($pdo); ?>

<div class="page-header page-header-row">
    <div>
        <h1>Invoices</h1>
        <p>Create and track client invoices</p>
    </div>
    <button type="button" class="btn btn-inline" id="invoices-add-btn">Add invoice</button>
</div>

<?php
entity_render_toolbar(
    $pageUrl,
    $statusFilter,
    $statusOptions,
    count($rows),
    'invoice',
    $clients,
    $clientFilter
);
?>

<div class="table-card">
    <table class="data-table" id="invoices-table">
        <thead>
            <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Project</th>
                <th>Status</th>
                <th>Issue / Due</th>
                <th>Total</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <?php if ($rows === []): ?>
                <?php
                render_table_empty_state([
                    'colspan' => 7,
                    'icon' => empty_state_icon_file(),
                    'title' => $isFiltered ? 'No invoices found' : 'No invoices yet',
                    'message' => $isFiltered
                        ? 'No invoices match these filters — try a different status or client.'
                        : 'No invoices yet — create your first invoice to start billing.',
                    'action_id' => 'invoices-add-btn',
                    'action_label' => 'Add invoice',
                    'clear_url' => $isFiltered ? $pageUrl : '',
                ]);
                ?>
            <?php else: ?>
                <?php foreach ($rows as $row): ?>
                    <tr data-invoice-id="<?= (int) $row['id'] ?>">
                        <td><?= h((string) $row['invoice_number']) ?></td>
                        <td><?= h((string) $row['client_name']) ?></td>
                        <td class="cell-muted"><?= h((string) ($row['project_name'] ?: '—')) ?></td>
                        <td><?= entity_status_badge_for($pdo, LOOKUP_INVOICE_STATUS, (string) $row['status']) ?></td>
                        <td class="cell-muted">
                            <?= h(finance_format_display_date((string) $row['issue_date']) . ' / ' . finance_format_display_date((string) $row['due_date'])) ?>
                        </td>
                        <td class="cell-amount"><?= h(finance_format_inr((float) $row['total_amount'])) ?></td>
                        <td class="cell-actions">
                            <button type="button" class="link-btn invoice-edit-btn">Edit</button>
                            <button type="button" class="link-btn link-danger invoice-delete-btn">Delete</button>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<div class="modal-backdrop" id="invoices-edit-modal" hidden>
    <div class="modal-card modal-card-wide" role="dialog">
        <h2 id="invoices-edit-title">Add invoice</h2>
        <form id="invoices-edit-form" novalidate>
            <?= csrf_field() ?>
            <input type="hidden" id="invoices-edit-id" value="">
            <div class="form-row">
                <div class="form-group">
                    <label for="invoice_number">Invoice number</label>
                    <input type="text" id="invoice_number" name="invoice_number" maxlength="40" required>
                </div>
                <div class="form-group">
                    <label for="invoice_status">Status</label>
                    <select id="invoice_status" name="status" required>
                        <?php foreach ($invoiceStatuses as $status): ?>
                            <option value="<?= h((string) $status['option_key']) ?>">
                                <?= h((string) $status['label']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="invoice_client_id">Client</label>
                    <select id="invoice_client_id" name="client_id" required>
                        <option value="">Select client</option>
                        <?php foreach ($clients as $client): ?>
                            <option value="<?= (int) $client['id'] ?>"><?= h((string) $client['company_name']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="form-group">
                    <label for="invoice_project_id">Project (optional)</label>
                    <select id="invoice_project_id" name="project_id">
                        <option value="">No project</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="invoice_issue_date">Issue date</label>
                    <input type="date" id="invoice_issue_date" name="issue_date" required>
                </div>
                <div class="form-group">
                    <label for="invoice_due_date">Due date</label>
                    <input type="date" id="invoice_due_date" name="due_date" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="invoice_subtotal">Subtotal (₹)</label>
                    <input type="number" id="invoice_subtotal" name="subtotal_amount" min="0" step="0.01" required>
                </div>
                <div class="form-group">
                    <label for="invoice_tax">Tax (₹)</label>
                    <input type="number" id="invoice_tax" name="tax_amount" min="0" step="0.01" value="0">
                </div>
                <div class="form-group">
                    <label for="invoice_total">Total (₹)</label>
                    <input type="number" id="invoice_total" name="total_amount" min="0" step="0.01" required>
                </div>
            </div>
            <div class="form-group">
                <label for="invoice_notes">Notes</label>
                <textarea id="invoice_notes" name="notes" rows="2"></textarea>
            </div>
            <p class="form-error" id="invoices-edit-form-error" hidden></p>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" id="invoices-edit-close">Cancel</button>
                <button type="submit" class="btn">Save invoice</button>
            </div>
        </form>
    </div>
</div>

<script>
window.KB_INVOICES_CONFIG = <?= json_encode([
    'records' => $recordsJson,
    'projectsByClient' => $projectsByClient,
    'suggestedInvoiceNumber' => $suggestedInvoiceNumber,
    'today' => $today,
    'defaultStatus' => $defaultInvoiceStatus,
    'apis' => [
        'create' => admin_api_path('invoices-create.php'),
        'update' => admin_api_path('invoices-update.php'),
        'delete' => admin_api_path('invoices-delete.php'),
    ],
], JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;
</script>
<?php
$extraScripts = '<script src="/assets/js/entity-crud.js" defer></script>'
    . '<script src="/assets/js/invoices-page.js" defer></script>';
require __DIR__ . '/includes/layout-bottom.php';
