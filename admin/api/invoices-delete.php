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
    echo json_encode(['ok' => false, 'error' => 'Invalid invoice.']);
    exit;
}

try {
    $pdo = db();
    $adminUserId = (int) $_SESSION['admin_user_id'];

    $row = $pdo->prepare('SELECT id, invoice_number FROM invoices WHERE id = :id');
    $row->execute(['id' => $id]);
    $invoice = $row->fetch();
    if (!$invoice) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'error' => 'Invoice not found.']);
        exit;
    }

    $itemCount = $pdo->prepare('SELECT COUNT(*) FROM invoice_items WHERE invoice_id = :id');
    $itemCount->execute(['id' => $id]);
    if ((int) $itemCount->fetchColumn() > 0) {
        $pdo->prepare('DELETE FROM invoice_items WHERE invoice_id = :id')->execute(['id' => $id]);
    }

    $stmt = $pdo->prepare('DELETE FROM invoices WHERE id = :id');
    $stmt->execute(['id' => $id]);

    activity_log($pdo, $adminUserId, 'deleted_invoice', 'invoices', $id, [
        'invoice_number' => $invoice['invoice_number'],
    ]);

    echo json_encode(['ok' => true]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not delete invoice. Please try again.']);
}
