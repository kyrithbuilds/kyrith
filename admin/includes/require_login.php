<?php

declare(strict_types=1);

require_once __DIR__ . '/session.php';
require_once __DIR__ . '/paths.php';

admin_session_start();

if (empty($_SESSION['admin_user_id'])) {
    header('Location: ' . admin_path('login'));
    exit;
}
