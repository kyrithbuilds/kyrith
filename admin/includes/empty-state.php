<?php

declare(strict_types=1);

require_once __DIR__ . '/csrf.php';

/**
 * @param array{
 *   colspan: int,
 *   icon: string,
 *   title: string,
 *   message: string,
 *   action_id?: string,
 *   action_label?: string,
 *   clear_url?: string,
 *   clear_label?: string
 * } $config
 */
function render_table_empty_state(array $config): void
{
    $colspan = (int) $config['colspan'];
    $icon = (string) $config['icon'];
    $title = (string) $config['title'];
    $message = (string) $config['message'];
    $actionId = (string) ($config['action_id'] ?? '');
    $actionLabel = (string) ($config['action_label'] ?? '');
    $clearUrl = (string) ($config['clear_url'] ?? '');
    $clearLabel = (string) ($config['clear_label'] ?? 'Clear filter');
    ?>
    <tr class="empty-state-row">
        <td colspan="<?= $colspan ?>">
            <div class="empty-state">
                <div class="empty-state-icon" aria-hidden="true"><?= $icon ?></div>
                <p class="empty-state-title"><?= h($title) ?></p>
                <p class="empty-state-message"><?= h($message) ?></p>
                <div class="empty-state-actions">
                    <?php if ($actionId !== '' && $actionLabel !== ''): ?>
                        <button type="button" class="btn btn-inline btn-small empty-state-action" data-trigger-for="<?= h($actionId) ?>">
                            <?= h($actionLabel) ?>
                        </button>
                    <?php endif; ?>
                    <?php if ($clearUrl !== ''): ?>
                        <a href="<?= h($clearUrl) ?>" class="btn btn-secondary btn-inline btn-small"><?= h($clearLabel) ?></a>
                    <?php endif; ?>
                </div>
            </div>
        </td>
    </tr>
    <?php
}

function empty_state_icon_inbox(): string
{
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M22 12H16l-3 3-3-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>';
}

function empty_state_icon_users(): string
{
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>';
}

function empty_state_icon_folder(): string
{
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>';
}

function empty_state_icon_file(): string
{
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>';
}

function empty_state_icon_wallet(): string
{
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M16 14h.01"/></svg>';
}
