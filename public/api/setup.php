<?php
/**
 * L.A TRAVEL BATAM - Auto Database Table Creator & Initial Seeder
 * Jalankan script ini sekali via browser: https://latravelbatam.com/api/setup.php
 */
require_once __DIR__ . '/db.php';

try {
    $pdo = getDbConnection();

    // 1. Buat Tabel cars
    $pdo->exec("CREATE TABLE IF NOT EXISTS `cars` (
        `id` VARCHAR(100) NOT NULL PRIMARY KEY,
        `name` VARCHAR(255) NOT NULL,
        `category` VARCHAR(100) DEFAULT 'Family MPV',
        `capacity` VARCHAR(50) DEFAULT '7 Penumpang',
        `capacity_en` VARCHAR(50) DEFAULT '7 Passengers',
        `transmission` VARCHAR(50) DEFAULT 'Automatic',
        `transmission_en` VARCHAR(50) DEFAULT 'Automatic',
        `engine` VARCHAR(100) DEFAULT '',
        `fuel` VARCHAR(100) DEFAULT 'Bensin',
        `fuel_en` VARCHAR(100) DEFAULT 'Petrol',
        `luggage` VARCHAR(100) DEFAULT '2-3 Koper',
        `luggage_en` VARCHAR(100) DEFAULT '2-3 Suitcases',
        `price_start_from` VARCHAR(100) NOT NULL,
        `price_unit` VARCHAR(50) DEFAULT 'per hari',
        `rates_json` TEXT,
        `description_id` TEXT,
        `description_en` TEXT,
        `image_url` VARCHAR(500) DEFAULT '',
        `gallery_json` TEXT,
        `features_json` TEXT,
        `features_en_json` TEXT,
        `badge` VARCHAR(100) DEFAULT '',
        `badge_en` VARCHAR(100) DEFAULT '',
        `popular` TINYINT(1) DEFAULT 0,
        `is_available` TINYINT(1) DEFAULT 1,
        `wa_message` TEXT,
        `sort_order` INT DEFAULT 0,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // 2. Buat Tabel settings
    $pdo->exec("CREATE TABLE IF NOT EXISTS `company_settings` (
        `id` INT NOT NULL PRIMARY KEY,
        `data_json` LONGTEXT NOT NULL,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // 3. Masukkan data awal jika tabel cars masih kosong
    $checkCount = $pdo->query("SELECT COUNT(*) FROM `cars`")->fetchColumn();
    $seededCount = 0;

    if ($checkCount == 0 || isset($_GET['seed']) || isset($_GET['force'])) {
        $jsonPath = __DIR__ . '/cars.json';
        if (!file_exists($jsonPath)) {
            $jsonPath = __DIR__ . '/../../src/data/cars.json';
        }
        
        $initialCars = [];
        if (file_exists($jsonPath)) {
            $initialCars = json_decode(file_get_contents($jsonPath), true);
        }

        if (!empty($initialCars)) {
            $stmt = $pdo->prepare("INSERT INTO `cars` (
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
                `sort_order` = VALUES(`sort_order`)");

            foreach ($initialCars as $index => $c) {
                $stmt->execute([
                    ':id' => $c['id'] ?? ('car-' . $index),
                    ':name' => $c['name'] ?? '',
                    ':category' => $c['category'] ?? 'Family MPV',
                    ':capacity' => $c['capacity'] ?? '7 Penumpang',
                    ':capacity_en' => $c['capacity_en'] ?? '7 Passengers',
                    ':transmission' => $c['transmission'] ?? 'Automatic',
                    ':transmission_en' => $c['transmission_en'] ?? 'Automatic',
                    ':engine' => $c['engine'] ?? '',
                    ':fuel' => $c['fuel'] ?? 'Bensin',
                    ':fuel_en' => $c['fuel_en'] ?? 'Petrol',
                    ':luggage' => $c['luggage'] ?? '2-3 Koper',
                    ':luggage_en' => $c['luggage_en'] ?? '2-3 Suitcases',
                    ':price_start_from' => $c['price_start_from'] ?? 'Rp 300.000',
                    ':price_unit' => $c['price_unit'] ?? 'per hari',
                    ':rates_json' => json_encode($c['rates'] ?? []),
                    ':description_id' => $c['description_id'] ?? '',
                    ':description_en' => $c['description_en'] ?? '',
                    ':image_url' => $c['image_url'] ?? '',
                    ':gallery_json' => json_encode($c['gallery'] ?? []),
                    ':features_json' => json_encode($c['features'] ?? []),
                    ':features_en_json' => json_encode($c['features_en'] ?? []),
                    ':badge' => $c['badge'] ?? '',
                    ':badge_en' => $c['badge_en'] ?? '',
                    ':popular' => !empty($c['popular']) ? 1 : 0,
                    ':is_available' => isset($c['isAvailable']) ? ($c['isAvailable'] ? 1 : 0) : 1,
                    ':wa_message' => $c['wa_message'] ?? '',
                    ':sort_order' => $index
                ]);
                $seededCount++;
            }
        }
    }

    echo json_encode([
        'success' => true,
        'message' => 'Tabel MySQL cars dan company_settings berhasil dibuat / dipastikan siap.',
        'seeded_cars' => $seededCount,
        'existing_cars' => (int)$checkCount
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Gagal setup database: ' . $e->getMessage()
    ]);
}
