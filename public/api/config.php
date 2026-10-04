<?php
/**
 * L.A TRAVEL BATAM - Database & API Configuration
 * 
 * Silakan sesuaikan kredensial di bawah ini dengan database MySQL yang Anda buat di cPanel Rumahweb:
 * - cPanel > MySQL® Databases (Buat Database & User MySQL, lalu hubungkan)
 */

// Konfigurasi Database MySQL Rumahweb
define('DB_HOST', 'localhost');
define('DB_NAME', 'latr_travelbatam'); // Ganti dengan nama database cPanel Anda (contoh: cpaneluser_travelbatam)
define('DB_USER', 'latr_dbuser');      // Ganti dengan username database cPanel Anda
define('DB_PASS', 'GantiPasswordDbAnda123!'); // Ganti dengan password user database Anda
define('DB_CHARSET', 'utf8mb4');

// PIN Admin default untuk otorisasi perubahan data via API
define('ADMIN_PIN_HASH', '1234');

// Setup CORS Headers untuk API
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-PIN');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
