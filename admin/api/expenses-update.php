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
$name = validate_required_string((string) ($input['name'] ?? ''), 150);
$description = trim((string) ($input['description'] ?? ''));
$expenseDate = trim((string) ($input['expense_date'] ?? ''));
$amount = validate_positive_amount($input['amount'] ?? null);
$categoryId = (int) ($input['category_id'] ?? 0);
$partnerId = (int) ($input['paid_by_partner_id'] ?? 0);

if ($id <= 0 || $name === null || $amount === null || !validate_date_ymd($expenseDate)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please check all fields and try again.']);
    exit;
}

if ($categoryId <= 0 || $partnerId <= 0) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please select a category and partner.']);
    exit;
}

try {
    $pdo = db();
    $adminUserId = (int) $_SESSION['admin_user_id'];

    $exists = $pdo->prepare('SELECT id FROM expenses WHERE id = :id');
    $exists->execute(['id' => $id]);
    if (!$exists->fetch()) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'error' => 'Expense record not found.']);
        exit;
    }

    $catCheck = $pdo->prepare('SELECT id FROM expense_categories WHERE id = :id AND is_active = 1');
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
        'UPDATE expenses SET
            name = :name,
            description = :description,
            expense_date = :expense_date,
            amount = :amount,
            category_id = :category_id,
            paid_by_partner_id = :paid_by_partner_id
         WHERE id = :id'
    );
    $stmt->execute([
        'id' => $id,
        'name' => $name,
        'description' => $description !== '' ? $description : null,
        'expense_date' => $expenseDate,
        'amount' => $amount,
        'category_id' => $categoryId,
        'paid_by_partner_id' => $partnerId,
    ]);

    activity_log($pdo, $adminUserId, 'updated_expense', 'expense', $id, [
        'name' => $name,
        'amount' => $amount,
        'expense_date' => $expenseDate,
    ]);

    echo json_encode(['ok' => true, 'id' => $id]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not update expense. Please try again.']);
}
