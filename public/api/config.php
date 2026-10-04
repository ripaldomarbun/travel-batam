<?php
/**
 * L.A TRAVEL BATAM - Database & API Configuration
 * 
 * Silakan sesuaikan kredensial di bawah ini dengan database MySQL yang Anda buat di cPanel Rumahweb:
 * - cPanel > MySQL® Databases (Buat Database & User MySQL, lalu hubungkan)
 */

// Konfigurasi Database MySQL Rumahweb
define('DB_HOST', 'localhost');
define('DB_NAME', 'latb8519_latravel'); // Database cPanel Anda
define('DB_USER', 'latb8519_latravel'); // User cPanel Anda
define('DB_PASS', 'MASUKKAN_PASSWORD_DATABASE_DI_SINI'); // Password yang baru Anda buat di Database Wizard
define('DB_CHARSET', 'utf8mb4');

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
