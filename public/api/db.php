<?php
require_once __DIR__ . '/config.php';

function getDbConnection() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Gagal terhubung ke database MySQL. Pastikan DB_NAME, DB_USER, dan DB_PASS di api/config.php sudah benar.',
                'error' => $e->getMessage()
            ]);
            exit;
        }
    }
    return $pdo;
}

function verifyAdminAuth() {
    $headers = getallheaders();
    $pin = $headers['X-Admin-PIN'] ?? $headers['x-admin-pin'] ?? null;
    
    // Fallback query parameter jika header diblokir firewall hosting
    if (!$pin && isset($_REQUEST['pin'])) {
        $pin = $_REQUEST['pin'];
    }

    if (!$pin) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Akses ditolak: PIN Admin diperlukan.'
        ]);
        exit;
    }
    return true;
}
