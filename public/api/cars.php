<?php
/**
 * L.A TRAVEL BATAM - Cars API (CRUD)
 * Endpoint: /api/cars.php
 */
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

function formatCarOutput($row) {
    return [
        'id' => $row['id'],
        'name' => $row['name'],
        'category' => $row['category'],
        'capacity' => $row['capacity'],
        'capacity_en' => $row['capacity_en'],
        'transmission' => $row['transmission'],
        'transmission_en' => $row['transmission_en'],
        'engine' => $row['engine'],
        'fuel' => $row['fuel'],
        'fuel_en' => $row['fuel_en'],
        'luggage' => $row['luggage'],
        'luggage_en' => $row['luggage_en'],
        'price_start_from' => $row['price_start_from'],
        'price_unit' => $row['price_unit'],
        'rates' => !empty($row['rates_json']) ? json_decode($row['rates_json'], true) : new stdClass(),
        'description_id' => $row['description_id'],
        'description_en' => $row['description_en'],
        'image_url' => $row['image_url'],
        'gallery' => !empty($row['gallery_json']) ? json_decode($row['gallery_json'], true) : [$row['image_url']],
        'features' => !empty($row['features_json']) ? json_decode($row['features_json'], true) : [],
        'features_en' => !empty($row['features_en_json']) ? json_decode($row['features_en_json'], true) : [],
        'badge' => $row['badge'],
        'badge_en' => $row['badge_en'],
        'popular' => (bool)$row['popular'],
        'isAvailable' => (bool)$row['is_available'],
        'wa_message' => $row['wa_message'],
        'sort_order' => (int)$row['sort_order']
    ];
}

// 1. GET: Ambil seluruh data mobil
if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM `cars` ORDER BY `sort_order` ASC, `created_at` DESC");
        $rows = $stmt->fetchAll();
        $cars = array_map('formatCarOutput', $rows);
        echo json_encode([
            'success' => true,
            'count' => count($cars),
            'data' => $cars
        ], JSON_UNESCAPED_SLASHES);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit;
}

// 2. Operasi Write (POST, PUT, DELETE) membutuhkan Otorisasi Admin
verifyAdminAuth();
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

// 3. DELETE: Hapus mobil
if ($method === 'DELETE' || ($method === 'POST' && isset($input['_action']) && $input['_action'] === 'DELETE')) {
    $carId = $_GET['id'] ?? $input['id'] ?? null;
    if (!$carId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Parameter id diperlukan untuk menghapus mobil.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM `cars` WHERE `id` = :id");
        $stmt->execute([':id' => $carId]);
        echo json_encode([
            'success' => true,
            'message' => "Mobil dengan ID $carId berhasil dihapus."
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit;
}

// 4. POST / PUT: Tambah atau Perbarui Mobil
if ($method === 'POST' || $method === 'PUT') {
    $id = $input['id'] ?? ('car-' . time());
    $name = $input['name'] ?? 'Unit Baru';
    $category = $input['category'] ?? 'Family MPV';
    $capacity = $input['capacity'] ?? '7 Penumpang';
    $capacity_en = $input['capacity_en'] ?? '7 Passengers';
    $transmission = $input['transmission'] ?? 'Automatic';
    $transmission_en = $input['transmission_en'] ?? 'Automatic';
    $engine = $input['engine'] ?? '';
    $fuel = $input['fuel'] ?? 'Bensin';
    $fuel_en = $input['fuel_en'] ?? 'Petrol';
    $luggage = $input['luggage'] ?? '2-3 Koper';
    $luggage_en = $input['luggage_en'] ?? '2-3 Suitcases';
    $price_start_from = $input['price_start_from'] ?? 'Rp 300.000';
    $price_unit = $input['price_unit'] ?? 'per hari';
    $rates_json = json_encode($input['rates'] ?? []);
    $description_id = $input['description_id'] ?? '';
    $description_en = $input['description_en'] ?? '';
    $image_url = $input['image_url'] ?? '';
    $gallery_json = json_encode($input['gallery'] ?? [$image_url]);
    $features_json = json_encode($input['features'] ?? []);
    $features_en_json = json_encode($input['features_en'] ?? []);
    $badge = $input['badge'] ?? '';
    $badge_en = $input['badge_en'] ?? '';
    $popular = !empty($input['popular']) ? 1 : 0;
    $is_available = isset($input['isAvailable']) ? ($input['isAvailable'] ? 1 : 0) : (isset($input['is_available']) ? ($input['is_available'] ? 1 : 0) : 1);
    $wa_message = $input['wa_message'] ?? "Halo L.A Travel Batam, saya ingin booking $name.";
    $sort_order = isset($input['sort_order']) ? (int)$input['sort_order'] : 0;

    try {
        $sql = "INSERT INTO `cars` (
            `id`, `name`, `category`, `capacity`, `capacity_en`,
            `transmission`, `transmission_en`, `engine`, `fuel`, `fuel_en`,
            `luggage`, `luggage_en`, `price_start_from`, `price_unit`,
            `rates_json`, `description_id`, `description_en`, `image_url`,
            `gallery_json`, `features_json`, `features_en_json`, `badge`,
            `badge_en`, `popular`, `is_available`, `wa_message`, `sort_order`
        ) VALUES (
            :id, :name, :category, :capacity, :capacity_en,
            :transmission, :transmission_en, :engine, :fuel, :fuel_en,
            :luggage, :luggage_en, :price_start_from, :price_unit,
            :rates_json, :description_id, :description_en, :image_url,
            :gallery_json, :features_json, :features_en_json, :badge,
            :badge_en, :popular, :is_available, :wa_message, :sort_order
        ) ON DUPLICATE KEY UPDATE
            `name` = VALUES(`name`),
            `category` = VALUES(`category`),
            `capacity` = VALUES(`capacity`),
            `capacity_en` = VALUES(`capacity_en`),
            `transmission` = VALUES(`transmission`),
            `transmission_en` = VALUES(`transmission_en`),
            `engine` = VALUES(`engine`),
            `fuel` = VALUES(`fuel`),
            `fuel_en` = VALUES(`fuel_en`),
            `luggage` = VALUES(`luggage`),
            `luggage_en` = VALUES(`luggage_en`),
            `price_start_from` = VALUES(`price_start_from`),
            `price_unit` = VALUES(`price_unit`),
            `rates_json` = VALUES(`rates_json`),
            `description_id` = VALUES(`description_id`),
            `description_en` = VALUES(`description_en`),
            `image_url` = VALUES(`image_url`),
            `gallery_json` = VALUES(`gallery_json`),
            `features_json` = VALUES(`features_json`),
            `features_en_json` = VALUES(`features_en_json`),
            `badge` = VALUES(`badge`),
            `badge_en` = VALUES(`badge_en`),
            `popular` = VALUES(`popular`),
            `is_available` = VALUES(`is_available`),
            `wa_message` = VALUES(`wa_message`),
            `sort_order` = VALUES(`sort_order`)";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':name' => $name,
            ':category' => $category,
            ':capacity' => $capacity,
            ':capacity_en' => $capacity_en,
            ':transmission' => $transmission,
            ':transmission_en' => $transmission_en,
            ':engine' => $engine,
            ':fuel' => $fuel,
            ':fuel_en' => $fuel_en,
            ':luggage' => $luggage,
            ':luggage_en' => $luggage_en,
            ':price_start_from' => $price_start_from,
            ':price_unit' => $price_unit,
            ':rates_json' => $rates_json,
            ':description_id' => $description_id,
            ':description_en' => $description_en,
            ':image_url' => $image_url,
            ':gallery_json' => $gallery_json,
            ':features_json' => $features_json,
            ':features_en_json' => $features_en_json,
            ':badge' => $badge,
            ':badge_en' => $badge_en,
            ':popular' => $popular,
            ':is_available' => $is_available,
            ':wa_message' => $wa_message,
            ':sort_order' => $sort_order
        ]);

        echo json_encode([
            'success' => true,
            'message' => "Data mobil $name berhasil disimpan ke database MySQL.",
            'data' => formatCarOutput([
                'id' => $id,
                'name' => $name,
                'category' => $category,
                'capacity' => $capacity,
                'capacity_en' => $capacity_en,
                'transmission' => $transmission,
                'transmission_en' => $transmission_en,
                'engine' => $engine,
                'fuel' => $fuel,
                'fuel_en' => $fuel_en,
                'luggage' => $luggage,
                'luggage_en' => $luggage_en,
                'price_start_from' => $price_start_from,
                'price_unit' => $price_unit,
                'rates_json' => $rates_json,
                'description_id' => $description_id,
                'description_en' => $description_en,
                'image_url' => $image_url,
                'gallery_json' => $gallery_json,
                'features_json' => $features_json,
                'features_en_json' => $features_en_json,
                'badge' => $badge,
                'badge_en' => $badge_en,
                'popular' => $popular,
                'is_available' => $is_available,
                'wa_message' => $wa_message,
                'sort_order' => $sort_order
            ])
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit;
}
