-- ========================================================
-- Campus Lost & Found Portal
-- Database Schema and Sample Data
--
-- Database Name: lost_found_db
-- Compatible with: MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+
-- Character Set: utf8mb4 (supports full Unicode & emojis)
-- ========================================================

-- 1. Create the database if it doesn't already exist
CREATE DATABASE IF NOT EXISTS `lost_found_db`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- 2. Select the database for use
USE `lost_found_db`;

-- 3. Create the `items` table
-- Drop the table first if re-importing to avoid conflicts
DROP TABLE IF EXISTS `items`;

CREATE TABLE `items` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `item_name` VARCHAR(150) NOT NULL,
    `type` ENUM('Lost', 'Found') NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `description` TEXT NOT NULL,
    `location` VARCHAR(150) NOT NULL,
    `item_date` DATE NOT NULL,
    `contact_name` VARCHAR(100) NOT NULL,
    `contact_email` VARCHAR(100) NOT NULL,
    `contact_phone` VARCHAR(30) DEFAULT NULL,
    `status` ENUM('Active', 'Returned') NOT NULL DEFAULT 'Active',
    `management_code_hash` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Indexes to speed up searching, filtering, and sorting
    INDEX `idx_status` (`status`),
    INDEX `idx_status_created` (`status`, `created_at`),
    INDEX `idx_type` (`type`),
    INDEX `idx_category` (`category`),
    INDEX `idx_item_date` (`item_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ========================================================
-- Sample Records for Testing
-- NOTE: All personal details below are fictitious sample data
-- Sample management code for testing manage-report.php on records 1 to 6:
-- Plaintext Code: CAMPUS-2026-TEST
-- ========================================================

INSERT INTO `items` (
    `item_name`,
    `type`,
    `category`,
    `description`,
    `location`,
    `item_date`,
    `contact_name`,
    `contact_email`,
    `contact_phone`,
    `status`,
    `management_code_hash`,
    `created_at`
) VALUES
(
    'Casio fx-991EX Scientific Calculator',
    'Lost',
    'Electronics',
    'Black Casio scientific calculator with a small white sticker on the back cover reading "R.S.". Left on the desk during afternoon physics lecture.',
    'Engineering Block, Room 204',
    '2026-10-12',
    'Aarav Sharma',
    'aarav.sharma@example.edu',
    '9876543210',
    'Active',
    '$2y$10$5.HmpstsVu5UFXnbPvYegO6iuEhQ9KHqtDMmn9l7W3wJO1BJIlbq2',
    NOW() - INTERVAL 3 DAY
),
(
    'Student ID Card - Computer Science Dept',
    'Found',
    'Documents/ID Cards',
    'Found a laminated college student identity card belonging to 3rd year CS student. Handed over to the library reception desk.',
    'Central Library, 1st Floor Reception',
    '2026-10-13',
    'Priya Patel',
    'priya.patel@example.edu',
    '9876501234',
    'Active',
    '$2y$10$5.HmpstsVu5UFXnbPvYegO6iuEhQ9KHqtDMmn9l7W3wJO1BJIlbq2',
    NOW() - INTERVAL 2 DAY
),
(
    'Navy Blue Dell Laptop Backpack',
    'Lost',
    'Bags',
    'Dark navy blue backpack containing lecture notebooks, a blue water bottle in the side pouch, and stationery pouch. No laptop was inside.',
    'Student Cafeteria, North Wing',
    '2026-10-14',
    'Rohan Verma',
    'rohan.verma@example.edu',
    NULL,
    'Active',
    '$2y$10$5.HmpstsVu5UFXnbPvYegO6iuEhQ9KHqtDMmn9l7W3wJO1BJIlbq2',
    NOW() - INTERVAL 1 DAY
),
(
    'Set of 3 Bike Keys with Batman Keychain',
    'Found',
    'Keys',
    'Ring with 3 metallic keys and a black rubber Batman logo keychain. Found hanging near the water dispenser.',
    'Science Block Ground Floor, Water Cooler',
    '2026-10-14',
    'Sneha Kulkarni',
    'sneha.k@example.edu',
    '9123456780',
    'Active',
    '$2y$10$5.HmpstsVu5UFXnbPvYegO6iuEhQ9KHqtDMmn9l7W3wJO1BJIlbq2',
    NOW() - INTERVAL 18 HOUR
),
(
    'Brown Leather Bifold Wallet',
    'Lost',
    'Wallets',
    'WildHorn brown genuine leather bifold wallet with college bus pass and some cash. Very important documents inside.',
    'Main Sports Ground, Near Bleachers',
    '2026-10-15',
    'Karan Singh',
    'karan.singh@example.edu',
    '9811223344',
    'Active',
    '$2y$10$5.HmpstsVu5UFXnbPvYegO6iuEhQ9KHqtDMmn9l7W3wJO1BJIlbq2',
    NOW() - INTERVAL 6 HOUR
),
(
    'Stainless Steel Milton Thermos Flask',
    'Found',
    'Accessories',
    'Silver 750ml insulated water bottle with red rubber band around the cap. Found on the second bench in the seminar hall.',
    'Auditorium / Seminar Hall 1',
    '2026-10-15',
    'Ananya Gupta',
    'ananya.gupta@example.edu',
    NULL,
    'Active',
    '$2y$10$5.HmpstsVu5UFXnbPvYegO6iuEhQ9KHqtDMmn9l7W3wJO1BJIlbq2',
    NOW() - INTERVAL 2 HOUR
),
(
    'Data Structures and Algorithms Textbook',
    'Lost',
    'Books/Stationery',
    'Hardcover Tanenbaum textbook with yellow highlighter marks on Chapter 4. Marked as returned to demonstrate closed listings.',
    'Reading Room 3',
    '2026-10-10',
    'Dev Mehta',
    'dev.mehta@example.edu',
    NULL,
    'Returned',
    '$2y$10$5.HmpstsVu5UFXnbPvYegO6iuEhQ9KHqtDMmn9l7W3wJO1BJIlbq2',
    NOW() - INTERVAL 5 DAY
);
