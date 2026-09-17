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
$statusOptions = lookup_filter_options($pdo, LOOKUP_PROJECT_STATUS);
$allowedFilters = array_keys($statusOptions);
if (!in_array($statusFilter, $allowedFilters, true)) {
    $statusFilter = 'all';
}

$sql = 'SELECT p.id, p.client_id, p.name, p.description, p.status,';
if (lookup_schema_has_column($pdo, 'projects', 'project_type')) {
    $sql .= ' p.project_type,';
} else {
    $sql .= ' NULL AS project_type,';
}
$sql .= ' p.start_date, p.budget_amount,
               c.company_name AS client_name
        FROM projects p
        INNER JOIN clients c ON c.id = p.client_id
        WHERE 1=1';
$params = [];

if ($statusFilter !== 'all') {
    $sql .= ' AND p.status = :status';
    $params['status'] = $statusFilter;
}

if ($clientFilter > 0) {
    $sql .= ' AND p.client_id = :client_id';
    $params['client_id'] = $clientFilter;
}

$sql .= ' ORDER BY p.name ASC, p.id DESC';

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();

$clients = $pdo->query(
    'SELECT id, company_name FROM clients ORDER BY company_name ASC'
)->fetchAll();

$projectStatuses = lookup_options_list($pdo, LOOKUP_PROJECT_STATUS, true);
$projectTypes = lookup_options_list($pdo, LOOKUP_PROJECT_TYPE, true);
$defaultStatus = lookup_default_option_key($pdo, LOOKUP_PROJECT_STATUS) ?? 'planned';

$recordsJson = [];
foreach ($rows as $row) {
    $recordsJson[(string) $row['id']] = [
        'id' => (int) $row['id'],
        'client_id' => (int) $row['client_id'],
        'name' => (string) $row['name'],
        'description' => (string) ($row['description'] ?? ''),
        'status' => (string) $row['status'],
        'project_type' => (string) ($row['project_type'] ?? ''),
        'start_date' => (string) ($row['start_date'] ?? ''),
        'budget_amount' => $row['budget_amount'] !== null ? (string) $row['budget_amount'] : '',
        'label' => (string) $row['name'],
    ];
}

$pageTitle = 'Projects';
$currentPage = 'projects';
$pageUrl = admin_path('projects');
$isFiltered = $statusFilter !== 'all' || $clientFilter > 0;

require __DIR__ . '/includes/layout-top.php';
?>

<?php lookup_render_setup_banner($pdo); ?>

<div class="page-header page-header-row">
    <div>
        <h1>Projects</h1>
        <p>Track work by client and monitor budgets</p>
    </div>
    <button type="button" class="btn btn-inline" id="projects-add-btn">Add project</button>
</div>

<?php
entity_render_toolbar(
    $pageUrl,
    $statusFilter,
    $statusOptions,
    count($rows),
    'project',
    $clients,
    $clientFilter
);
?>

<div class="table-card">
    <table class="data-table" id="projects-table">
        <thead>
            <tr>
                <th>Project</th>
                <th>Client</th>
                <th>Type</th>
                <th>Status</th>
                <th>Start date</th>
                <th>Budget</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <?php if ($rows === []): ?>
                <?php
                render_table_empty_state([
                    'colspan' => 7,
                    'icon' => empty_state_icon_folder(),
                    'title' => $isFiltered ? 'No projects found' : 'No projects yet',
                    'message' => $isFiltered
                        ? 'No projects match these filters — try a different status or client.'
                        : 'No projects yet — add your first project to start tracking work.',
                    'action_id' => 'projects-add-btn',
                    'action_label' => 'Add project',
                    'clear_url' => $isFiltered ? $pageUrl : '',
                ]);
                ?>
            <?php else: ?>
                <?php foreach ($rows as $row): ?>
                    <tr data-project-id="<?= (int) $row['id'] ?>">
                        <td><?= h((string) $row['name']) ?></td>
                        <td><?= h((string) $row['client_name']) ?></td>
                        <td><?= entity_type_badge_for($pdo, LOOKUP_PROJECT_TYPE, $row['project_type'] !== null ? (string) $row['project_type'] : null) ?></td>
                        <td><?= entity_status_badge_for($pdo, LOOKUP_PROJECT_STATUS, (string) $row['status']) ?></td>
                        <td class="cell-muted">
                            <?= $row['start_date'] ? h(finance_format_display_date((string) $row['start_date'])) : '—' ?>
                        </td>
                        <td class="cell-amount">
                            <?= $row['budget_amount'] !== null ? h(finance_format_inr((float) $row['budget_amount'])) : '—' ?>
                        </td>
                        <td class="cell-actions">
                            <button type="button" class="link-btn project-edit-btn">Edit</button>
                            <button type="button" class="link-btn link-danger project-delete-btn">Delete</button>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<div class="modal-backdrop" id="projects-edit-modal" hidden>
    <div class="modal-card modal-card-wide" role="dialog">
        <h2 id="projects-edit-title">Add project</h2>
        <form id="projects-edit-form" novalidate>
            <?= csrf_field() ?>
            <input type="hidden" id="projects-edit-id" value="">
            <div class="form-row">
                <div class="form-group">
                    <label for="project_client_id">Client</label>
                    <select id="project_client_id" name="client_id" required>
                        <option value="">Select client</option>
                        <?php foreach ($clients as $client): ?>
                            <option value="<?= (int) $client['id'] ?>"><?= h((string) $client['company_name']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="form-group">
                    <label for="project_type">Project type</label>
                    <select id="project_type" name="project_type">
                        <option value="">Select type</option>
                        <?php foreach ($projectTypes as $type): ?>
                            <option value="<?= h((string) $type['option_key']) ?>">
                                <?= h((string) $type['label']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="form-group">
                    <label for="project_status">Status</label>
                    <select id="project_status" name="status" required>
                        <?php foreach ($projectStatuses as $status): ?>
                            <option value="<?= h((string) $status['option_key']) ?>">
                                <?= h((string) $status['label']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="project_name">Project name</label>
                <input type="text" id="project_name" name="name" maxlength="150" required>
            </div>
            <div class="form-group">
                <label for="project_description">Description</label>
                <textarea id="project_description" name="description" rows="2"></textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="project_start_date">Start date</label>
                    <input type="date" id="project_start_date" name="start_date">
                </div>
                <div class="form-group">
                    <label for="project_budget_amount">Budget (₹)</label>
                    <input type="number" id="project_budget_amount" name="budget_amount" min="0" step="0.01">
                </div>
            </div>
            <p class="form-error" id="projects-edit-form-error" hidden></p>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" id="projects-edit-close">Cancel</button>
                <button type="submit" class="btn">Save project</button>
            </div>
        </form>
    </div>
</div>

<script>
window.KB_PROJECTS_CONFIG = <?= json_encode([
    'records' => $recordsJson,
    'defaultStatus' => $defaultStatus,
    'apis' => [
        'create' => admin_api_path('projects-create.php'),
        'update' => admin_api_path('projects-update.php'),
        'delete' => admin_api_path('projects-delete.php'),
    ],
], JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;
</script>
<?php
$extraScripts = '<script src="/assets/js/entity-crud.js" defer></script>'
    . '<script src="/assets/js/projects-page.js" defer></script>';
require __DIR__ . '/includes/layout-bottom.php';
