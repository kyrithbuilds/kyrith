<?php

declare(strict_types=1);

const LOOKUP_CLIENT_STATUS = 'client_status';
const LOOKUP_PROJECT_STATUS = 'project_status';
const LOOKUP_PROJECT_TYPE = 'project_type';
const LOOKUP_INVOICE_STATUS = 'invoice_status';

/**
 * @return array<string, list<array{option_key: string, label: string, sort_order: int}>>
 */
function lookup_builtin_defaults(): array
{
    return [
        LOOKUP_CLIENT_STATUS => [
            ['option_key' => 'lead', 'label' => 'Lead', 'sort_order' => 10],
            ['option_key' => 'active', 'label' => 'Active', 'sort_order' => 20],
            ['option_key' => 'paused', 'label' => 'Paused', 'sort_order' => 30],
            ['option_key' => 'churned', 'label' => 'Churned', 'sort_order' => 40],
        ],
        LOOKUP_PROJECT_STATUS => [
            ['option_key' => 'planned', 'label' => 'Planned', 'sort_order' => 10],
            ['option_key' => 'active', 'label' => 'Active', 'sort_order' => 20],
            ['option_key' => 'on_hold', 'label' => 'On Hold', 'sort_order' => 30],
            ['option_key' => 'completed', 'label' => 'Completed', 'sort_order' => 40],
            ['option_key' => 'cancelled', 'label' => 'Cancelled', 'sort_order' => 50],
        ],
        LOOKUP_PROJECT_TYPE => [
            ['option_key' => 'fixed_cost', 'label' => 'Fixed Cost', 'sort_order' => 10],
            ['option_key' => 'dedicated', 'label' => 'Dedicated', 'sort_order' => 20],
            ['option_key' => 'hourly', 'label' => 'Hourly', 'sort_order' => 30],
        ],
        LOOKUP_INVOICE_STATUS => [
            ['option_key' => 'draft', 'label' => 'Draft', 'sort_order' => 10],
            ['option_key' => 'sent', 'label' => 'Sent', 'sort_order' => 20],
            ['option_key' => 'paid', 'label' => 'Paid', 'sort_order' => 30],
            ['option_key' => 'overdue', 'label' => 'Overdue', 'sort_order' => 40],
            ['option_key' => 'void', 'label' => 'Void', 'sort_order' => 50],
        ],
    ];
}

function lookup_is_available(PDO $pdo): bool
{
    static $available = null;

    if ($available !== null) {
        return $available;
    }

    try {
        $pdo->query('SELECT 1 FROM lookup_options LIMIT 1');
        $available = true;
    } catch (Throwable $e) {
        $available = false;
    }

    return $available;
}

function lookup_schema_has_column(PDO $pdo, string $table, string $column): bool
{
    static $cache = [];
    $key = $table . '.' . $column;

    if (array_key_exists($key, $cache)) {
        return $cache[$key];
    }

    try {
        $stmt = $pdo->prepare('SHOW COLUMNS FROM `' . str_replace('`', '', $table) . '` LIKE :column');
        $stmt->execute(['column' => $column]);
        $cache[$key] = (bool) $stmt->fetch();
    } catch (Throwable $e) {
        $cache[$key] = false;
    }

    return $cache[$key];
}

/**
 * @return list<array{id: int, option_key: string, label: string, sort_order: int, is_active: int}>
 */
function lookup_builtin_rows(string $groupKey, bool $activeOnly): array
{
    $defaults = lookup_builtin_defaults()[$groupKey] ?? [];
    $rows = [];
    $id = 1;

    foreach ($defaults as $item) {
        $rows[] = [
            'id' => $id++,
            'option_key' => $item['option_key'],
            'label' => $item['label'],
            'sort_order' => $item['sort_order'],
            'is_active' => 1,
        ];
    }

    return $rows;
}

/**
 * @return list<array{id: int, option_key: string, label: string, sort_order: int, is_active: int}>
 */
function lookup_options_list(PDO $pdo, string $groupKey, bool $activeOnly = false): array
{
    if (!lookup_is_available($pdo)) {
        return lookup_builtin_rows($groupKey, $activeOnly);
    }

    try {
        $sql = 'SELECT id, option_key, label, sort_order, is_active
                FROM lookup_options
                WHERE group_key = :group_key';
        if ($activeOnly) {
            $sql .= ' AND is_active = 1';
        }
        $sql .= ' ORDER BY sort_order ASC, label ASC, id ASC';

        $stmt = $pdo->prepare($sql);
        $stmt->execute(['group_key' => $groupKey]);
        $rows = $stmt->fetchAll();

        if ($rows !== []) {
            return $rows;
        }
    } catch (Throwable $e) {
        // Fall through to built-in defaults.
    }

    return lookup_builtin_rows($groupKey, $activeOnly);
}

/**
 * @return list<string>
 */
function lookup_option_keys(PDO $pdo, string $groupKey, bool $activeOnly = true): array
{
    $rows = lookup_options_list($pdo, $groupKey, $activeOnly);
    $keys = [];
    foreach ($rows as $row) {
        $keys[] = (string) $row['option_key'];
    }

    return $keys;
}

function lookup_option_label(PDO $pdo, string $groupKey, string $optionKey): string
{
    if (lookup_is_available($pdo)) {
        try {
            $stmt = $pdo->prepare(
                'SELECT label FROM lookup_options
                 WHERE group_key = :group_key AND option_key = :option_key
                 LIMIT 1'
            );
            $stmt->execute(['group_key' => $groupKey, 'option_key' => $optionKey]);
            $label = $stmt->fetchColumn();

            if (is_string($label) && $label !== '') {
                return $label;
            }
        } catch (Throwable $e) {
            // Fall through.
        }
    }

    foreach (lookup_builtin_defaults()[$groupKey] ?? [] as $item) {
        if ($item['option_key'] === $optionKey) {
            return $item['label'];
        }
    }

    return ucwords(str_replace('_', ' ', $optionKey));
}

function lookup_validate_option(PDO $pdo, string $groupKey, string $optionKey, bool $activeOnly = true): bool
{
    if ($optionKey === '') {
        return false;
    }

    if (lookup_is_available($pdo)) {
        try {
            $sql = 'SELECT id FROM lookup_options
                    WHERE group_key = :group_key AND option_key = :option_key';
            if ($activeOnly) {
                $sql .= ' AND is_active = 1';
            }
            $sql .= ' LIMIT 1';

            $stmt = $pdo->prepare($sql);
            $stmt->execute(['group_key' => $groupKey, 'option_key' => $optionKey]);

            if ($stmt->fetch()) {
                return true;
            }
        } catch (Throwable $e) {
            // Fall through to built-in defaults.
        }
    }

    foreach (lookup_builtin_rows($groupKey, $activeOnly) as $row) {
        if ($row['option_key'] === $optionKey) {
            return true;
        }
    }

    return false;
}

/**
 * @return array<string, string>
 */
function lookup_filter_options(PDO $pdo, string $groupKey): array
{
    $options = ['all' => 'All statuses'];
    foreach (lookup_options_list($pdo, $groupKey, true) as $row) {
        $options[(string) $row['option_key']] = (string) $row['label'];
    }

    return $options;
}

function lookup_slug_from_label(string $label): string
{
    $slug = strtolower(trim($label));
    $slug = preg_replace('/[^a-z0-9]+/', '_', $slug) ?? '';
    $slug = trim($slug, '_');

    return $slug !== '' ? $slug : 'option';
}

function lookup_unique_option_key(PDO $pdo, string $groupKey, string $baseKey): string
{
    $key = $baseKey;
    $suffix = 2;

    while (lookup_validate_option($pdo, $groupKey, $key, false)) {
        $key = $baseKey . '_' . $suffix;
        $suffix++;
    }

    return $key;
}

function lookup_option_usage_count(PDO $pdo, string $groupKey, string $optionKey): int
{
    $map = [
        LOOKUP_CLIENT_STATUS => ['clients', 'status'],
        LOOKUP_PROJECT_STATUS => ['projects', 'status'],
        LOOKUP_PROJECT_TYPE => ['projects', 'project_type'],
        LOOKUP_INVOICE_STATUS => ['invoices', 'status'],
    ];

    if (!isset($map[$groupKey])) {
        return 0;
    }

    [$table, $column] = $map[$groupKey];

    if (!lookup_schema_has_column($pdo, $table, $column)) {
        return 0;
    }

    try {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM {$table} WHERE {$column} = :value");
        $stmt->execute(['value' => $optionKey]);

        return (int) $stmt->fetchColumn();
    } catch (Throwable $e) {
        return 0;
    }
}

function lookup_default_option_key(PDO $pdo, string $groupKey): ?string
{
    $keys = lookup_option_keys($pdo, $groupKey, true);

    return $keys[0] ?? null;
}

function lookup_render_setup_banner(PDO $pdo): void
{
    if (lookup_is_available($pdo)) {
        return;
    }
    ?>
    <div class="alert alert-warning settings-alert">
        Database setup needed: run <strong>schema-patch-lookups.sql</strong> in phpMyAdmin to enable
        configurable options in Settings. Pages will use default options until then.
    </div>
    <?php
}
