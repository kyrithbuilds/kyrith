<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/require_login.php';
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/csrf.php';
require_once __DIR__ . '/includes/finance-calculations.php';
require_once __DIR__ . '/includes/date-range.php';
require_once __DIR__ . '/includes/paths.php';
require_once __DIR__ . '/includes/empty-state.php';

$pdo = db();
$partners = finance_active_partners($pdo);
$summary = finance_calculate_settlement_summary($pdo);

$stmt = $pdo->query(
    'SELECT s.id, s.settlement_date, s.amount, s.note,
            s.from_partner_id, s.to_partner_id,
            fp.name AS from_name, tp.name AS to_name
     FROM settlements s
     INNER JOIN partners fp ON fp.id = s.from_partner_id
     INNER JOIN partners tp ON tp.id = s.to_partner_id
     ORDER BY s.settlement_date DESC, s.id DESC'
);
$rows = $stmt->fetchAll();

$settlementRecords = [];
foreach ($rows as $row) {
    $id = (int) $row['id'];
    $settlementRecords[$id] = [
        'id' => $id,
        'from_partner_id' => (int) $row['from_partner_id'],
        'to_partner_id' => (int) $row['to_partner_id'],
        'amount' => (string) $row['amount'],
        'settlement_date' => (string) $row['settlement_date'],
        'note' => (string) ($row['note'] ?? ''),
        'label' => (string) $row['from_name'] . ' → ' . (string) $row['to_name']
            . ' ' . finance_format_inr((float) $row['amount']),
    ];
}

$pageTitle = 'Settlements';
$currentPage = 'settlements';

require __DIR__ . '/includes/layout-top.php';
?>

<div class="page-header">
    <h1>Settlements</h1>
    <p>Partner-to-partner payments — these update the dashboard balance immediately</p>
</div>

<div class="alert alert-info">
    Current balance: <strong><?= h($summary['balance_message']) ?></strong>
    — also shown on the <a href="<?= h(admin_path()) ?>">Dashboard</a>.
</div>

<div class="settings-grid settlements-layout">
    <div class="settings-card">
        <h2>Log a settlement</h2>
        <form id="settlements-page-form" novalidate>
            <input type="hidden" name="csrf_token" value="<?= h(csrf_token()) ?>">
            <div class="form-group">
                <label for="sp_from_partner_id">From</label>
                <select id="sp_from_partner_id" name="from_partner_id" required>
                    <option value="">Select partner</option>
                    <?php foreach ($partners as $partner): ?>
                        <option value="<?= (int) $partner['id'] ?>"><?= h((string) $partner['name']) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="form-group">
                <label for="sp_to_partner_id">To</label>
                <select id="sp_to_partner_id" name="to_partner_id" required>
                    <option value="">Select partner</option>
                    <?php foreach ($partners as $partner): ?>
                        <option value="<?= (int) $partner['id'] ?>"><?= h((string) $partner['name']) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="form-group">
                <label for="sp_amount">Amount (₹)</label>
                <input type="number" id="sp_amount" name="amount" min="0.01" step="0.01" required>
            </div>
            <div class="form-group">
                <label for="sp_settlement_date">Date</label>
                <input type="date" id="sp_settlement_date" name="settlement_date" value="<?= h(date('Y-m-d')) ?>" required>
            </div>
            <div class="form-group">
                <label for="sp_note">Note (optional)</label>
                <textarea id="sp_note" name="note" maxlength="255"></textarea>
            </div>
            <div id="settlements-page-form-error" class="alert alert-error" hidden></div>
            <button type="submit" class="btn btn-inline">Save settlement</button>
        </form>
    </div>

    <div class="settings-card">
        <h2>Settlement history</h2>
        <div class="table-card table-card-flush">
            <table class="data-table" id="settlements-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Amount</th>
                        <th>Note</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($rows === []): ?>
                        <?php
                        render_table_empty_state([
                            'colspan' => 6,
                            'icon' => empty_state_icon_wallet(),
                            'title' => 'No settlements yet',
                            'message' => 'No settlements logged yet — use the form to record your first partner payment.',
                        ]);
                        ?>
                    <?php else: ?>
                        <?php foreach ($rows as $row): ?>
                            <tr data-settlement-id="<?= (int) $row['id'] ?>">
                                <td><?= h(finance_format_display_date((string) $row['settlement_date'])) ?></td>
                                <td><?= h((string) $row['from_name']) ?></td>
                                <td><?= h((string) $row['to_name']) ?></td>
                                <td class="cell-amount"><?= h(finance_format_inr((float) $row['amount'])) ?></td>
                                <td class="cell-muted"><?= h((string) ($row['note'] ?? '—')) ?></td>
                                <td class="cell-actions">
                                    <button type="button" class="link-btn settlement-edit-btn">Edit</button>
                                    <button type="button" class="link-btn link-danger settlement-delete-btn">Delete</button>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
        <p class="metric-sub" style="margin-top:0.75rem;">
            If you see duplicate entries from earlier, delete the extras — each one affects the balance.
        </p>
    </div>
</div>

<div class="modal-backdrop" id="settlements-edit-modal" hidden>
    <div class="modal-card" role="dialog">
        <h2>Edit settlement</h2>
        <form id="settlements-edit-form" novalidate>
            <input type="hidden" name="csrf_token" value="<?= h(csrf_token()) ?>">
            <input type="hidden" name="settlement_id" id="settlements-edit-id" value="">
            <div class="form-group">
                <label for="edit_from_partner_id">From</label>
                <select id="edit_from_partner_id" name="from_partner_id" required>
                    <option value="">Select partner</option>
                    <?php foreach ($partners as $partner): ?>
                        <option value="<?= (int) $partner['id'] ?>"><?= h((string) $partner['name']) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="form-group">
                <label for="edit_to_partner_id">To</label>
                <select id="edit_to_partner_id" name="to_partner_id" required>
                    <option value="">Select partner</option>
                    <?php foreach ($partners as $partner): ?>
                        <option value="<?= (int) $partner['id'] ?>"><?= h((string) $partner['name']) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="form-group">
                <label for="edit_amount">Amount (₹)</label>
                <input type="number" id="edit_amount" name="amount" min="0.01" step="0.01" required>
            </div>
            <div class="form-group">
                <label for="edit_settlement_date">Date</label>
                <input type="date" id="edit_settlement_date" name="settlement_date" required>
            </div>
            <div class="form-group">
                <label for="edit_note">Note (optional)</label>
                <textarea id="edit_note" name="note" maxlength="255"></textarea>
            </div>
            <div id="settlements-edit-form-error" class="alert alert-error" hidden></div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary btn-inline" id="settlements-edit-close">Cancel</button>
                <button type="submit" class="btn btn-inline">Save changes</button>
            </div>
        </form>
    </div>
</div>

<?php
$recordsJson = json_encode($settlementRecords, JSON_THROW_ON_ERROR | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
$extraScripts = '<script>window.KB_SETTLEMENTS = ' . $recordsJson . ';</script>'
    . '<script src="/assets/js/settlements-page.js" defer></script>';
require __DIR__ . '/includes/layout-bottom.php';
