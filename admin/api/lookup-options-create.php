<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/require_login_api.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/csrf.php';
require_once __DIR__ . '/../includes/activity-log.php';
require_once __DIR__ . '/../includes/validators.php';
require_once __DIR__ . '/../includes/lookup-options.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = api_read_json_input();
api_require_csrf($input);

$groupKey = validate_required_string((string) ($input['group_key'] ?? ''), 40);
$label = validate_required_string((string) ($input['label'] ?? ''), 80);

$allowedGroups = [LOOKUP_CLIENT_STATUS, LOOKUP_PROJECT_STATUS, LOOKUP_PROJECT_TYPE, LOOKUP_INVOICE_STATUS];
if ($groupKey === null || $label === null || !in_array($groupKey, $allowedGroups, true)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please enter a valid label.']);
    exit;
}

try {
    $pdo = db();
    $adminUserId = (int) $_SESSION['admin_user_id'];
    $baseKey = lookup_slug_from_label($label);
    $optionKey = lookup_unique_option_key($pdo, $groupKey, $baseKey);

    $sortStmt = $pdo->prepare(
        'SELECT COALESCE(MAX(sort_order), 0) FROM lookup_options WHERE group_key = :group_key'
    );
    $sortStmt->execute(['group_key' => $groupKey]);
    $sortOrder = (int) $sortStmt->fetchColumn() + 10;

    $stmt = $pdo->prepare(
        'INSERT INTO lookup_options (group_key, option_key, label, sort_order)
         VALUES (:group_key, :option_key, :label, :sort_order)'
    );
    $stmt->execute([
        'group_key' => $groupKey,
        'option_key' => $optionKey,
        'label' => $label,
        'sort_order' => $sortOrder,
    ]);

    $id = (int) $pdo->lastInsertId();
    activity_log($pdo, $adminUserId, 'created_lookup_option', 'lookup_options', $id, [
        'group_key' => $groupKey,
        'label' => $label,
    ]);

    echo json_encode(['ok' => true, 'id' => $id, 'option_key' => $optionKey]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not add option. Please try again.']);
}
