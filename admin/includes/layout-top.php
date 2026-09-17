<?php

declare(strict_types=1);

/** @var string $pageTitle */
/** @var string $currentPage */

require_once __DIR__ . '/csrf.php';
require_once __DIR__ . '/paths.php';
require_once __DIR__ . '/favicon.php';

$user = admin_current_user();
$navItems = [
    'dashboard' => ['label' => 'Dashboard', 'href' => admin_path()],
    'income' => ['label' => 'Income', 'href' => admin_path('income')],
    'expenses' => ['label' => 'Expenses', 'href' => admin_path('expenses')],
    'settlements' => ['label' => 'Settlements', 'href' => admin_path('settlements')],
    'clients' => ['label' => 'Clients', 'href' => admin_path('clients')],
    'projects' => ['label' => 'Projects', 'href' => admin_path('projects')],
    'invoices' => ['label' => 'Invoices', 'href' => admin_path('invoices')],
    'settings' => ['label' => 'Settings', 'href' => admin_path('settings')],
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= h($pageTitle) ?> — KyrithBuilds Admin</title>
    <?= admin_favicon_tags() ?>
    <link rel="stylesheet" href="/assets/css/style.css">
    <?php if (!empty($extraHead)) {
        echo $extraHead;
    } ?>
</head>
<body class="admin-body">
    <div class="admin-shell">
        <header class="admin-topbar">
            <button type="button" class="nav-toggle" id="nav-toggle" aria-label="Open menu">☰</button>
            <div class="topbar-brand">KyrithBuilds Admin</div>
            <div class="topbar-user">
                <span><?= h($user['name'] ?? '') ?></span>
                <a href="<?= h(admin_path('logout')) ?>" class="topbar-logout">Sign out</a>
            </div>
        </header>

        <aside class="admin-sidebar" id="admin-sidebar">
            <div class="sidebar-brand">Finance</div>
            <nav class="sidebar-nav">
                <?php foreach ($navItems as $key => $item): ?>
                    <a
                        href="<?= h($item['href']) ?>"
                        class="sidebar-link<?= ($currentPage ?? '') === $key ? ' is-active' : '' ?>"
                    ><?= h($item['label']) ?></a>
                <?php endforeach; ?>
            </nav>
        </aside>

        <div class="sidebar-backdrop" id="sidebar-backdrop" hidden></div>

        <main class="admin-main">
