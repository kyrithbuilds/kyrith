<?php

declare(strict_types=1);

/**
 * Returns a shared PDO connection. All queries must use prepared statements.
 */
function db(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $configPath = dirname(__DIR__) . '/config.local.php';
    if (!is_readable($configPath)) {
        throw new RuntimeException(
            'Missing config.local.php — copy config.local.example.php and add your database credentials.'
        );
    }

    /** @var array<string, string> $config */
    $config = require $configPath;

    $host = trim((string) ($config['db_host'] ?? 'localhost'));
    $name = trim((string) ($config['db_name'] ?? ''));
    $user = trim((string) ($config['db_user'] ?? ''));
    $pass = (string) ($config['db_pass'] ?? '');

    if ($name === '' || $user === '') {
        throw new RuntimeException('Database name and username are required in config.local.php.');
    }

    $dsn = 'mysql:host=' . $host . ';dbname=' . $name . ';charset=utf8mb4';

    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}
