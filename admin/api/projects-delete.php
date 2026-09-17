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
    echo json_encode(['ok' => false, 'error' => 'Invalid project.']);
    exit;
}

try {
    $pdo = db();
    $adminUserId = (int) $_SESSION['admin_user_id'];

    $row = $pdo->prepare('SELECT id, name FROM projects WHERE id = :id');
    $row->execute(['id' => $id]);
    $project = $row->fetch();
    if (!$project) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'error' => 'Project not found.']);
        exit;
    }

    $invoiceCount = $pdo->prepare('SELECT COUNT(*) FROM invoices WHERE project_id = :id');
    $invoiceCount->execute(['id' => $id]);
    if ((int) $invoiceCount->fetchColumn() > 0) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => 'This project has invoices. Delete or reassign them first.']);
        exit;
    }

    $incomeCount = $pdo->prepare('SELECT COUNT(*) FROM income WHERE project_id = :id');
    $incomeCount->execute(['id' => $id]);
    if ((int) $incomeCount->fetchColumn() > 0) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => 'This project is linked to income records. Unlink them first.']);
        exit;
    }

    $expenseCount = $pdo->prepare('SELECT COUNT(*) FROM expenses WHERE project_id = :id');
    $expenseCount->execute(['id' => $id]);
    if ((int) $expenseCount->fetchColumn() > 0) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => 'This project is linked to expense records. Unlink them first.']);
        exit;
    }

    $stmt = $pdo->prepare('DELETE FROM projects WHERE id = :id');
    $stmt->execute(['id' => $id]);

    activity_log($pdo, $adminUserId, 'deleted_project', 'projects', $id, [
        'name' => $project['name'],
    ]);

    echo json_encode(['ok' => true]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not delete project. Please try again.']);
}
