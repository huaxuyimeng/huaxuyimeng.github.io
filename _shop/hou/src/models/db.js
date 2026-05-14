const mysql = require('mysql2/promise')

// 数据库配置
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '你的数据库密码',
    database: process.env.DB_NAME || 'merchant_db',
    port: process.env.DB_PORT || 3306,
    charset: 'utf8mb4',
    timezone: '+08:00',
    // 连接池配置
    connectionLimit: 10,
    waitForConnections: true,
}

// 创建连接池
const pool = mysql.createPool(dbConfig)

// 只在开发环境打印连接信息，并监听错误
if (process.env.NODE_ENV !== 'production') {
    pool.on('connection', () => console.log('数据库连接已建立'))
    pool.on('acquire', () => console.log('从连接池获取连接'))
    pool.on('release', () => console.log('连接已释放回连接池'))
    pool.on('error', err => console.error('数据库连接池错误:', err))
}

// 通用查询（带错误捕获）
async function query(sql, params = []) {
    try {
        const [rows] = await pool.execute(sql, params)
        return rows
    } catch (error) {
        console.error('数据库查询错误:', error)
        throw error
    }
}

// 事务（带错误捕获）
async function transaction(callback) {
    const connection = await pool.getConnection()
    try {
        await connection.beginTransaction()
        const result = await callback(connection)
        await connection.commit()
        return result
    } catch (error) {
        await connection.rollback()
        console.error('数据库事务错误:', error)
        throw error
    } finally {
        connection.release()
    }
}

module.exports = { pool, query, transaction } 