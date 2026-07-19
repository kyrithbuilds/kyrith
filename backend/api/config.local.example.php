<?php

/**
 * Copy to config.local.php (never commit that file).
 *
 * mail_from MUST match a verified sender in SendGrid.
 *
 * visitor_reply_to: set true only if SendGrid accepts the visitor's email as Reply-To
 * (often fails on free tier until domain is authenticated). Default false = no Reply-To header;
 * visitor's address is still in the message body.
 */
return [
    'sendgrid_api_key' => 'SG.your_sendgrid_api_key_here',
    'sendgrid_template_id' => 'd-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // SendGrid Dynamic Template ID (starts with d-)
    'mail_to' => 'you@example.com',
    'mail_from' => 'info@kyrithbuilds.com',
    'mail_from_name' => 'KyrithBuilds',
    'visitor_reply_to' => true, // Enables reply-to visitor email — requires domain authentication in SendGrid
];
