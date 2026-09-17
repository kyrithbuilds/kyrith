<?php

declare(strict_types=1);

require_once __DIR__ . '/session.php';

admin_session_start();

header('Content-Type: application/json; charset=utf-8');

if (empty($_SESSION['admin_user_id'])) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'Unauthorized']);
    exit;
}
