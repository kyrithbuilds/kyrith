<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/session.php';
require_once __DIR__ . '/includes/paths.php';

admin_session_start();
admin_logout_user();

header('Location: ' . admin_path('login'));
exit;
