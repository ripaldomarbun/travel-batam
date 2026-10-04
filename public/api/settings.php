<?php
/**
 * L.A TRAVEL BATAM - Company Settings API
 * Endpoint: /api/settings.php
 */
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT `data_json` FROM `company_settings` WHERE `id` = 1 LIMIT 1");
        $row = $stmt->fetch();
        if ($row && !empty($row['data_json'])) {
            echo json_encode([
                'success' => true,
                'data' => json_decode($row['data_json'], true)
            ]);
        } else {
            echo json_encode([
                'success' => true,
                'data' => null,
                'message' => 'Belum ada settings kustom di database, menggunakan default.'
            ]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit;
}

if ($method === 'POST') {
    verifyAdminAuth();
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

    if (empty($input)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Data settings kosong.']);
        exit;
    }

    try {
        $json = json_encode($input);
        $stmt = $pdo->prepare("INSERT INTO `company_settings` (`id`, `data_json`) VALUES (1, :json) ON DUPLICATE KEY UPDATE `data_json` = VALUES(`data_json`)");
        $stmt->execute([':json' => $json]);

        echo json_encode([
            'success' => true,
            'message' => 'Pengaturan perusahaan berhasil disimpan ke database MySQL.',
            'data' => $input
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit;
}
