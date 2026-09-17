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

$id = (int) ($input['id'] ?? 0);
if ($id <= 0) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Invalid record.']);
    exit;
}

try {
    $pdo = db();
    $adminUserId = (int) $_SESSION['admin_user_id'];

    $fetch = $pdo->prepare('SELECT id, name, amount FROM expenses WHERE id = :id');
    $fetch->execute(['id' => $id]);
    $row = $fetch->fetch();
    if (!$row) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'error' => 'Expense record not found.']);
        exit;
    }

    $delete = $pdo->prepare('DELETE FROM expenses WHERE id = :id');
    $delete->execute(['id' => $id]);

    activity_log($pdo, $adminUserId, 'deleted_expense', 'expense', $id, [
        'name' => $row['name'],
        'amount' => $row['amount'],
    ]);

    echo json_encode(['ok' => true]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not delete expense. Please try again.']);
}
