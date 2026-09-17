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
if ($id === null) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Invalid option.']);
    exit;
}

try {
    $pdo = db();
    $adminUserId = (int) $_SESSION['admin_user_id'];

    $row = $pdo->prepare('SELECT id, group_key, option_key, label FROM lookup_options WHERE id = :id');
    $row->execute(['id' => $id]);
    $option = $row->fetch();
    if (!$option) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'error' => 'Option not found.']);
        exit;
    }

    $usage = lookup_option_usage_count($pdo, (string) $option['group_key'], (string) $option['option_key']);
    if ($usage > 0) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => 'Cannot delete — this option is in use. Deactivate it instead.']);
        exit;
    }

    $stmt = $pdo->prepare('DELETE FROM lookup_options WHERE id = :id');
    $stmt->execute(['id' => $id]);

    activity_log($pdo, $adminUserId, 'deleted_lookup_option', 'lookup_options', $id, [
        'label' => $option['label'],
    ]);

    echo json_encode(['ok' => true]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not delete option. Please try again.']);
}
