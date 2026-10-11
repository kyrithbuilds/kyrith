<?php

declare(strict_types=1);

// Warnings/notices before JSON break the frontend parser and look like a generic 502.
ini_set('display_errors', '0');
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $cfgPath = __DIR__ . '/config.local.php';
    $cfgOk = is_readable($cfgPath);
    $keySet = false;
    if ($cfgOk) {
        /** @var array<string, mixed> $probe */
        $probe = require $cfgPath;
        $k = preg_replace('/\s+/', '', (string) ($probe['resend_api_key'] ?? ''));
        $keySet = strlen($k) > 10;
    }
    echo json_encode([
        'ok' => true,
        'service' => 'contact',
        'curl' => function_exists('curl_init'),
        'config_file_readable' => $cfgOk,
        'resend_api_key_configured' => $keySet,
        'hint' => 'POST JSON {name,email,message} to send mail. If curl is false or config is false, fix PHP/hosting first.',
    ]);
    exit;
}

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$configPath = __DIR__ . '/config.local.php';
if (!is_readable($configPath)) {
    http_response_code(503);
    echo json_encode(['error' => 'Contact form is not configured on this server.']);
    exit;
}

/** @var array<string, mixed> $config */
$config = require $configPath;

if (!function_exists('curl_init')) {
    http_response_code(503);
    echo json_encode(['error' => 'This server PHP build has no cURL (needed for Resend).']);
    exit;
}

$apiKey = preg_replace('/\s+/', '', (string) ($config['resend_api_key'] ?? ''));
$to = trim((string) ($config['mail_to'] ?? ''));
$from = trim((string) ($config['mail_from'] ?? ''));
$fromName = trim((string) ($config['mail_from_name'] ?? 'Website'));
$visitorReplyTo = !empty($config['visitor_reply_to']);

if ($apiKey === '' || $to === '' || $from === '') {
    http_response_code(503);
    echo json_encode(['error' => 'Mail configuration incomplete.']);
    exit;
}

$raw = file_get_contents('php://input') ?: '';
$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request.']);
    exit;
}

$name = trim((string) ($data['name'] ?? ''));
$email = trim((string) ($data['email'] ?? ''));
$company = trim((string) ($data['company'] ?? ''));
$timeline = trim((string) ($data['timeline'] ?? ''));
$message = trim((string) ($data['message'] ?? ''));

if (strlen($name) < 1 || strlen($name) > 200) {
    http_response_code(400);
    echo json_encode(['error' => 'Please enter your name.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Please enter a valid email address.']);
    exit;
}

if (strlen($message) < 10 || strlen($message) > 10000) {
    http_response_code(400);
    echo json_encode(['error' => 'Message must be between 10 and 10,000 characters.']);
    exit;
}

$esc = static fn (string $v): string => htmlspecialchars($v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
// Header values must never contain line breaks.
$oneLine = static fn (string $v): string => trim((string) preg_replace('/\s+/', ' ', $v));

// UTF-8 safe truncate without requiring mbstring.
$clip = static fn (string $v, int $n): string => preg_match('/^.{0,' . $n . '}/su', $v, $m) ? $m[0] : $v;

$received = (new DateTimeImmutable('now', new DateTimeZone('Asia/Kolkata')))->format('D, j M Y \a\t g:i A') . ' IST';

$details = ['Name' => $name, 'Email' => $email];
if ($company !== '') {
    $details['Company'] = $company;
}
if ($timeline !== '') {
    $details['Timeline'] = $timeline;
}

$rowsHtml = '';
$text = "New enquiry from the KyrithBuilds website\n\n";
foreach ($details as $label => $value) {
    $display = $esc($value);
    if ($label === 'Email') {
        $display = '<a href="mailto:' . $display . '" style="color:#4172F4;text-decoration:none">' . $display . '</a>';
    }
    $rowsHtml .= '<tr>'
        . '<td style="padding:10px 0;width:100px;font-size:12px;font-weight:bold;letter-spacing:.06em;text-transform:uppercase;color:#6b7a90;vertical-align:top;border-bottom:1px solid #eef1f6">' . $label . '</td>'
        . '<td style="padding:10px 0;font-size:15px;color:#021D41;vertical-align:top;border-bottom:1px solid #eef1f6">' . $display . '</td>'
        . '</tr>';
    $text .= $label . ': ' . $value . "\n";
}
$text .= "\nMessage:\n" . $message . "\n\nReceived: " . $received . "\nReply to this email to respond to " . $name . ".\n";

$mailtoHref = 'mailto:' . rawurlencode($email) . '?subject=' . rawurlencode('Re: your enquiry to KyrithBuilds');

$html = '<!doctype html><html><body style="margin:0;padding:0;background:#f0f4fc">'
    . '<div style="display:none;max-height:0;overflow:hidden;opacity:0">' . $esc($name . ': ' . $clip($oneLine($message), 90)) . '</div>'
    . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4fc;padding:24px 12px"><tr><td align="center">'
    . '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;font-family:Segoe UI,Helvetica,Arial,sans-serif">'
    . '<tr><td style="background:#021D41;padding:24px 28px">'
    . '<div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#8fb0ff;font-weight:bold">KyrithBuilds</div>'
    . '<div style="font-size:22px;font-weight:bold;color:#ffffff;margin-top:6px">New website enquiry</div>'
    . '</td></tr>'
    . '<tr><td style="padding:24px 28px 8px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">' . $rowsHtml . '</table></td></tr>'
    . '<tr><td style="padding:16px 28px 8px">'
    . '<div style="font-size:12px;font-weight:bold;letter-spacing:.06em;text-transform:uppercase;color:#6b7a90;margin-bottom:8px">Message</div>'
    . '<div style="background:#f5f8ff;border-left:4px solid #4172F4;border-radius:6px;padding:14px 16px;font-size:15px;line-height:1.6;color:#021D41;white-space:pre-wrap">' . $esc($message) . '</div>'
    . '</td></tr>'
    . '<tr><td style="padding:20px 28px 28px"><a href="' . $esc($mailtoHref) . '" style="display:inline-block;background:#4172F4;color:#ffffff;text-decoration:none;font-weight:bold;font-size:14px;padding:12px 22px;border-radius:8px">Reply to ' . $esc($oneLine($name)) . '</a></td></tr>'
    . '<tr><td style="background:#f5f8ff;padding:14px 28px;font-size:12px;color:#6b7a90">Received ' . $esc($received) . ' via the contact form on kyrithbuilds.com</td></tr>'
    . '</table></td></tr></table></body></html>';

$subject = 'New enquiry from ' . $oneLine($name);
if ($company !== '') {
    $subject .= ' (' . $oneLine($company) . ')';
}
$subject = $clip($subject, 120);

$payload = [
    'from'    => $fromName !== '' ? $oneLine($fromName) . ' <' . $from . '>' : $from,
    'to'      => [$to],
    'subject' => $subject,
    'html'    => $html,
    'text'    => $text,
];

if ($visitorReplyTo) {
    $payload['reply_to'] = $email;
}

$jsonFlags = JSON_UNESCAPED_UNICODE;
if (defined('JSON_INVALID_UTF8_SUBSTITUTE')) {
    $jsonFlags |= JSON_INVALID_UTF8_SUBSTITUTE;
}
$jsonBody = json_encode($payload, $jsonFlags);
if ($jsonBody === false) {
    http_response_code(400);
    echo json_encode(['error' => 'Could not encode message.']);
    exit;
}

$ch = curl_init('https://api.resend.com/emails');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => $jsonBody,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 30,
    // Some networks/hosts break IPv6
    CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
]);

$responseBody = curl_exec($ch);
$httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr = curl_error($ch);
curl_close($ch);

if ($responseBody === false) {
    $responseBody = '';
}

if ($curlErr !== '') {
    http_response_code(502);
    $hint = '';
    if (stripos($curlErr, 'SSL') !== false || stripos($curlErr, 'certificate') !== false) {
        $hint = ' SSL/certificate problem (common on Windows PHP: set curl.cainfo in php.ini to a current cacert.pem).';
    }
    echo json_encode(['error' => 'Could not reach Resend.' . $hint]);
    exit;
}

if ($httpCode >= 200 && $httpCode < 300) {
    echo json_encode(['ok' => true, 'message' => 'Thanks. We received your note and will reply within 1 to 2 business days.']);
    exit;
}

$detail = 'Resend rejected the request (HTTP ' . $httpCode . ').';
if ($responseBody !== '') {
    $decoded = json_decode($responseBody, true);
    if (is_array($decoded) && isset($decoded['message'])) {
        $detail = (string) $decoded['message'];
    }
}

// Use 502 only for upstream/network issues; Resend client errors are 400-series for clarity.
if ($httpCode >= 400 && $httpCode < 500) {
    http_response_code($httpCode);
} else {
    http_response_code(502);
}
echo json_encode(['error' => $detail]);
