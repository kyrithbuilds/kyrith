<?php

declare(strict_types=1);

/**
 * Favicon tags — same assets as kyrithbuilds.com (main site).
 */
function admin_favicon_tags(): string
{
    $base = 'https://kyrithbuilds.com';

    return implode("\n    ", [
        '<link rel="icon" href="' . $base . '/favicon.ico" sizes="any">',
        '<link rel="icon" type="image/png" sizes="32x32" href="' . $base . '/favicon-32x32.png">',
        '<link rel="icon" type="image/png" sizes="16x16" href="' . $base . '/favicon-16x16.png">',
        '<link rel="apple-touch-icon" sizes="180x180" href="' . $base . '/apple-touch-icon.png">',
    ]);
}
