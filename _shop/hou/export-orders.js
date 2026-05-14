const fs = require('fs');
const path = require('path');
const pool = require('./src/models/db');
const { parse } = require('json2csv');

async function exportOrders() {
    const sql = `
    SELECT o.*, p.name AS product_name, p.price AS product_price, m.name AS merchant_name
    FROM orders o
    JOIN products p ON o.product_id = p.id
    JOIN merchants m ON o.merchant_id = m.id
    ORDER BY o.created_at DESC
  `;
    const [rows] = await pool.execute(sql);
    const csv = parse(rows);
    fs.writeFileSync(path.join(__dirname, 'orders_export.csv'), csv, 'utf8');
    console.log('导出成功，文件为 orders_export.csv');
    process.exit(0);
}

exportOrders(); 