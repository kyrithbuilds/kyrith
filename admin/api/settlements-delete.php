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

$id = (int) ($input['settlement_id'] ?? $input['id'] ?? 0);
if ($id <= 0) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Invalid settlement.']);
    exit;
}

try {
    $pdo = db();
    $adminUserId = (int) $_SESSION['admin_user_id'];

    $fetch = $pdo->prepare(
        'SELECT id, amount, from_partner_id, to_partner_id FROM settlements WHERE id = :id'
    );
    $fetch->execute(['id' => $id]);
    $row = $fetch->fetch();
    if (!$row) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'error' => 'Settlement not found.']);
        exit;
    }

    $delete = $pdo->prepare('DELETE FROM settlements WHERE id = :id');
    $delete->execute(['id' => $id]);

    activity_log($pdo, $adminUserId, 'deleted_settlement', 'settlement', $id, [
        'amount' => $row['amount'],
        'from_partner_id' => $row['from_partner_id'],
        'to_partner_id' => $row['to_partner_id'],
    ]);

    echo json_encode(['ok' => true]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not delete settlement. Please try again.']);
}
