<?php

declare(strict_types=1);

/**
 * @param array<string, mixed>|null $details
 */
function activity_log(
    PDO $pdo,
    int $adminUserId,
    string $action,
    string $entityType,
    ?int $entityId = null,
    ?array $details = null
): void {
    $stmt = $pdo->prepare(
        'INSERT INTO activity_log (admin_user_id, action, entity_type, entity_id, details, ip_address)
         VALUES (:admin_user_id, :action, :entity_type, :entity_id, :details, :ip_address)'
    );
    $stmt->execute([
        'admin_user_id' => $adminUserId,
        'action' => $action,
        'entity_type' => $entityType,
        'entity_id' => $entityId,
        'details' => $details !== null ? json_encode($details, JSON_THROW_ON_ERROR) : null,
        'ip_address' => (string) ($_SERVER['REMOTE_ADDR'] ?? null),
    ]);
}
