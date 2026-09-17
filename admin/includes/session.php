<?php

declare(strict_types=1);

/**
 * Detect HTTPS behind cPanel / reverse proxies.
 */
function admin_is_https(): bool
{
    if (!empty($_SERVER['HTTPS']) && strtolower((string) $_SERVER['HTTPS']) !== 'off') {
        return true;
    }

    if (!empty($_SERVER['HTTP_X_FORWARDED_PROTO'])
        && strtolower((string) $_SERVER['HTTP_X_FORWARDED_PROTO']) === 'https') {
        return true;
    }

    if (!empty($_SERVER['HTTP_X_FORWARDED_SSL'])
        && strtolower((string) $_SERVER['HTTP_X_FORWARDED_SSL']) === 'on') {
        return true;
    }

    return !empty($_SERVER['SERVER_PORT']) && (int) $_SERVER['SERVER_PORT'] === 443;
}

function admin_session_save_path(): string
{
    $path = dirname(__DIR__) . '/storage/sessions';

    if (!is_dir($path)) {
        mkdir($path, 0700, true);
    }

    return $path;
}

/**
 * Start a secure PHP session (HTTPS admin subdomain).
 */
function admin_session_start(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $savePath = admin_session_save_path();
    if (!is_writable($savePath)) {
        throw new RuntimeException('Session storage is not writable: ' . $savePath);
    }

    session_save_path($savePath);

    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => admin_is_https(),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    session_name('kb_admin_session');
    session_start();
}

/**
 * @return array{id: int, name: string, email: string, role: string}|null
 */
function admin_current_user(): ?array
{
    if (empty($_SESSION['admin_user_id'])) {
        return null;
    }

    return [
        'id' => (int) $_SESSION['admin_user_id'],
        'name' => (string) ($_SESSION['admin_user_name'] ?? ''),
        'email' => (string) ($_SESSION['admin_user_email'] ?? ''),
        'role' => (string) ($_SESSION['admin_user_role'] ?? ''),
    ];
}

function admin_login_user(array $user): void
{
    session_regenerate_id(true);

    $_SESSION['admin_user_id'] = (int) $user['id'];
    $_SESSION['admin_user_name'] = (string) $user['name'];
    $_SESSION['admin_user_email'] = (string) $user['email'];
    $_SESSION['admin_user_role'] = (string) $user['role'];
}

function admin_logout_user(): void
{
    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'],
            $params['secure'],
            $params['httponly']
        );
    }

    session_destroy();
}
