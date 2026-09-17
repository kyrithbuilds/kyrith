<?php

/**
 * Copy to config.local.php (never commit that file).
 *
 * On cPanel: use the MySQL database name, username, and password
 * from cPanel → MySQL Databases. Host is almost always "localhost".
 */
return [
    'db_host' => 'localhost',
    'db_name' => 'your_database_name',
    'db_user' => 'your_database_user',
    'db_pass' => 'your_database_password',
];
