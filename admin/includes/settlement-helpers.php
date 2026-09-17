<?php

declare(strict_types=1);

require_once __DIR__ . '/validators.php';

/**
 * @return array{
 *   from_partner_id: int,
 *   to_partner_id: int,
 *   amount: float,
 *   settlement_date: string,
 *   note: ?string
 * }|null
 */
function settlement_parse_input(array $input): ?array
{
    $fromPartnerId = (int) ($input['from_partner_id'] ?? 0);
    $toPartnerId = (int) ($input['to_partner_id'] ?? 0);
    $amount = validate_positive_amount($input['amount'] ?? null);
    $settlementDate = trim((string) ($input['settlement_date'] ?? ''));
    $note = trim((string) ($input['note'] ?? ''));

    if ($fromPartnerId <= 0 || $toPartnerId <= 0 || $fromPartnerId === $toPartnerId) {
        return null;
    }

    if ($amount === null || !validate_date_ymd($settlementDate)) {
        return null;
    }

    if (mb_strlen($note) > 255) {
        return null;
    }

    return [
        'from_partner_id' => $fromPartnerId,
        'to_partner_id' => $toPartnerId,
        'amount' => $amount,
        'settlement_date' => $settlementDate,
        'note' => $note !== '' ? $note : null,
    ];
}

function settlement_validate_partners(PDO $pdo, int $fromId, int $toId): bool
{
    $partnerCheck = $pdo->prepare(
        'SELECT COUNT(*) FROM partners WHERE id IN (:from_id, :to_id) AND is_active = 1'
    );
    $partnerCheck->execute(['from_id' => $fromId, 'to_id' => $toId]);

    return (int) $partnerCheck->fetchColumn() === 2;
}
