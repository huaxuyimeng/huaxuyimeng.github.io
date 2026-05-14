# 书籍管理系统数据库使用指南

## 概述

本文档提供了书籍管理系统数据库的完整使用指南，包括数据库结构、初始化、常用查询和维护等内容。

## 数据库文件说明

### 1. `books_management.sql` - 完整数据库脚本
- **用途**: 完整的数据库结构，包含所有表、视图、存储过程、触发器等
- **适用场景**: 生产环境部署、完整功能开发
- **特点**: 
  - 包含11个核心表
  - 包含视图、存储过程、触发器
  - 包含完整的索引优化
  - 包含示例数据

### 2. `init_database.sql` - 简化初始化脚本
- **用途**: 快速初始化数据库，包含核心功能
- **适用场景**: 开发测试、快速部署
- **特点**:
  - 只包含4个核心表
  - 包含基础示例数据
  - 结构简单，易于理解

### 3. `common_queries.sql` - 常用查询语句
- **用途**: 提供各种业务场景的SQL查询示例
- **适用场景**: 开发参考、数据分析
- **特点**:
  - 包含10大类查询
  - 涵盖所有业务场景
  - 提供性能优化建议

## 数据库结构

### 核心表结构

#### 1. 用户表 (users)
```sql
CREATE TABLE `users` (
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
);
```

#### 2. 商家表 (merchants)
```sql
CREATE TABLE `merchants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `contact_person` varchar(50) DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);
```

#### 3. 书籍分类表 (book_categories)
```sql
CREATE TABLE `book_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` text,
  `status` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`)
);
```

#### 4. 书籍表 (books)
```sql
CREATE TABLE `books` (
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
);
```

## 快速开始

### 1. 初始化数据库

#### 方法一：使用简化脚本（推荐新手）
```bash
mysql -u root -p < database/init_database.sql
```

#### 方法二：使用完整脚本（推荐生产环境）
```bash
mysql -u root -p < database/books_management.sql
```

### 2. 验证安装
```sql
USE merchant_system;
SHOW TABLES;
SELECT COUNT(*) FROM books;
SELECT COUNT(*) FROM merchants;
SELECT COUNT(*) FROM users;
```

### 3. 连接配置
在应用配置文件中设置数据库连接：
```javascript
const dbConfig = {
  host: 'localhost',
  user: 'merchant_app',
  password: 'MerchantApp123!',
  database: 'merchant_system',
  charset: 'utf8mb4'
};
```

## 常用操作

### 1. 书籍管理

#### 添加书籍
```sql
INSERT INTO books (name, author, isbn, publisher, price, stock, category_id, merchant_id, description) 
VALUES ('书籍名称', '作者', 'ISBN', '出版社', 99.00, 100, 1, 1, '描述');
```

#### 更新书籍信息
```sql
UPDATE books 
SET name = '新书名', price = 88.00, stock = 50 
WHERE id = 1;
```

#### 删除书籍（软删除）
```sql
UPDATE books SET status = 0 WHERE id = 1;
```

#### 查询书籍列表
```sql
SELECT 
    b.*,
    c.name as category_name,
    m.name as merchant_name
FROM books b
LEFT JOIN book_categories c ON b.category_id = c.id
LEFT JOIN merchants m ON b.merchant_id = m.id
WHERE b.status = 1
ORDER BY b.created_at DESC;
```

### 2. 商家管理

#### 添加商家
```sql
INSERT INTO merchants (name, description, contact_person, contact_phone) 
VALUES ('商家名称', '描述', '联系人', '电话');
```

#### 查询商家及其书籍
```sql
SELECT 
    m.*,
    COUNT(b.id) as book_count,
    AVG(b.price) as avg_price
FROM merchants m
LEFT JOIN books b ON m.id = b.merchant_id AND b.status = 1
WHERE m.status = 1
GROUP BY m.id;
```

### 3. 用户管理

#### 添加用户
```sql
INSERT INTO users (username, password, email, real_name, is_admin) 
VALUES ('username', '加密密码', 'email@example.com', '真实姓名', 0);
```

#### 查询用户列表
```sql
SELECT id, username, email, real_name, is_admin, status, created_at 
FROM users 
ORDER BY created_at DESC;
```

## 数据统计

### 1. 基础统计
```sql
-- 书籍总数
SELECT COUNT(*) as total_books FROM books WHERE status = 1;

-- 商家总数
SELECT COUNT(*) as total_merchants FROM merchants WHERE status = 1;

-- 用户总数
SELECT COUNT(*) as total_users FROM users WHERE status = 1;
```

### 2. 分类统计
```sql
SELECT 
    c.name as category_name,
    COUNT(b.id) as book_count,
    AVG(b.price) as avg_price
FROM book_categories c
LEFT JOIN books b ON c.id = b.category_id AND b.status = 1
WHERE c.status = 1
GROUP BY c.id
ORDER BY book_count DESC;
```

### 3. 库存统计
```sql
SELECT 
    COUNT(*) as total_books,
    COUNT(CASE WHEN stock > 0 THEN 1 END) as in_stock_books,
    COUNT(CASE WHEN stock = 0 THEN 1 END) as out_of_stock_books,
    COUNT(CASE WHEN stock <= 10 THEN 1 END) as low_stock_books
FROM books 
WHERE status = 1;
```

## 性能优化

### 1. 索引优化
确保以下索引存在：
```sql
-- 书籍表索引
CREATE INDEX idx_books_category_status ON books (category_id, status);
CREATE INDEX idx_books_merchant_status ON books (merchant_id, status);
CREATE INDEX idx_books_price_status ON books (price, status);

-- 全文搜索索引
CREATE FULLTEXT INDEX ft_name_author_desc ON books (name, author, description);
```

### 2. 查询优化
- 使用 `LIMIT` 限制结果集大小
- 避免使用 `SELECT *`，只查询需要的字段
- 使用适当的 `WHERE` 条件过滤数据
- 合理使用 `JOIN` 操作

### 3. 分页查询示例
```sql
-- 第一页，每页20条
SELECT * FROM books WHERE status = 1 ORDER BY created_at DESC LIMIT 20 OFFSET 0;

-- 第二页，每页20条
SELECT * FROM books WHERE status = 1 ORDER BY created_at DESC LIMIT 20 OFFSET 20;
```

## 数据备份与恢复

### 1. 备份数据库
```bash
mysqldump -u root -p merchant_system > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. 恢复数据库
```bash
mysql -u root -p merchant_system < backup_file.sql
```

### 3. 备份特定表
```bash
mysqldump -u root -p merchant_system books merchants > tables_backup.sql
```

## 常见问题

### 1. 字符集问题
确保使用 `utf8mb4` 字符集：
```sql
SET NAMES utf8mb4;
ALTER DATABASE merchant_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. 外键约束问题
如果遇到外键约束错误，可以临时禁用：
```sql
SET FOREIGN_KEY_CHECKS = 0;
-- 执行操作
SET FOREIGN_KEY_CHECKS = 1;
```

### 3. 性能问题
- 检查慢查询日志
- 分析查询执行计划
- 优化索引结构
- 考虑分表分库

## 扩展功能

### 1. 添加新字段
```sql
ALTER TABLE books ADD COLUMN new_field VARCHAR(100) DEFAULT NULL COMMENT '新字段';
```

### 2. 创建视图
```sql
CREATE VIEW v_book_summary AS
SELECT 
    b.id, b.name, b.author, b.price, b.stock,
    c.name as category_name,
    m.name as merchant_name
FROM books b
LEFT JOIN book_categories c ON b.category_id = c.id
LEFT JOIN merchants m ON b.merchant_id = m.id
WHERE b.status = 1;
```

### 3. 创建存储过程
```sql
DELIMITER $$
CREATE PROCEDURE GetBooksByCategory(IN category_id INT)
BEGIN
    SELECT * FROM books WHERE category_id = category_id AND status = 1;
END$$
DELIMITER ;
```

## 安全建议

1. **用户权限**: 为应用创建专用数据库用户，只授予必要权限
2. **密码安全**: 使用强密码，定期更换
3. **SQL注入**: 使用参数化查询，避免字符串拼接
4. **数据备份**: 定期备份数据库
5. **访问控制**: 限制数据库访问IP

## 联系支持

如果在使用过程中遇到问题，请参考：
- 数据库错误日志
- MySQL官方文档
- 项目README文件
- 开发团队支持

---

**注意**: 本文档基于MySQL 8.0版本编写，其他版本可能存在差异。 