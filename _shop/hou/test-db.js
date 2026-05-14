const pool = require('./src/models/db');

async function testDatabase() {
    try {
        console.log('测试数据库连接...');

        // 测试连接
        const connection = await pool.getConnection();
        console.log('✅ 数据库连接成功');

        // 检查表是否存在
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('数据库中的表:', tables.map(t => Object.values(t)[0]));

        // 检查products表结构
        const [productColumns] = await connection.execute('DESCRIBE products');
        console.log('products表结构:', productColumns);

        // 检查merchants表结构
        const [merchantColumns] = await connection.execute('DESCRIBE merchants');
        console.log('merchants表结构:', merchantColumns);

        // 检查merchants表中是否有数据
        const [merchants] = await connection.execute('SELECT * FROM merchants LIMIT 5');
        console.log('merchants表数据:', merchants);

        // 检查products表中是否有数据
        const [products] = await connection.execute('SELECT * FROM products LIMIT 5');
        console.log('products表数据:', products);

        connection.release();
        console.log('✅ 数据库测试完成');

    } catch (error) {
        console.error('❌ 数据库测试失败:', error);
    } finally {
        process.exit(0);
    }
}

testDatabase(); 