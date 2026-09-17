<?php

declare(strict_types=1);

/**
 * One-time database connection test.
 * Visit this file in your browser, confirm it works, then DELETE it from the server.
 */

header('Content-Type: text/html; charset=utf-8');

function h(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>KyrithBuilds Admin — DB Test</title>
    <style>
        body { font-family: system-ui, sans-serif; max-width: 520px; margin: 2rem auto; padding: 0 1rem; line-height: 1.5; }
        .ok { color: #0a7; }
        .fail { color: #c00; }
        ul { padding-left: 1.25rem; }
        code { background: #f0f0f0; padding: 0.1em 0.35em; border-radius: 4px; }
    </style>
</head>
<body>
<?php
try {
    require_once __DIR__ . '/includes/db.php';

    $pdo = db();

    $stmt = $pdo->query('SHOW TABLES');
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    sort($tables);

    $expected = 13;
    $count = count($tables);
    $allGood = $count === $expected;

    echo '<h1 class="ok">Database connection: OK</h1>';
    echo '<p>Connected successfully. Found <strong>' . h((string) $count) . '</strong> tables';
    echo $allGood ? ' (expected 13).' : ' — <span class="fail">expected 13, please check your schema import.</span>';
    echo '</p>';
    echo '<ul>';
    foreach ($tables as $table) {
        echo '<li>' . h((string) $table) . '</li>';
    }
    echo '</ul>';

    if ($allGood) {
        echo '<p class="ok"><strong>All good.</strong> Reply in chat that the connection test passed, then delete <code>db-test.php</code> from the server.</p>';
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo '<h1 class="fail">Database connection: FAILED</h1>';
    echo '<p>' . h($e->getMessage()) . '</p>';
    echo '<p>Check that <code>config.local.php</code> exists next to this file with the correct database host, name, username, and password.</p>';
}
?>
</body>
</html>
