<?php

declare(strict_types=1);

require_once __DIR__ . '/csrf.php';
require_once __DIR__ . '/entity-helpers.php';

/**
 * @param array<string, string> $statusOptions
 * @param list<array{id: int, company_name: string}>|null $clients
 */
function entity_render_toolbar(
    string $pageUrl,
    string $statusFilter,
    array $statusOptions,
    int $totalCount,
    string $countNoun,
    ?array $clients = null,
    int $clientFilter = 0
): void {
    $hasActiveFilter = $statusFilter !== 'all' || $clientFilter > 0;
    ?>
    <div class="toolbar">
        <form class="toolbar-filters" method="get" action="<?= h($pageUrl) ?>">
            <label class="toolbar-label" for="entity-status-filter">Status</label>
            <select name="status" id="entity-status-filter" class="toolbar-select">
                <?php foreach ($statusOptions as $value => $label): ?>
                    <option value="<?= h($value) ?>"<?= $statusFilter === $value ? ' selected' : '' ?>>
                        <?= h($label) ?>
                    </option>
                <?php endforeach; ?>
            </select>

            <?php if ($clients !== null): ?>
                <label class="toolbar-label" for="entity-client-filter">Client</label>
                <select name="client_id" id="entity-client-filter" class="toolbar-select">
                    <option value="">All clients</option>
                    <?php foreach ($clients as $client): ?>
                        <option
                            value="<?= (int) $client['id'] ?>"
                            <?= $clientFilter === (int) $client['id'] ? ' selected' : '' ?>
                        ><?= h((string) $client['company_name']) ?></option>
                    <?php endforeach; ?>
                </select>
            <?php endif; ?>

            <button type="submit" class="btn btn-inline btn-small">Apply</button>
            <?php if ($hasActiveFilter): ?>
                <a class="toolbar-clear" href="<?= h($pageUrl) ?>">Clear</a>
            <?php endif; ?>
        </form>
        <div class="toolbar-meta">
            <?= (int) $totalCount ?> <?= h($countNoun) ?><?= $totalCount === 1 ? '' : 's' ?>
        </div>
    </div>
    <?php
}
