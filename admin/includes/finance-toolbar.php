<?php

declare(strict_types=1);

require_once __DIR__ . '/csrf.php';

/**
 * @param list<array<string, mixed>> $rows
 */
function finance_render_toolbar(
    string $pageUrl,
    string $range,
    string $customFrom,
    string $customTo,
    string $sort,
    string $dir,
    int $totalCount
): void {
    $ranges = [
        'month' => 'This month',
        '3months' => 'Last 3 months',
        'year' => 'This year',
        'all' => 'All time',
        'custom' => 'Custom range',
    ];
    ?>
    <div class="toolbar">
        <form class="toolbar-filters" method="get" action="<?= h($pageUrl) ?>">
            <input type="hidden" name="sort" value="<?= h($sort) ?>">
            <input type="hidden" name="dir" value="<?= h($dir) ?>">
            <label class="toolbar-label" for="range">Date range</label>
            <select name="range" id="range" class="toolbar-select">
                <?php foreach ($ranges as $key => $label): ?>
                    <option value="<?= h($key) ?>"<?= $range === $key ? ' selected' : '' ?>><?= h($label) ?></option>
                <?php endforeach; ?>
            </select>
            <span class="custom-range-fields<?= $range === 'custom' ? '' : ' is-hidden' ?>" id="custom-range-fields">
                <input type="date" name="from" value="<?= h($customFrom) ?>" aria-label="From date">
                <input type="date" name="to" value="<?= h($customTo) ?>" aria-label="To date">
            </span>
            <button type="submit" class="btn btn-secondary btn-inline btn-small">Apply</button>
        </form>
        <div class="toolbar-meta"><?= (int) $totalCount ?> record<?= $totalCount === 1 ? '' : 's' ?></div>
    </div>
    <?php
}

function finance_sort_link(string $pageUrl, string $column, string $label, string $currentSort, string $currentDir, string $range, string $from, string $to): string
{
    $nextDir = ($currentSort === $column && $currentDir === 'asc') ? 'desc' : 'asc';
    $arrow = '';
    if ($currentSort === $column) {
        $arrow = $currentDir === 'asc' ? ' ↑' : ' ↓';
    }

    $query = http_build_query([
        'range' => $range,
        'from' => $from,
        'to' => $to,
        'sort' => $column,
        'dir' => $nextDir,
    ]);

    return '<a class="sort-link" href="' . h($pageUrl . '?' . $query) . '">' . h($label) . $arrow . '</a>';
}
