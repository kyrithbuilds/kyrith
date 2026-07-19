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
        $k = preg_replace('/\s+/', '', (string) ($probe['sendgrid_api_key'] ?? ''));
        $keySet = strlen($k) > 10;
    }
    echo json_encode([
        'ok' => true,
        'service' => 'contact',
        'curl' => function_exists('curl_init'),
        'config_file_readable' => $cfgOk,
        'sendgrid_api_key_configured' => $keySet,
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
    echo json_encode(['error' => 'This server PHP build has no cURL (needed for SendGrid).']);
    exit;
}

$apiKey = preg_replace('/\s+/', '', (string) ($config['sendgrid_api_key'] ?? ''));
$to = trim((string) ($config['mail_to'] ?? ''));
$from = trim((string) ($config['mail_from'] ?? ''));
$fromName = trim((string) ($config['mail_from_name'] ?? 'Website'));
$visitorReplyTo = !empty($config['visitor_reply_to']);
$templateId = trim((string) ($config['sendgrid_template_id'] ?? ''));

if ($apiKey === '' || $to === '' || $from === '' || $templateId === '') {
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

$fromBlock = ['email' => $from];
if ($fromName !== '') {
    $fromBlock['name'] = $fromName;
}

$templateData = [
    'name'     => $name,
    'email'    => $email,
    'message'  => $message,
];
if ($company !== '') {
    $templateData['company'] = $company;
}
if ($timeline !== '') {
    $templateData['timeline'] = $timeline;
}

$personalization = [
    'to'                  => [['email' => $to]],
    'dynamic_template_data' => $templateData,
];

$payload = [
    'personalizations' => [$personalization],
    'from'             => $fromBlock,
    'template_id'      => $templateId,
];

// Visitor Reply-To often breaks SendGrid unless that address is verified; keep off by default.
if ($visitorReplyTo) {
    $replyBlock = ['email' => $email];
    if ($name !== '') {
        $replyBlock['name'] = $name;
    }
    $payload['reply_to'] = $replyBlock;
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

$ch = curl_init('https://api.sendgrid.com/v3/mail/send');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => $jsonBody,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 30,
    // Some networks/hosts break IPv6 to SendGrid
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
    echo json_encode(['error' => 'Could not reach SendGrid.' . $hint]);
    exit;
}

if ($httpCode >= 200 && $httpCode < 300) {
    echo json_encode(['ok' => true, 'message' => 'Thanks. We received your note and will reply within 1 to 2 business days.']);
    exit;
}

$detail = 'SendGrid rejected the request (HTTP ' . $httpCode . ').';
if ($responseBody !== '') {
    $decoded = json_decode($responseBody, true);
    if (is_array($decoded) && isset($decoded['errors']) && is_array($decoded['errors'])) {
        $first = $decoded['errors'][0] ?? null;
        if (is_array($first) && isset($first['message'])) {
            $detail = (string) $first['message'];
        }
    } elseif ($httpCode === 401 || $httpCode === 403) {
        $detail = 'SendGrid refused the API key (check the key is active and has Mail Send).';
    }
}

// Use 502 only for upstream/network issues; SendGrid client errors are 400-series for clarity.
if ($httpCode >= 400 && $httpCode < 500) {
    http_response_code($httpCode);
} else {
    http_response_code(502);
}
echo json_encode(['error' => $detail]);
