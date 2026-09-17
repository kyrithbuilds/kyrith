<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/require_login_api.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/csrf.php';
require_once __DIR__ . '/../includes/activity-log.php';
require_once __DIR__ . '/../includes/validators.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = api_read_json_input();
api_require_csrf($input);

$id = validate_positive_int($input['id'] ?? null);
$name = validate_required_string((string) ($input['name'] ?? ''), 60);
$isActive = !empty($input['is_active']) ? 1 : 0;

if ($id === null || $name === null) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please check all fields and try again.']);
    exit;
}

try {
    $pdo = db();
    $adminUserId = (int) $_SESSION['admin_user_id'];

    if ($isActive === 0) {
        $usage = $pdo->prepare('SELECT COUNT(*) FROM expenses WHERE category_id = :id');
        $usage->execute(['id' => $id]);
        if ((int) $usage->fetchColumn() > 0) {
            http_response_code(422);
            echo json_encode(['ok' => false, 'error' => 'Cannot deactivate — category is in use.']);
            exit;
        }
    }

    $stmt = $pdo->prepare('UPDATE expense_categories SET name = :name, is_active = :is_active WHERE id = :id');
    $stmt->execute(['id' => $id, 'name' => $name, 'is_active' => $isActive]);

    activity_log($pdo, $adminUserId, 'updated_expense_category', 'expense_categories', $id, ['name' => $name]);

    echo json_encode(['ok' => true, 'id' => $id]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not update category. Please try again.']);
}
