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

$name = validate_required_string((string) ($input['name'] ?? ''), 150);
$description = trim((string) ($input['description'] ?? ''));
$incomeDate = trim((string) ($input['income_date'] ?? ''));
$amount = validate_positive_amount($input['amount'] ?? null);
$categoryId = (int) ($input['category_id'] ?? 0);
$partnerId = (int) ($input['received_by_partner_id'] ?? 0);

if ($name === null || $amount === null || !validate_date_ymd($incomeDate)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please check all fields and try again.']);
    exit;
}

if ($categoryId <= 0 || $partnerId <= 0) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please select a category and partner.']);
    exit;
}

if (mb_strlen($description) > 65535) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Description is too long.']);
    exit;
}

try {
    $pdo = db();
    $adminUserId = (int) $_SESSION['admin_user_id'];

    $catCheck = $pdo->prepare('SELECT id FROM income_categories WHERE id = :id AND is_active = 1');
    $catCheck->execute(['id' => $categoryId]);
    if (!$catCheck->fetch()) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => 'Invalid category.']);
        exit;
    }

    $partnerCheck = $pdo->prepare('SELECT id FROM partners WHERE id = :id AND is_active = 1');
    $partnerCheck->execute(['id' => $partnerId]);
    if (!$partnerCheck->fetch()) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => 'Invalid partner.']);
        exit;
    }

    $stmt = $pdo->prepare(
        'INSERT INTO income
            (name, description, income_date, amount, category_id, received_by_partner_id, created_by)
         VALUES
            (:name, :description, :income_date, :amount, :category_id, :received_by_partner_id, :created_by)'
    );
    $stmt->execute([
        'name' => $name,
        'description' => $description !== '' ? $description : null,
        'income_date' => $incomeDate,
        'amount' => $amount,
        'category_id' => $categoryId,
        'received_by_partner_id' => $partnerId,
        'created_by' => $adminUserId,
    ]);

    $id = (int) $pdo->lastInsertId();
    activity_log($pdo, $adminUserId, 'created_income', 'income', $id, [
        'name' => $name,
        'amount' => $amount,
        'income_date' => $incomeDate,
    ]);

    echo json_encode(['ok' => true, 'id' => $id]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not save income. Please try again.']);
}
