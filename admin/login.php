<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/session.php';
require_once __DIR__ . '/includes/paths.php';
require_once __DIR__ . '/includes/csrf.php';
require_once __DIR__ . '/includes/favicon.php';

admin_session_start();

if (admin_current_user() !== null) {
    header('Location: ' . admin_path());
    exit;
}

$error = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim((string) ($_POST['email'] ?? ''));
    $password = (string) ($_POST['password'] ?? '');
    $token = (string) ($_POST['csrf_token'] ?? '');
    $ipAddress = (string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');

    if (!csrf_validate($token)) {
        $error = 'Your session expired. Please try again.';
    } elseif ($email === '' || $password === '') {
        $error = 'Please enter your email and password.';
    } else {
        try {
            $pdo = db();

            $lockStmt = $pdo->prepare(
                'SELECT COUNT(*) FROM login_attempts
                 WHERE email = :email
                   AND succeeded = 0
                   AND attempted_at > (NOW() - INTERVAL 15 MINUTE)'
            );
            $lockStmt->execute(['email' => $email]);
            $failedAttempts = (int) $lockStmt->fetchColumn();

            if ($failedAttempts >= 5) {
                $error = 'Too many failed attempts. Please wait 15 minutes and try again.';
            } else {
                $userStmt = $pdo->prepare(
                    'SELECT id, name, email, password_hash, role, is_active
                     FROM admin_users
                     WHERE email = :email
                     LIMIT 1'
                );
                $userStmt->execute(['email' => $email]);
                $user = $userStmt->fetch();

                $loginOk = $user
                    && (int) $user['is_active'] === 1
                    && password_verify($password, (string) $user['password_hash']);

                $logStmt = $pdo->prepare(
                    'INSERT INTO login_attempts (email, ip_address, succeeded)
                     VALUES (:email, :ip_address, :succeeded)'
                );
                $logStmt->execute([
                    'email' => $email,
                    'ip_address' => $ipAddress,
                    'succeeded' => $loginOk ? 1 : 0,
                ]);

                if ($loginOk) {
                    $updateStmt = $pdo->prepare(
                        'UPDATE admin_users SET last_login_at = NOW() WHERE id = :id'
                    );
                    $updateStmt->execute(['id' => (int) $user['id']]);

                    admin_login_user([
                        'id' => (int) $user['id'],
                        'name' => (string) $user['name'],
                        'email' => (string) $user['email'],
                        'role' => (string) $user['role'],
                    ]);

                    header('Location: ' . admin_path());
                    exit;
                }

                $error = 'Invalid email or password.';
            }
        } catch (Throwable $e) {
            $message = $e->getMessage();
            if (str_contains($message, 'config.local.php')) {
                $error = 'Database config is missing on the server. Add config.local.php and try again.';
            } else {
                $error = 'Unable to sign in right now. Please try again shortly.';
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sign in — KyrithBuilds Admin</title>
    <?= admin_favicon_tags() ?>
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body class="auth-page">
    <div class="auth-card">
        <h1 class="auth-brand">KyrithBuilds Admin</h1>
        <p class="auth-subtitle">Sign in to manage finances</p>

        <?php if ($error !== ''): ?>
            <div class="alert alert-error"><?= h($error) ?></div>
        <?php endif; ?>

        <form method="post" action="<?= h(admin_path('login')) ?>" autocomplete="on" id="login-form" novalidate>
            <?= csrf_field() ?>
            <div class="form-group">
                <label for="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value="<?= h($email) ?>"
                    required
                    autocomplete="username"
                    autofocus
                    placeholder="you@company.com"
                >
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    autocomplete="current-password"
                    placeholder="Your password"
                >
            </div>
            <button type="submit" class="btn" id="login-submit">Sign in</button>
        </form>
    </div>
    <script src="/assets/js/ui-feedback.js" defer></script>
    <script>
    document.addEventListener('DOMContentLoaded', function () {
        const form = document.getElementById('login-form');
        const ui = window.KB_ui;
        if (!form || !ui) return;

        let busy = false;
        form.addEventListener('submit', function (e) {
            if (busy) {
                e.preventDefault();
                return;
            }
            ui.clearFieldErrors(form);
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            let hasError = false;
            if (!email.value.trim()) {
                ui.setFieldError('email', 'Enter your email address.');
                hasError = true;
            }
            if (!password.value) {
                ui.setFieldError('password', 'Enter your password.');
                hasError = true;
            }
            if (hasError) {
                e.preventDefault();
                return;
            }
            const btn = document.getElementById('login-submit');
            ui.setButtonLoading(btn, 'Signing in…');
            busy = true;
        });
    });
    </script>
</body>
</html>
