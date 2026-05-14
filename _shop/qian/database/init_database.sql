-- 书籍管理系统数据库初始化脚本
-- 简化版本，用于快速初始化数据库

-- 设置字符集
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `merchant_system` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `merchant_system`;

-- 创建核心表结构
-- 1. 用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `real_name` varchar(50) DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
  `status` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. 商家表
CREATE TABLE IF NOT EXISTS `merchants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `contact_person` varchar(50) DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. 书籍分类表
CREATE TABLE IF NOT EXISTS `book_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` text,
  `status` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. 书籍表
CREATE TABLE IF NOT EXISTS `books` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `author` varchar(100) DEFAULT NULL,
  `isbn` varchar(20) DEFAULT NULL,
  `publisher` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `stock` int(11) NOT NULL DEFAULT 0,
  `category_id` int(11) DEFAULT NULL,
  `merchant_id` int(11) NOT NULL,
  `description` text,
  `cover_image` varchar(500) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入初始数据
-- 管理员用户
INSERT INTO `users` (`username`, `password`, `email`, `real_name`, `is_admin`) VALUES
('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@example.com', '系统管理员', 1),
('merchant1', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'merchant1@example.com', '商家用户1', 0);

-- 商家数据
INSERT INTO `merchants` (`name`, `description`, `contact_person`, `contact_phone`) VALUES
('新华书店', '大型连锁书店，提供各类图书', '张经理', '13800138001'),
('当当网', '知名网上书店', '李经理', '13800138002'),
('京东图书', '京东商城图书频道', '王经理', '13800138003');

-- 书籍分类
INSERT INTO `book_categories` (`name`, `code`, `description`) VALUES
('文学小说', 'literature', '文学类小说作品'),
('科技计算机', 'technology', '科技和计算机相关书籍'),
('经济管理', 'business', '经济和管理类书籍'),
('教育考试', 'education', '教育和考试相关书籍'),
('生活艺术', 'lifestyle', '生活和艺术类书籍'),
('历史传记', 'history', '历史和传记类书籍');

-- 示例书籍数据
INSERT INTO `books` (`name`, `author`, `isbn`, `publisher`, `price`, `stock`, `category_id`, `merchant_id`, `description`) VALUES
('JavaScript高级程序设计（第4版）', 'Nicholas C. Zakas', '9787115545381', '人民邮电出版社', 89.00, 50, 2, 1, 'JavaScript经典教程'),
('Vue.js实战', '梁灏', '9787115471659', '人民邮电出版社', 69.00, 30, 2, 1, 'Vue.js框架实战指南'),
('算法导论（第3版）', 'Thomas H. Cormen', '9787111407010', '机械工业出版社', 128.00, 20, 2, 2, '计算机科学领域的经典教材'),
('百年孤独', '加西亚·马尔克斯', '9787544253994', '南海出版公司', 45.00, 100, 1, 1, '魔幻现实主义文学代表作'),
('三体（全三册）', '刘慈欣', '9787536692930', '重庆出版社', 58.00, 80, 1, 2, '中国科幻文学代表作'),
('经济学原理', '曼昆', '9787300070281', '北京大学出版社', 98.00, 45, 3, 3, '经济学入门经典教材'),
('高等数学（第七版）', '同济大学数学系', '9787040396638', '高等教育出版社', 35.00, 120, 4, 1, '高等院校理工类本科生高等数学课程教材'),
('中国通史', '吕思勉', '9787101054252', '中华书局', 76.00, 60, 6, 2, '中国历史研究的经典著作');

SET FOREIGN_KEY_CHECKS = 1;

SELECT '数据库初始化完成！' as message; 