const mysql = require('mysql2/promise');

async function testDatabaseConnection() {
    try {
        console.log('测试数据库连接...');

        // 创建数据库连接
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '123456',
            database: 'merchant_db'
        });

        console.log('数据库连接成功！');

        // 测试查询商户数据
        const [merchants] = await connection.execute('SELECT * FROM merchants');
        console.log('商户数据:', merchants);

        // 测试查询商品数据
        const [products] = await connection.execute('SELECT * FROM products');
        console.log('商品数据:', products);

        // 测试查询订单数据
        const [orders] = await connection.execute(`
      SELECT o.*, p.name AS product_name, m.name AS merchant_name 
      FROM orders o 
      JOIN products p ON o.product_id = p.id 
      JOIN merchants m ON o.merchant_id = m.id 
      ORDER BY o.created_at DESC
    `);
        console.log('订单数据:', orders);

        // 测试按商品ID查询订单
        const [productOrders] = await connection.execute(`
      SELECT o.*, p.name AS product_name, p.price AS product_price, m.name AS merchant_name
      FROM orders o
      JOIN products p ON o.product_id = p.id
      JOIN merchants m ON o.merchant_id = m.id
      WHERE o.product_id = ?
      ORDER BY o.created_at DESC
    `, [1]);
        console.log('商品ID 1 的订单:', productOrders);

        await connection.end();
        console.log('数据库连接已关闭');

    } catch (error) {
        console.error('数据库连接失败:', error.message);
    }
}

testDatabaseConnection(); 