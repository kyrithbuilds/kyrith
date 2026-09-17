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

$id = validate_positive_int($input['id'] ?? null);
$clientId = validate_positive_int($input['client_id'] ?? null);
$name = validate_required_string((string) ($input['name'] ?? ''), 150);
$description = validate_optional_string((string) ($input['description'] ?? ''), 65535);
$status = trim((string) ($input['status'] ?? ''));
$projectType = trim((string) ($input['project_type'] ?? ''));
$startDate = trim((string) ($input['start_date'] ?? ''));
$budgetRaw = trim((string) ($input['budget_amount'] ?? ''));

if ($id === null || $clientId === null || $name === null || $description === null) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please check all fields and try again.']);
    exit;
}

try {
    $pdo = db();

    if ($status === '' || !lookup_validate_option($pdo, LOOKUP_PROJECT_STATUS, $status)) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => 'Please select a valid status.']);
        exit;
    }

    $hasProjectType = lookup_schema_has_column($pdo, 'projects', 'project_type');

    if ($projectType !== '' && $hasProjectType && !lookup_validate_option($pdo, LOOKUP_PROJECT_TYPE, $projectType)) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => 'Please select a valid project type.']);
        exit;
    }

    if ($startDate !== '' && !validate_date_ymd($startDate)) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => 'Invalid start date.']);
        exit;
    }

    $budgetAmount = null;
    if ($budgetRaw !== '') {
        $budgetAmount = validate_positive_amount($budgetRaw);
        if ($budgetAmount === null) {
            http_response_code(422);
            echo json_encode(['ok' => false, 'error' => 'Budget must be a positive amount.']);
            exit;
        }
    }

    $adminUserId = (int) $_SESSION['admin_user_id'];

    $exists = $pdo->prepare('SELECT id FROM projects WHERE id = :id');
    $exists->execute(['id' => $id]);
    if (!$exists->fetch()) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'error' => 'Project not found.']);
        exit;
    }

    $clientCheck = $pdo->prepare('SELECT id FROM clients WHERE id = :id');
    $clientCheck->execute(['id' => $clientId]);
    if (!$clientCheck->fetch()) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => 'Please select a valid client.']);
        exit;
    }

    if ($hasProjectType) {
        $stmt = $pdo->prepare(
            'UPDATE projects SET
                client_id = :client_id,
                name = :name,
                description = :description,
                status = :status,
                project_type = :project_type,
                start_date = :start_date,
                budget_amount = :budget_amount
             WHERE id = :id'
        );
        $stmt->execute([
            'id' => $id,
            'client_id' => $clientId,
            'name' => $name,
            'description' => $description !== '' ? $description : null,
            'status' => $status,
            'project_type' => $projectType !== '' ? $projectType : null,
            'start_date' => $startDate !== '' ? $startDate : null,
            'budget_amount' => $budgetAmount,
        ]);
    } else {
        $stmt = $pdo->prepare(
            'UPDATE projects SET
                client_id = :client_id,
                name = :name,
                description = :description,
                status = :status,
                start_date = :start_date,
                budget_amount = :budget_amount
             WHERE id = :id'
        );
        $stmt->execute([
            'id' => $id,
            'client_id' => $clientId,
            'name' => $name,
            'description' => $description !== '' ? $description : null,
            'status' => $status,
            'start_date' => $startDate !== '' ? $startDate : null,
            'budget_amount' => $budgetAmount,
        ]);
    }

    activity_log($pdo, $adminUserId, 'updated_project', 'projects', $id, [
        'name' => $name,
        'client_id' => $clientId,
    ]);

    echo json_encode(['ok' => true, 'id' => $id]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not update project. Please try again.']);
}
