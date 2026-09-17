<?php

declare(strict_types=1);

/**
 * Clean URL paths (no .php in browser). Requires .htaccess rewrite rules.
 */
function admin_path(string $page = ''): string
{
    if ($page === '' || $page === 'index' || $page === 'dashboard') {
        return '/';
    }

    return '/' . ltrim($page, '/');
}

function admin_api_path(string $endpoint): string
{
    return '/api/' . ltrim($endpoint, '/');
}
