<?php

declare(strict_types=1);

/**
 * @return array<string, mixed>
 */
function api_read_json_input(): array
{
    $input = json_decode((string) file_get_contents('php://input'), true);
    return is_array($input) ? $input : $_POST;
}

function api_require_csrf(array $input): void
{
    $token = (string) ($input['csrf_token'] ?? '');
    if (!csrf_validate($token)) {
        http_response_code(403);
        echo json_encode(['ok' => false, 'error' => 'Session expired. Please refresh and try again.']);
        exit;
    }
}

function validate_positive_amount(mixed $raw): ?float
{
    if (!is_numeric($raw) || (float) $raw <= 0) {
        return null;
    }

    return round((float) $raw, 2);
}

function validate_date_ymd(string $date): bool
{
    $dateObj = DateTime::createFromFormat('Y-m-d', $date);
    return $dateObj !== false && $dateObj->format('Y-m-d') === $date;
}

function validate_required_string(string $value, int $maxLen): ?string
{
    $value = trim($value);
    if ($value === '' || mb_strlen($value) > $maxLen) {
        return null;
    }

    return $value;
}

function validate_optional_string(string $value, int $maxLen): ?string
{
    $value = trim($value);
    if ($value === '') {
        return '';
    }

    if (mb_strlen($value) > $maxLen) {
        return null;
    }

    return $value;
}

/**
 * @param list<string> $allowed
 */
function validate_enum(string $value, array $allowed): ?string
{
    return in_array($value, $allowed, true) ? $value : null;
}

function validate_optional_email(string $email): ?string
{
    $email = trim($email);
    if ($email === '') {
        return '';
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 150) {
        return null;
    }

    return $email;
}

function validate_non_negative_amount(mixed $raw): ?float
{
    if (!is_numeric($raw) || (float) $raw < 0) {
        return null;
    }

    return round((float) $raw, 2);
}

function validate_positive_int(mixed $raw): ?int
{
    if (!is_numeric($raw) || (int) $raw <= 0) {
        return null;
    }

    return (int) $raw;
}
