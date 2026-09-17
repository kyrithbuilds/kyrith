<?php

declare(strict_types=1);

/**
 * @var string $placeholderTitle
 * @var string $placeholderMessage
 */
require_once __DIR__ . '/includes/require_login.php';

$pageTitle = $placeholderTitle;
$currentPage = $placeholderKey ?? '';

require __DIR__ . '/includes/layout-top.php';
?>

<div class="placeholder-page">
    <h1><?= h($placeholderTitle) ?></h1>
    <p><?= h($placeholderMessage) ?></p>
</div>

<?php require __DIR__ . '/includes/layout-bottom.php'; ?>
