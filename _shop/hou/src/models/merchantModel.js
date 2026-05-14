const { pool } = require('./db')

// 根据商家名查找商家
exports.findMerchantByName = async (name) => {
    const [rows] = await pool.query('SELECT * FROM merchants WHERE name=?', [name])
    return rows[0]
} 