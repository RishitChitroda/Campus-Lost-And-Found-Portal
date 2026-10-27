<?php
/**
 * Campus Lost & Found Portal - Simple API (api.php)
 *
 * Minimal PHP script to connect JavaScript to MySQL.
 * Easy to explain to teacher:
 * 1. Reads action from query parameter.
 * 2. Runs SQL query using PDO.
 * 3. Returns JSON response to JavaScript.
 */

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';

$action = $_GET['action'] ?? '';

try {
    if ($action === 'get_items') {
        // Fetch all items from MySQL
        $stmt = $pdo->query("SELECT id, item_name AS name, type, category, location, item_date AS date, description, contact_name AS contactName, contact_email AS contactEmail, status FROM items ORDER BY created_at DESC");
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $items]);
        exit;
    }

    if ($action === 'add_item' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        // Read JSON payload from JavaScript fetch()
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);

        if (!$data || empty($data['name'])) {
            echo json_encode(['success' => false, 'message' => 'Invalid data']);
            exit;
        }

        $code = strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));
        $hash = password_hash($code, PASSWORD_BCRYPT);

        $stmt = $pdo->prepare("
            INSERT INTO items (item_name, type, category, description, location, item_date, contact_name, contact_email, management_code_hash, status)
            VALUES (:name, :type, :category, :desc, :location, :date, :cname, :cemail, :code, 'Active')
        ");
        $stmt->execute([
            ':name'     => $data['name'],
            ':type'     => $data['type'],
            ':category' => $data['category'],
            ':desc'     => $data['description'] ?? '',
            ':location' => $data['location'],
            ':date'     => $data['date'] ?? date('Y-m-d'),
            ':cname'    => $data['contactName'],
            ':cemail'   => $data['contactEmail'],
            ':code'     => $hash
        ]);

        echo json_encode(['success' => true, 'id' => (int)$pdo->lastInsertId()]);
        exit;
    }

    if ($action === 'mark_returned' && isset($_GET['id'])) {
        $id = (int)$_GET['id'];
        $stmt = $pdo->prepare("UPDATE items SET status = 'Returned' WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(['success' => true]);
        exit;
    }

    if ($action === 'delete_item' && isset($_GET['id'])) {
        $id = (int)$_GET['id'];
        $stmt = $pdo->prepare("DELETE FROM items WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(['success' => true]);
        exit;
    }

    echo json_encode(['success' => false, 'message' => 'Unknown action']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
