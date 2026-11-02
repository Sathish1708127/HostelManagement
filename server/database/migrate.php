<?php
declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

use App\Config\Database;
use Dotenv\Dotenv;

Dotenv::createImmutable(__DIR__ . '/..')->safeLoad();

$pdo = Database::connection();
$pdo->exec('CREATE TABLE IF NOT EXISTS schema_migrations (
    migration VARCHAR(255) NOT NULL PRIMARY KEY,
    applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');

$applied = $pdo->query('SELECT migration FROM schema_migrations')->fetchAll(PDO::FETCH_COLUMN);
$files = glob(__DIR__ . '/migrations/*.sql') ?: [];
sort($files, SORT_NATURAL);

foreach ($files as $file) {
    $name = basename($file);
    if (in_array($name, $applied, true)) {
        echo "Skipped {$name}\n";
        continue;
    }
    $sql = file_get_contents($file);
    if ($sql === false) {
        throw new RuntimeException("Unable to read {$name}.");
    }
    $pdo->beginTransaction();
    try {
        $pdo->exec($sql);
        $statement = $pdo->prepare('INSERT INTO schema_migrations (migration) VALUES (:migration)');
        $statement->execute(['migration' => $name]);
        $pdo->commit();
        echo "Applied {$name}\n";
    } catch (Throwable $exception) {
        $pdo->rollBack();
        throw $exception;
    }
}

