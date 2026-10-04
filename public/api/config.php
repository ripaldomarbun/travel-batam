<?php
/**
 * L.A TRAVEL BATAM - Database & API Configuration
 * 
 * Silakan sesuaikan kredensial di bawah ini dengan database MySQL yang Anda buat di cPanel Rumahweb:
 * - cPanel > MySQL® Databases (Buat Database & User MySQL, lalu hubungkan)
 */

// Cek apakah ada file kredensial lokal di server cPanel (agar password tidak pernah tertimpa saat git push/deploy)
if (file_exists(__DIR__ . '/config.local.php')) {
    require_once __DIR__ . '/config.local.php';
}

// Konfigurasi Database MySQL Rumahweb
if (!defined('DB_HOST')) define('DB_HOST', 'localhost');
if (!defined('DB_NAME')) define('DB_NAME', 'latb8519_latravel'); // Database cPanel Anda
if (!defined('DB_USER')) define('DB_USER', 'latb8519_latravel'); // User cPanel Anda
if (!defined('DB_PASS')) define('DB_PASS', 'latravel2026'); // Password MySQL Anda
if (!defined('DB_CHARSET')) define('DB_CHARSET', 'utf8mb4');

// PIN Admin default untuk otorisasi perubahan data via API
define('ADMIN_PIN_HASH', '1234');

// Setup CORS & Anti-Caching Headers untuk API
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-PIN');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
