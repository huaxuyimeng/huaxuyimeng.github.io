const pool = require('./db');

// 新增一个商品
async function createProduct(name, price, merchant_id, stock = 0, image_url = null, description = null) {
    try {
        const safeStock = stock === null || stock === undefined || String(stock).trim() === '' ? 0 : stock;
        console.log('数据库创建商品参数:', { name, price, merchant_id, stock: safeStock, image_url, description });
        const [result] = await pool.execute(
            'INSERT INTO products (name, price, merchant_id, stock, image_url, description) VALUES (?, ?, ?, ?, ?, ?)',
            [name, price, merchant_id, safeStock, image_url, description]
        );
        console.log('创建商品成功，ID:', result.insertId);
        return result.insertId;
    } catch (error) {
        console.error('数据库创建商品失败:', error);
        throw error;
    }
}

// 查询所有商品列表，支持分页和模糊查询
async function getAllProducts(page = 1, pageSize = 10, productName = '') {
    // 保证传入的页码和页面大小是整数
    const safePageSize = Number.isInteger(pageSize) && pageSize > 0 ? pageSize : 10;
    const safeOffset = Number.isInteger(page) && page > 0 ? (page - 1) * safePageSize : 0;
    const nameFilter = productName ? `%${productName}%` : '%';

    try {
        // 查询总记录数
        const [totalRows] = await pool.execute(
            'SELECT COUNT(*) as total FROM products WHERE name LIKE ?',
            [nameFilter]
        );
        const total = totalRows[0].total;

        // 查询商品数据（LIMIT和OFFSET不能用?占位符，需要直接拼接）
        const sql = `
            SELECT * FROM products 
            WHERE name LIKE ? 
            ORDER BY id ASC
            LIMIT ${safePageSize} OFFSET ${safeOffset}
        `;
        const [rows] = await pool.execute(sql, [nameFilter]);

        console.log('查询到的商品数据:', rows);
        return { total, products: rows };
    } catch (error) {
        console.error('查询商品列表失败:', error);
        throw error;
    }
}

// 根据商户ID获取商品列表
async function getProductsByMerchant(merchantId, page = 1, pageSize = 10) {
    const safePageSize = Number.isInteger(pageSize) && pageSize > 0 ? pageSize : 10;
    const safeOffset = Number.isInteger(page) && page > 0 ? (page - 1) * safePageSize : 0;

    // 查询总记录数
    const [totalRows] = await pool.execute(
        'SELECT COUNT(*) as total FROM products WHERE merchant_id = ?',
        [merchantId]
    );
    const total = totalRows[0].total;

    // 查询商品数据
    const sql = `
        SELECT p.*, m.name AS merchant_name, s.shop_name 
        FROM products p 
        JOIN merchants m ON p.merchant_id = m.id 
        LEFT JOIN shops s ON p.merchant_id = s.merchant_id 
        WHERE p.merchant_id = ? 
        LIMIT ${safePageSize} OFFSET ${safeOffset}
    `;
    const [rows] = await pool.execute(sql, [merchantId]);

    return { total, products: rows };
}

// 查询指定 ID 的商品详情
async function getProductById(id) {
    const [rows] = await pool.execute(`
        SELECT p.*, m.name AS merchant_name, s.shop_name 
        FROM products p 
        JOIN merchants m ON p.merchant_id = m.id 
        LEFT JOIN shops s ON p.merchant_id = s.merchant_id 
        WHERE p.id = ?
    `, [id]);
    return rows[0];
}

// 更新指定 ID 的商品
async function updateProduct(id, name, price, merchant_id, stock, image_url, description) {
    const [result] = await pool.execute(
        'UPDATE products SET name = ?, price = ?, merchant_id = ?, stock = ?, image_url = ?, description = ? WHERE id = ?',
        [name, price, merchant_id, stock, image_url, description, id]
    );
    return result.affectedRows;
}

// 删除指定商品
async function deleteProduct(id) {
    const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows;
}

// 搜索商品
async function searchProducts(keyword) {
    const searchKeyword = `%${keyword}%`;
    const [rows] = await pool.execute(
        'SELECT p.*, m.name AS merchant_name FROM products p JOIN merchants m ON p.merchant_id = m.id WHERE p.name LIKE ?',
        [searchKeyword]
    );
    return { total: rows.length, products: rows };
}

// 按价格区间筛选商品
async function filterByPrice(min, max) {
    let sql = 'SELECT p.*, m.name AS merchant_name FROM products p JOIN merchants m ON p.merchant_id = m.id WHERE 1=1';
    const params = [];

    if (min !== null && min !== undefined) {
        sql += ' AND p.price >= ?';
        params.push(min);
    }

    if (max !== null && max !== undefined) {
        sql += ' AND p.price <= ?';
        params.push(max);
    }

    const [rows] = await pool.execute(sql, params);
    return { total: rows.length, products: rows };
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductsByMerchant,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts,
    filterByPrice
};