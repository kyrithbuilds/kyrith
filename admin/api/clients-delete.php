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
    echo json_encode(['ok' => false, 'error' => 'Invalid client.']);
    exit;
}

try {
    $pdo = db();
    $adminUserId = (int) $_SESSION['admin_user_id'];

    $row = $pdo->prepare('SELECT id, company_name FROM clients WHERE id = :id');
    $row->execute(['id' => $id]);
    $client = $row->fetch();
    if (!$client) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'error' => 'Client not found.']);
        exit;
    }

    $projectCount = $pdo->prepare('SELECT COUNT(*) FROM projects WHERE client_id = :id');
    $projectCount->execute(['id' => $id]);
    if ((int) $projectCount->fetchColumn() > 0) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => 'This client has projects. Delete or reassign them first.']);
        exit;
    }

    $invoiceCount = $pdo->prepare('SELECT COUNT(*) FROM invoices WHERE client_id = :id');
    $invoiceCount->execute(['id' => $id]);
    if ((int) $invoiceCount->fetchColumn() > 0) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => 'This client has invoices. Delete or reassign them first.']);
        exit;
    }

    $stmt = $pdo->prepare('DELETE FROM clients WHERE id = :id');
    $stmt->execute(['id' => $id]);

    activity_log($pdo, $adminUserId, 'deleted_client', 'clients', $id, [
        'company_name' => $client['company_name'],
    ]);

    echo json_encode(['ok' => true]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not delete client. Please try again.']);
}
