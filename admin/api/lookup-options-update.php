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

$id = validate_positive_int($input['id'] ?? null);
$label = validate_required_string((string) ($input['label'] ?? ''), 80);
$isActive = !empty($input['is_active']) ? 1 : 0;

if ($id === null || $label === null) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please check all fields and try again.']);
    exit;
}

try {
    $pdo = db();
    $adminUserId = (int) $_SESSION['admin_user_id'];

    $row = $pdo->prepare('SELECT id, group_key, option_key FROM lookup_options WHERE id = :id');
    $row->execute(['id' => $id]);
    $option = $row->fetch();
    if (!$option) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'error' => 'Option not found.']);
        exit;
    }

    if ($isActive === 0) {
        $usage = lookup_option_usage_count($pdo, (string) $option['group_key'], (string) $option['option_key']);
        if ($usage > 0) {
            http_response_code(422);
            echo json_encode(['ok' => false, 'error' => 'Cannot deactivate — this option is in use.']);
            exit;
        }
    }

    $stmt = $pdo->prepare(
        'UPDATE lookup_options SET label = :label, is_active = :is_active WHERE id = :id'
    );
    $stmt->execute(['id' => $id, 'label' => $label, 'is_active' => $isActive]);

    activity_log($pdo, $adminUserId, 'updated_lookup_option', 'lookup_options', $id, [
        'label' => $label,
        'is_active' => $isActive,
    ]);

    echo json_encode(['ok' => true, 'id' => $id]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not update option. Please try again.']);
}
