<?php
/**
 * Campus Lost & Found Portal
 * Database Connection File (db.php)
 *
 * Establishes a secure connection to MySQL using the PHP Data Objects (PDO) extension.
 */

// ========================================================
// 1. DATABASE CONFIGURATION (Standard XAMPP Defaults)
// ========================================================
$db_host = '127.0.0.1';
$db_port = '3307'; // XAMPP MySQL configured port (3307 avoids port 3306 service conflict)
$db_name = 'lost_found_db';
$db_user = 'root';
$db_pass = ''; // Default XAMPP MySQL password is empty.

// ========================================================
// 2. PDO CONNECTION SETUP
// ========================================================
$pdo_options = [
    // Throw PDOException on errors so we can catch and handle them cleanly
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    // Return result rows as associative arrays (e.g. $row['item_name'])
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    // Disable emulated prepares to ensure real database-level prepared statements
    PDO::ATTR_EMULATE_PREPARES   => false,
];

// Connect with priority to XAMPP MariaDB on port 3307, with fallback to port 3306 if needed
$ports_and_passwords = [
    ['port' => $db_port, 'pass' => $db_pass],
    ['port' => '3306',   'pass' => ''],
    ['port' => '3306',   'pass' => '123456'],
];

$pdo = null;
$last_exception = null;

foreach ($ports_and_passwords as $cfg) {
    try {
        $dsn = "mysql:host={$db_host};port={$cfg['port']};dbname={$db_name};charset=utf8mb4";
        $pdo = new PDO($dsn, $db_user, $cfg['pass'], $pdo_options);
        break; // Successfully connected!
    } catch (PDOException $ex) {
        $last_exception = $ex;
    }
}

if (!$pdo) {
    // Log technical error details to the server log (do NOT expose to visitors)
    error_log('Database connection failed: ' . ($last_exception ? $last_exception->getMessage() : 'Unknown error'));

        // Display a friendly, secure error message to the user
        http_response_code(500);
        ?>
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Database Connection Error - Campus Lost & Found</title>
            <style>
                body {
                    font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
                    background-color: #f8fafc;
                    color: #1e293b;
                    margin: 0;
                    padding: 40px 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 80vh;
                }
                .error-card {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 30px;
                    max-width: 550px;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                }
                h1 { color: #dc2626; font-size: 1.5rem; margin-top: 0; }
                p { line-height: 1.6; color: #475569; }
                ol { color: #475569; line-height: 1.6; padding-left: 20px; }
                .badge {
                    display: inline-block;
                    background: #fee2e2;
                    color: #991b1b;
                    padding: 4px 10px;
                    border-radius: 4px;
                    font-weight: 600;
                    font-size: 0.85rem;
                }
            </style>
        </head>
        <body>
            <div class="error-card">
                <span class="badge">Connection Notice</span>
                <h1>Unable to Connect to Database</h1>
                <p>The portal could not establish a connection to the MySQL database. Please verify the following setup steps:</p>
                <ol>
                    <li>Ensure <strong>MySQL</strong> service is started in the XAMPP Control Panel.</li>
                    <li>Verify that the <code>lost_found_db</code> database has been imported using <code>database.sql</code> in phpMyAdmin.</li>
                    <li>Check database credentials in <code>db.php</code> (default username is <code>root</code> with no password).</li>
                </ol>
                <p>Technical details have been securely logged to the server error log.</p>
            </div>
        </body>
        </html>
        <?php
        exit;
    }

