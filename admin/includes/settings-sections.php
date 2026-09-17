<?php

declare(strict_types=1);

require_once __DIR__ . '/csrf.php';

/**
 * @param list<array{id: int, option_key?: string, name?: string, label?: string, is_active: int}> $rows
 */
function settings_render_option_table(string $tableId, string $nameField, array $rows, string $rowPrefix): void
{
    ?>
    <div class="table-card table-card-flush">
        <table class="data-table settings-options-table" id="<?= h($tableId) ?>">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <?php if ($rows === []): ?>
                    <tr><td colspan="3" class="table-empty">No options yet.</td></tr>
                <?php else: ?>
                    <?php foreach ($rows as $row): ?>
                        <?php
                        $id = (int) $row['id'];
                        $label = (string) ($row['label'] ?? $row['name'] ?? '');
                        $active = (int) $row['is_active'] === 1;
                        ?>
                        <tr data-settings-row="<?= h($rowPrefix) ?>" data-settings-id="<?= $id ?>">
                            <td><?= h($label) ?></td>
                            <td><?= $active ? 'Active' : 'Inactive' ?></td>
                            <td class="cell-actions">
                                <button
                                    type="button"
                                    class="link-btn settings-edit-btn"
                                    data-settings-id="<?= $id ?>"
                                    data-settings-label="<?= h($label) ?>"
                                    data-settings-active="<?= $active ? '1' : '0' ?>"
                                >Edit</button>
                                <button
                                    type="button"
                                    class="link-btn link-danger settings-delete-btn"
                                    data-settings-id="<?= $id ?>"
                                    data-settings-label="<?= h($label) ?>"
                                >Delete</button>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
    <?php
}

function settings_render_lookup_section(
    string $groupKey,
    string $title,
    string $description,
    array $rows
): void {
    ?>
    <div class="settings-card" data-settings-kind="lookup" data-group-key="<?= h($groupKey) ?>">
        <div class="settings-card-header">
            <div>
                <h2><?= h($title) ?></h2>
                <p class="settings-card-desc"><?= h($description) ?></p>
            </div>
            <button type="button" class="btn btn-small settings-add-btn" data-group-key="<?= h($groupKey) ?>">Add</button>
        </div>
        <?php settings_render_option_table('settings-table-' . $groupKey, 'label', $rows, 'lookup-' . $groupKey); ?>
    </div>
    <?php
}

function settings_render_category_section(
    string $kind,
    string $title,
    string $description,
    array $rows
): void {
    ?>
    <div class="settings-card" data-settings-kind="category" data-category-kind="<?= h($kind) ?>">
        <div class="settings-card-header">
            <div>
                <h2><?= h($title) ?></h2>
                <p class="settings-card-desc"><?= h($description) ?></p>
            </div>
            <button type="button" class="btn btn-small settings-add-btn" data-category-kind="<?= h($kind) ?>">Add</button>
        </div>
        <?php settings_render_option_table('settings-table-' . $kind, 'name', $rows, 'category-' . $kind); ?>
    </div>
    <?php
}
