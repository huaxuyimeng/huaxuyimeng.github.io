const pool = require('./db');

// 获取所有订单
async function getAllOrders(page = 1, pageSize = 10) {
    const safePageSize = Number.isInteger(pageSize) && pageSize > 0 ? pageSize : 10;
    const safeOffset = Number.isInteger(page) && page > 0 ? (page - 1) * safePageSize : 0;

    // 查询总记录数
    const [totalRows] = await pool.execute('SELECT COUNT(*) as total FROM orders');
    const total = totalRows[0].total;

    // 查询订单数据（包含商品和商户信息）
    const sql = `
        SELECT o.*, p.name AS product_name, p.price AS product_price, m.name AS merchant_name
        FROM orders o
        JOIN products p ON o.product_id = p.id
        JOIN merchants m ON o.merchant_id = m.id
        ORDER BY o.created_at DESC
        LIMIT ${safePageSize} OFFSET ${safeOffset}
    `;
    const [rows] = await pool.execute(sql);

    return { total, orders: rows };
}

// 根据商户ID获取订单列表
async function getOrdersByMerchant(merchantId, page = 1, pageSize = 10) {
    const safePageSize = Number.isInteger(pageSize) && pageSize > 0 ? pageSize : 10;
    const safeOffset = Number.isInteger(page) && page > 0 ? (page - 1) * safePageSize : 0;

    // 查询总记录数
    const [totalRows] = await pool.execute(
        'SELECT COUNT(*) as total FROM orders WHERE merchant_id = ?',
        [merchantId]
    );
    const total = totalRows[0].total;

    // 查询订单数据
    const sql = `
        SELECT o.*, p.name AS product_name, p.price AS product_price, m.name AS merchant_name
        FROM orders o
        JOIN products p ON o.product_id = p.id
        JOIN merchants m ON o.merchant_id = m.id
        WHERE o.merchant_id = ?
        ORDER BY o.created_at DESC
        LIMIT ${safePageSize} OFFSET ${safeOffset}
    `;
    const [rows] = await pool.execute(sql, [merchantId]);

    return { total, orders: rows };
}

// 根据商品ID获取订单列表
async function getOrdersByProduct(productId, page = 1, pageSize = 10) {
    const safePageSize = Number.isInteger(pageSize) && pageSize > 0 ? pageSize : 10;
    const safeOffset = Number.isInteger(page) && page > 0 ? (page - 1) * safePageSize : 0;

    // 查询总记录数
    const [totalRows] = await pool.execute(
        'SELECT COUNT(*) as total FROM orders WHERE product_id = ?',
        [productId]
    );
    const total = totalRows[0].total;

    // 查询订单数据
    const sql = `
        SELECT o.*, p.name AS product_name, p.price AS product_price, m.name AS merchant_name
        FROM orders o
        JOIN products p ON o.product_id = p.id
        JOIN merchants m ON o.merchant_id = m.id
        WHERE o.product_id = ?
        ORDER BY o.created_at DESC
        LIMIT ${safePageSize} OFFSET ${safeOffset}
    `;
    const [rows] = await pool.execute(sql, [productId]);

    return { total, orders: rows };
}

// 创建订单
async function createOrder(merchantId, productId, quantity, totalAmount) {
    try {
        const [result] = await pool.execute(
            'INSERT INTO orders (merchant_id, product_id, quantity, total_amount) VALUES (?, ?, ?, ?)',
            [merchantId, productId, quantity, totalAmount]
        );
        return result.insertId;
    } catch (error) {
        console.error('创建订单失败:', error);
        throw error;
    }
}

// 更新订单状态
async function updateOrderStatus(orderId, status) {
    const [result] = await pool.execute(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, orderId]
    );
    return result.affectedRows;
}

// 获取订单详情
async function getOrderById(orderId) {
    const [rows] = await pool.execute(`
        SELECT o.*, p.name AS product_name, p.price AS product_price, m.name AS merchant_name
        FROM orders o
        JOIN products p ON o.product_id = p.id
        JOIN merchants m ON o.merchant_id = m.id
        WHERE o.id = ?
    `, [orderId]);
    return rows[0];
}

// 删除订单
async function deleteOrder(orderId) {
    const [result] = await pool.execute('DELETE FROM orders WHERE id = ?', [orderId]);
    return result.affectedRows;
}

// 多表关联：获取所有订单及商品、商户信息（不分页，适合导出和前端全量展示）
async function getAllOrdersWithDetail() {
    const sql = `
        SELECT o.*, p.name AS product_name, p.price AS product_price, m.name AS merchant_name
        FROM orders o
        JOIN products p ON o.product_id = p.id
        JOIN merchants m ON o.merchant_id = m.id
        ORDER BY o.created_at DESC
    `;
    const [rows] = await pool.execute(sql);
    return rows;
}

module.exports = {
    getAllOrders,
    getOrdersByMerchant,
    getOrdersByProduct,
    createOrder,
    updateOrderStatus,
    getOrderById,
    deleteOrder,
    getAllOrdersWithDetail
}; 