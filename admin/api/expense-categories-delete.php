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
if ($id === null) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Invalid category.']);
    exit;
}

try {
    $pdo = db();
    $adminUserId = (int) $_SESSION['admin_user_id'];

    $usage = $pdo->prepare('SELECT COUNT(*) FROM expenses WHERE category_id = :id');
    $usage->execute(['id' => $id]);
    if ((int) $usage->fetchColumn() > 0) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => 'Cannot delete — category is in use.']);
        exit;
    }

    $stmt = $pdo->prepare('DELETE FROM expense_categories WHERE id = :id');
    $stmt->execute(['id' => $id]);

    activity_log($pdo, $adminUserId, 'deleted_expense_category', 'expense_categories', $id, []);

    echo json_encode(['ok' => true]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not delete category. Please try again.']);
}
