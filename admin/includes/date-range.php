<?php

declare(strict_types=1);

require_once __DIR__ . '/validators.php';

/**
 * @return array{start: string, end: string}|null
 */
function finance_resolve_date_range(string $range, string $customFrom, string $customTo): ?array
{
    $today = new DateTimeImmutable('today');

    switch ($range) {
        case 'month':
            return [
                'start' => $today->modify('first day of this month')->format('Y-m-d'),
                'end' => $today->format('Y-m-d'),
            ];
        case '3months':
            return [
                'start' => $today->modify('-3 months')->format('Y-m-d'),
                'end' => $today->format('Y-m-d'),
            ];
        case 'year':
            return [
                'start' => $today->format('Y') . '-01-01',
                'end' => $today->format('Y-m-d'),
            ];
        case 'custom':
            if (!validate_date_ymd($customFrom) || !validate_date_ymd($customTo)) {
                return null;
            }
            if ($customFrom > $customTo) {
                return null;
            }
            return ['start' => $customFrom, 'end' => $customTo];
        case 'all':
        default:
            return null;
    }
}

/**
 * @param array{start: string, end: string}|null $bounds
 * @return array{clause: string, params: array<string, string>}
 */
function finance_date_sql_clause(?array $bounds, string $column): array
{
    if ($bounds === null) {
        return ['clause' => '', 'params' => []];
    }

    return [
        'clause' => " AND {$column} BETWEEN :date_start AND :date_end",
        'params' => [
            'date_start' => $bounds['start'],
            'date_end' => $bounds['end'],
        ],
    ];
}

/**
 * @param list<string> $allowed
 */
function finance_resolve_sort(string $sort, string $dir, array $allowed, string $default): string
{
    if (!in_array($sort, $allowed, true)) {
        $sort = $default;
    }

    $direction = strtolower($dir) === 'asc' ? 'ASC' : 'DESC';

    return $sort . ' ' . $direction;
}
