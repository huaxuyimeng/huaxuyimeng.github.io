-- 书籍管理系统常用查询语句
-- 包含各种业务场景的SQL查询

USE `merchant_system`;

-- =============================================
-- 1. 书籍相关查询
-- =============================================

-- 1.1 获取所有书籍列表（带分类和商家信息）
SELECT 
    b.id,
    b.name,
    b.author,
    b.price,
    b.stock,
    b.cover_image,
    b.status,
    c.name as category_name,
    m.name as merchant_name,
    b.created_at
FROM books b
LEFT JOIN book_categories c ON b.category_id = c.id
LEFT JOIN merchants m ON b.merchant_id = m.id
WHERE b.status = 1
ORDER BY b.created_at DESC;

-- 1.2 按分类查询书籍
SELECT 
    b.*,
    c.name as category_name,
    m.name as merchant_name
FROM books b
LEFT JOIN book_categories c ON b.category_id = c.id
LEFT JOIN merchants m ON b.merchant_id = m.id
WHERE b.category_id = ? AND b.status = 1
ORDER BY b.created_at DESC;

-- 1.3 按商家查询书籍
SELECT 
    b.*,
    c.name as category_name,
    m.name as merchant_name
FROM books b
LEFT JOIN book_categories c ON b.category_id = c.id
LEFT JOIN merchants m ON b.merchant_id = m.id
WHERE b.merchant_id = ? AND b.status = 1
ORDER BY b.created_at DESC;

-- 1.4 搜索书籍（按书名、作者、描述）
SELECT 
    b.*,
    c.name as category_name,
    m.name as merchant_name
FROM books b
LEFT JOIN book_categories c ON b.category_id = c.id
LEFT JOIN merchants m ON b.merchant_id = m.id
WHERE b.status = 1 
    AND (b.name LIKE '%关键词%' 
         OR b.author LIKE '%关键词%' 
         OR b.description LIKE '%关键词%')
ORDER BY b.created_at DESC;

-- 1.5 获取推荐书籍
SELECT 
    b.*,
    c.name as category_name,
    m.name as merchant_name
FROM books b
LEFT JOIN book_categories c ON b.category_id = c.id
LEFT JOIN merchants m ON b.merchant_id = m.id
WHERE b.is_recommended = 1 AND b.status = 1
ORDER BY b.created_at DESC
LIMIT 10;

-- 1.6 获取热门书籍
SELECT 
    b.*,
    c.name as category_name,
    m.name as merchant_name
FROM books b
LEFT JOIN book_categories c ON b.category_id = c.id
LEFT JOIN merchants m ON b.merchant_id = m.id
WHERE b.is_hot = 1 AND b.status = 1
ORDER BY b.view_count DESC
LIMIT 10;

-- 1.7 获取新品书籍
SELECT 
    b.*,
    c.name as category_name,
    m.name as merchant_name
FROM books b
LEFT JOIN book_categories c ON b.category_id = c.id
LEFT JOIN merchants m ON b.merchant_id = m.id
WHERE b.is_new = 1 AND b.status = 1
ORDER BY b.created_at DESC
LIMIT 10;

-- 1.8 库存预警查询
SELECT 
    b.*,
    c.name as category_name,
    m.name as merchant_name
FROM books b
LEFT JOIN book_categories c ON b.category_id = c.id
LEFT JOIN merchants m ON b.merchant_id = m.id
WHERE b.stock <= b.min_stock AND b.status = 1
ORDER BY b.stock ASC;

-- 1.9 价格区间查询
SELECT 
    b.*,
    c.name as category_name,
    m.name as merchant_name
FROM books b
LEFT JOIN book_categories c ON b.category_id = c.id
LEFT JOIN merchants m ON b.merchant_id = m.id
WHERE b.price BETWEEN 50 AND 100 AND b.status = 1
ORDER BY b.price ASC;

-- =============================================
-- 2. 分类相关查询
-- =============================================

-- 2.1 获取所有分类
SELECT * FROM book_categories WHERE status = 1 ORDER BY sort_order ASC;

-- 2.2 获取分类及其书籍数量
SELECT 
    c.*,
    COUNT(b.id) as book_count
FROM book_categories c
LEFT JOIN books b ON c.id = b.category_id AND b.status = 1
WHERE c.status = 1
GROUP BY c.id
ORDER BY c.sort_order ASC;

-- =============================================
-- 3. 商家相关查询
-- =============================================

-- 3.1 获取所有商家
SELECT * FROM merchants WHERE status = 1 ORDER BY created_at DESC;

-- 3.2 获取商家及其书籍数量
SELECT 
    m.*,
    COUNT(b.id) as book_count,
    AVG(b.price) as avg_price
FROM merchants m
LEFT JOIN books b ON m.id = b.merchant_id AND b.status = 1
WHERE m.status = 1
GROUP BY m.id
ORDER BY m.created_at DESC;

-- =============================================
-- 4. 用户相关查询
-- =============================================

-- 4.1 获取所有用户
SELECT 
    id, username, email, real_name, is_admin, status, 
    last_login_time, login_count, created_at
FROM users 
ORDER BY created_at DESC;

-- 4.2 获取管理员用户
SELECT * FROM users WHERE is_admin = 1 AND status = 1;

-- 4.3 获取普通用户
SELECT * FROM users WHERE is_admin = 0 AND status = 1;

-- =============================================
-- 5. 统计查询
-- =============================================

-- 5.1 书籍统计
SELECT 
    COUNT(*) as total_books,
    COUNT(CASE WHEN stock > 0 THEN 1 END) as in_stock_books,
    COUNT(CASE WHEN stock = 0 THEN 1 END) as out_of_stock_books,
    COUNT(CASE WHEN stock <= 10 THEN 1 END) as low_stock_books,
    AVG(price) as avg_price,
    SUM(stock) as total_stock
FROM books 
WHERE status = 1;

-- 5.2 分类统计
SELECT 
    c.name as category_name,
    COUNT(b.id) as book_count,
    AVG(b.price) as avg_price,
    SUM(b.stock) as total_stock
FROM book_categories c
LEFT JOIN books b ON c.id = b.category_id AND b.status = 1
WHERE c.status = 1
GROUP BY c.id
ORDER BY book_count DESC;

-- 5.3 商家统计
SELECT 
    m.name as merchant_name,
    COUNT(b.id) as book_count,
    AVG(b.price) as avg_price,
    SUM(b.stock) as total_stock
FROM merchants m
LEFT JOIN books b ON m.id = b.merchant_id AND b.status = 1
WHERE m.status = 1
GROUP BY m.id
ORDER BY book_count DESC;

-- 5.4 价格区间统计
SELECT 
    CASE 
        WHEN price < 50 THEN '50元以下'
        WHEN price BETWEEN 50 AND 100 THEN '50-100元'
        WHEN price BETWEEN 100 AND 200 THEN '100-200元'
        ELSE '200元以上'
    END as price_range,
    COUNT(*) as book_count,
    AVG(price) as avg_price
FROM books 
WHERE status = 1
GROUP BY 
    CASE 
        WHEN price < 50 THEN '50元以下'
        WHEN price BETWEEN 50 AND 100 THEN '50-100元'
        WHEN price BETWEEN 100 AND 200 THEN '100-200元'
        ELSE '200元以上'
    END
ORDER BY avg_price;

-- =============================================
-- 6. 高级查询
-- =============================================

-- 6.1 分页查询书籍
SELECT 
    b.*,
    c.name as category_name,
    m.name as merchant_name
FROM books b
LEFT JOIN book_categories c ON b.category_id = c.id
LEFT JOIN merchants m ON b.merchant_id = m.id
WHERE b.status = 1
ORDER BY b.created_at DESC
LIMIT 20 OFFSET 0;  -- 第一页，每页20条

-- 6.2 多条件组合查询
SELECT 
    b.*,
    c.name as category_name,
    m.name as merchant_name
FROM books b
LEFT JOIN book_categories c ON b.category_id = c.id
LEFT JOIN merchants m ON b.merchant_id = m.id
WHERE b.status = 1
    AND (? IS NULL OR b.category_id = ?)
    AND (? IS NULL OR b.merchant_id = ?)
    AND (? IS NULL OR b.price >= ?)
    AND (? IS NULL OR b.price <= ?)
    AND (? IS NULL OR b.stock > 0)
ORDER BY b.created_at DESC;

-- 6.3 获取最新添加的书籍
SELECT 
    b.*,
    c.name as category_name,
    m.name as merchant_name
FROM books b
LEFT JOIN book_categories c ON b.category_id = c.id
LEFT JOIN merchants m ON b.merchant_id = m.id
WHERE b.status = 1
ORDER BY b.created_at DESC
LIMIT 10;

-- 6.4 获取价格最高的书籍
SELECT 
    b.*,
    c.name as category_name,
    m.name as merchant_name
FROM books b
LEFT JOIN book_categories c ON b.category_id = c.id
LEFT JOIN merchants m ON b.merchant_id = m.id
WHERE b.status = 1
ORDER BY b.price DESC
LIMIT 10;

-- 6.5 获取库存最多的书籍
SELECT 
    b.*,
    c.name as category_name,
    m.name as merchant_name
FROM books b
LEFT JOIN book_categories c ON b.category_id = c.id
LEFT JOIN merchants m ON b.merchant_id = m.id
WHERE b.status = 1
ORDER BY b.stock DESC
LIMIT 10;

-- =============================================
-- 7. 数据导出查询
-- =============================================

-- 7.1 导出书籍数据
SELECT 
    b.id as '书籍ID',
    b.name as '书籍名称',
    b.author as '作者',
    b.isbn as 'ISBN',
    b.publisher as '出版社',
    b.price as '价格',
    b.stock as '库存',
    c.name as '分类',
    m.name as '商家',
    b.status as '状态',
    b.created_at as '创建时间'
FROM books b
LEFT JOIN book_categories c ON b.category_id = c.id
LEFT JOIN merchants m ON b.merchant_id = m.id
WHERE b.status = 1
ORDER BY b.created_at DESC;

-- 7.2 导出商家数据
SELECT 
    m.id as '商家ID',
    m.name as '商家名称',
    m.description as '描述',
    m.contact_person as '联系人',
    m.contact_phone as '联系电话',
    COUNT(b.id) as '书籍数量',
    AVG(b.price) as '平均价格',
    m.status as '状态',
    m.created_at as '创建时间'
FROM merchants m
LEFT JOIN books b ON m.id = b.merchant_id AND b.status = 1
WHERE m.status = 1
GROUP BY m.id
ORDER BY m.created_at DESC;

-- =============================================
-- 8. 性能优化查询
-- =============================================

-- 8.1 使用索引的查询（确保有相应索引）
SELECT 
    b.id, b.name, b.author, b.price, b.stock
FROM books b
WHERE b.status = 1 
    AND b.category_id = 2
    AND b.price BETWEEN 50 AND 100
ORDER BY b.created_at DESC;

-- 8.2 避免全表扫描的查询
SELECT 
    b.id, b.name, b.author, b.price
FROM books b
WHERE b.status = 1 
    AND b.merchant_id = 1
    AND b.stock > 0
LIMIT 20;

-- =============================================
-- 9. 数据清理查询
-- =============================================

-- 9.1 查找重复的ISBN
SELECT isbn, COUNT(*) as count
FROM books 
WHERE isbn IS NOT NULL AND isbn != ''
GROUP BY isbn 
HAVING COUNT(*) > 1;

-- 9.2 查找空库存的书籍
SELECT id, name, author, stock
FROM books 
WHERE stock = 0 AND status = 1;

-- 9.3 查找价格异常的书籍
SELECT id, name, author, price
FROM books 
WHERE price <= 0 OR price > 1000;

-- =============================================
-- 10. 备份和恢复相关查询
-- =============================================

-- 10.1 获取表结构信息
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'merchant_system' 
    AND TABLE_NAME IN ('books', 'merchants', 'book_categories', 'users')
ORDER BY TABLE_NAME, ORDINAL_POSITION;

-- 10.2 获取表的行数统计
SELECT 
    TABLE_NAME,
    TABLE_ROWS,
    DATA_LENGTH,
    INDEX_LENGTH
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'merchant_system'; 