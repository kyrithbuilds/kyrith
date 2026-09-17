<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/require_login_api.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/csrf.php';
require_once __DIR__ . '/../includes/activity-log.php';
require_once __DIR__ . '/../includes/validators.php';
require_once __DIR__ . '/../includes/lookup-options.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = api_read_json_input();
api_require_csrf($input);

$companyName = validate_required_string((string) ($input['company_name'] ?? ''), 150);
$contactName = validate_optional_string((string) ($input['contact_name'] ?? ''), 150);
$contactEmail = validate_optional_email((string) ($input['contact_email'] ?? ''));
$contactPhone = validate_optional_string((string) ($input['contact_phone'] ?? ''), 30);
$billingAddress = validate_optional_string((string) ($input['billing_address'] ?? ''), 65535);
$notes = validate_optional_string((string) ($input['notes'] ?? ''), 65535);
$status = trim((string) ($input['status'] ?? ''));

if ($companyName === null || $contactName === null || $contactEmail === null
    || $contactPhone === null || $billingAddress === null || $notes === null) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please check all fields and try again.']);
    exit;
}

try {
    $pdo = db();

    if ($status === '' || !lookup_validate_option($pdo, LOOKUP_CLIENT_STATUS, $status)) {
        $status = lookup_default_option_key($pdo, LOOKUP_CLIENT_STATUS) ?? 'lead';
    }

    $adminUserId = (int) $_SESSION['admin_user_id'];

    $stmt = $pdo->prepare(
        'INSERT INTO clients
            (company_name, contact_name, contact_email, contact_phone, billing_address, status, notes)
         VALUES
            (:company_name, :contact_name, :contact_email, :contact_phone, :billing_address, :status, :notes)'
    );
    $stmt->execute([
        'company_name' => $companyName,
        'contact_name' => $contactName !== '' ? $contactName : null,
        'contact_email' => $contactEmail !== '' ? $contactEmail : null,
        'contact_phone' => $contactPhone !== '' ? $contactPhone : null,
        'billing_address' => $billingAddress !== '' ? $billingAddress : null,
        'status' => $status,
        'notes' => $notes !== '' ? $notes : null,
    ]);

    $id = (int) $pdo->lastInsertId();
    activity_log($pdo, $adminUserId, 'created_client', 'clients', $id, [
        'company_name' => $companyName,
        'status' => $status,
    ]);

    echo json_encode(['ok' => true, 'id' => $id]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not save client. Please try again.']);
}
