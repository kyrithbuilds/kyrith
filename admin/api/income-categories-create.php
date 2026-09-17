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

$name = validate_required_string((string) ($input['name'] ?? ''), 60);
if ($name === null) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please enter a category name.']);
    exit;
}

try {
    $pdo = db();
    $adminUserId = (int) $_SESSION['admin_user_id'];

    $stmt = $pdo->prepare('INSERT INTO income_categories (name) VALUES (:name)');
    $stmt->execute(['name' => $name]);

    $id = (int) $pdo->lastInsertId();
    activity_log($pdo, $adminUserId, 'created_income_category', 'income_categories', $id, ['name' => $name]);

    echo json_encode(['ok' => true, 'id' => $id]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not add category. It may already exist.']);
}
