<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/require_login_api.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/csrf.php';
require_once __DIR__ . '/../includes/activity-log.php';
require_once __DIR__ . '/../includes/validators.php';
require_once __DIR__ . '/../includes/entity-helpers.php';
require_once __DIR__ . '/../includes/lookup-options.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = api_read_json_input();
api_require_csrf($input);

$clientId = validate_positive_int($input['client_id'] ?? null);
$projectIdRaw = trim((string) ($input['project_id'] ?? ''));
$projectId = $projectIdRaw !== '' ? validate_positive_int($projectIdRaw) : null;
$invoiceNumber = validate_required_string((string) ($input['invoice_number'] ?? ''), 40);
$status = trim((string) ($input['status'] ?? ''));
$issueDate = trim((string) ($input['issue_date'] ?? ''));
$dueDate = trim((string) ($input['due_date'] ?? ''));
$subtotal = validate_non_negative_amount($input['subtotal_amount'] ?? null);
$tax = validate_non_negative_amount($input['tax_amount'] ?? 0);
$total = validate_non_negative_amount($input['total_amount'] ?? null);
$notes = validate_optional_string((string) ($input['notes'] ?? ''), 65535);

if ($clientId === null || $subtotal === null || $tax === null || $total === null || $notes === null) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please check all fields and try again.']);
    exit;
}

if (!validate_date_ymd($issueDate) || !validate_date_ymd($dueDate)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please enter valid issue and due dates.']);
    exit;
}

try {
    $pdo = db();
    $adminUserId = (int) $_SESSION['admin_user_id'];

    if ($status === '' || !lookup_validate_option($pdo, LOOKUP_INVOICE_STATUS, $status)) {
        $status = lookup_default_option_key($pdo, LOOKUP_INVOICE_STATUS) ?? 'draft';
    }

    if ($invoiceNumber === null) {
        $invoiceNumber = invoice_next_number($pdo);
    }

    $clientCheck = $pdo->prepare('SELECT id FROM clients WHERE id = :id');
    $clientCheck->execute(['id' => $clientId]);
    if (!$clientCheck->fetch()) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => 'Please select a valid client.']);
        exit;
    }

    if ($projectId !== null) {
        $projectCheck = $pdo->prepare('SELECT id FROM projects WHERE id = :id AND client_id = :client_id');
        $projectCheck->execute(['id' => $projectId, 'client_id' => $clientId]);
        if (!$projectCheck->fetch()) {
            http_response_code(422);
            echo json_encode(['ok' => false, 'error' => 'Selected project does not belong to this client.']);
            exit;
        }
    }

    $dup = $pdo->prepare('SELECT id FROM invoices WHERE invoice_number = :invoice_number');
    $dup->execute(['invoice_number' => $invoiceNumber]);
    if ($dup->fetch()) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => 'Invoice number already exists.']);
        exit;
    }

    $stmt = $pdo->prepare(
        'INSERT INTO invoices
            (client_id, project_id, invoice_number, status, issue_date, due_date,
             subtotal_amount, tax_amount, total_amount, notes)
         VALUES
            (:client_id, :project_id, :invoice_number, :status, :issue_date, :due_date,
             :subtotal_amount, :tax_amount, :total_amount, :notes)'
    );
    $stmt->execute([
        'client_id' => $clientId,
        'project_id' => $projectId,
        'invoice_number' => $invoiceNumber,
        'status' => $status,
        'issue_date' => $issueDate,
        'due_date' => $dueDate,
        'subtotal_amount' => $subtotal,
        'tax_amount' => $tax,
        'total_amount' => $total,
        'notes' => $notes !== '' ? $notes : null,
    ]);

    $id = (int) $pdo->lastInsertId();
    activity_log($pdo, $adminUserId, 'created_invoice', 'invoices', $id, [
        'invoice_number' => $invoiceNumber,
        'total_amount' => $total,
    ]);

    echo json_encode(['ok' => true, 'id' => $id]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not save invoice. Please try again.']);
}
