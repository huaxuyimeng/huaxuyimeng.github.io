// 自动化导入脚本，将 products.json、merchants.json、users.json、orders.json 批量导入 MySQL
// 使用前请确保已安装 mysql2、fs、bcryptjs
// 运行：node import-json-to-db.js

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbConfig = {
  host: 'localhost',
  user: 'root', // 修改为你的数据库用户名
  password: '你的密码', // 修改为你的数据库密码
  database: 'merchant_db',
  port: 3306
};

// 批量导入JSON到表，支持密码字段自动加密
async function importJsonToTable(jsonFile, table, fields) {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', jsonFile), 'utf-8'));
    if (!Array.isArray(data)) throw new Error(`${jsonFile} 不是数组`);
    const conn = await mysql.createConnection(dbConfig);
    await conn.query(`DELETE FROM \`${table}\``); // 清空表
    // 处理密码字段加密
    for (const item of data) {
      for (const f of fields) {
        if ((f === 'password' || f === 'user_password') && item[f] && !item[f].startsWith('$2')) {
          // 只加密明文密码，避免重复加密
          item[f] = await bcrypt.hash(item[f], 10);
        }
      }
    }
    // 批量插入
    const placeholders = '(' + fields.map(() => '?').join(',') + ')';
    const sql = `INSERT INTO \`${table}\` (${fields.join(',')}) VALUES ${data.map(() => placeholders).join(',')}`;
    const values = data.flatMap(item => fields.map(f => item[f]));
    await conn.query(sql, values);
    await conn.end();
    console.log(`${jsonFile} 导入 ${table} 完成，共 ${data.length} 条`);
  } catch (err) {
    console.error(`${jsonFile} 导入 ${table} 失败:`, err.message);
  }
}

(async () => {
  await importJsonToTable('products.json', 'products', ['id', 'name', 'price', 'merchant_id', 'created_at', 'stock', 'image_url', 'description']);
  await importJsonToTable('merchants.json', 'merchants', ['id', 'name', 'shop_name', 'password', 'created_at']);
  await importJsonToTable('users.json', 'users', ['user_id', 'username', 'user_password', 'merchant_id', 'created_at', 'is_admin']);
  await importJsonToTable('orders.json', 'orders', ['id', 'merchant_id', 'product_id', 'quantity', 'status', 'created_at', 'total_amount']);
  console.log('全部导入完成');
})(); 