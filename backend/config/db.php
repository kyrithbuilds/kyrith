<?php

/**
 * Database configuration placeholder.
 * Replace credentials when your hosting database is ready.
 */
$dbHost = getenv('DB_HOST') ?: 'localhost';
$dbName = getenv('DB_NAME') ?: 'your_database';
$dbUser = getenv('DB_USER') ?: 'your_user';
$dbPass = getenv('DB_PASS') ?: 'your_password';

// Example (uncomment and use when ready):
// $dsn = "mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4";
// $pdo = new PDO($dsn, $dbUser, $dbPass, [
//     PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
//     PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
// ]);
