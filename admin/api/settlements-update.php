<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/require_login_api.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/csrf.php';
require_once __DIR__ . '/../includes/activity-log.php';
require_once __DIR__ . '/../includes/validators.php';
require_once __DIR__ . '/../includes/settlement-helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = api_read_json_input();
api_require_csrf($input);

$id = (int) ($input['settlement_id'] ?? $input['id'] ?? 0);
$parsed = settlement_parse_input($input);

if ($id <= 0 || $parsed === null) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please check all fields. From and To must be different partners.']);
    exit;
}

try {
    $pdo = db();
    $adminUserId = (int) $_SESSION['admin_user_id'];

    $exists = $pdo->prepare('SELECT id FROM settlements WHERE id = :id');
    $exists->execute(['id' => $id]);
    if (!$exists->fetch()) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'error' => 'Settlement not found.']);
        exit;
    }

    if (!settlement_validate_partners($pdo, $parsed['from_partner_id'], $parsed['to_partner_id'])) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => 'Invalid partner selected.']);
        exit;
    }

    $stmt = $pdo->prepare(
        'UPDATE settlements SET
            from_partner_id = :from_partner_id,
            to_partner_id = :to_partner_id,
            amount = :amount,
            settlement_date = :settlement_date,
            note = :note
         WHERE id = :id'
    );
    $stmt->execute([
        'id' => $id,
        'from_partner_id' => $parsed['from_partner_id'],
        'to_partner_id' => $parsed['to_partner_id'],
        'amount' => $parsed['amount'],
        'settlement_date' => $parsed['settlement_date'],
        'note' => $parsed['note'],
    ]);

    activity_log($pdo, $adminUserId, 'updated_settlement', 'settlement', $id, [
        'from_partner_id' => $parsed['from_partner_id'],
        'to_partner_id' => $parsed['to_partner_id'],
        'amount' => $parsed['amount'],
        'settlement_date' => $parsed['settlement_date'],
    ]);

    echo json_encode(['ok' => true, 'id' => $id]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not update settlement. Please try again.']);
}
