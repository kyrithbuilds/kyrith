<?php

declare(strict_types=1);

require_once __DIR__ . '/csrf.php';
require_once __DIR__ . '/lookup-options.php';

function entity_status_label_for(PDO $pdo, string $groupKey, string $optionKey): string
{
    return lookup_option_label($pdo, $groupKey, $optionKey);
}

function entity_status_badge_for(PDO $pdo, string $groupKey, string $optionKey): string
{
    $label = entity_status_label_for($pdo, $groupKey, $optionKey);

    return '<span class="status-badge status-' . h($optionKey) . '">' . h($label) . '</span>';
}

function entity_type_badge_for(PDO $pdo, string $groupKey, ?string $optionKey): string
{
    if ($optionKey === null || $optionKey === '') {
        return '<span class="cell-muted">—</span>';
    }

    return '<span class="type-badge">' . h(entity_status_label_for($pdo, $groupKey, $optionKey)) . '</span>';
}

function invoice_next_number(PDO $pdo): string
{
    $year = date('Y');
    $prefix = 'KB-' . $year . '-';

    $stmt = $pdo->prepare(
        'SELECT invoice_number FROM invoices
         WHERE invoice_number LIKE :prefix
         ORDER BY id DESC
         LIMIT 1'
    );
    $stmt->execute(['prefix' => $prefix . '%']);
    $last = $stmt->fetchColumn();

    $next = 1;
    if (is_string($last) && preg_match('/KB-\d{4}-(\d+)$/', $last, $matches) === 1) {
        $next = (int) $matches[1] + 1;
    }

    return $prefix . str_pad((string) $next, 4, '0', STR_PAD_LEFT);
}
