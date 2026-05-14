// src/models/order.js

const pool = require('./db');
// 查询所有订单列表
// 返回所有订单的基本信息
async function getAllOrders() {
  const [rows] = await pool.execute(`
    SELECT o.id AS order_id, m.name AS merchant_name, p.name AS product_name, o.quantity, o.status, o.created_at
    FROM orders o
    JOIN merchants m ON o.merchant_id = m.id
    JOIN products p ON o.product_id = p.id
  `);
  return rows;
}
// 新增订单
// 新增订单的基本信息
async function createOrder(merchant_id, product_id, quantity, status) {
  const [result] = await pool.execute(
    'INSERT INTO orders (merchant_id, product_id, quantity, status) VALUES (?, ?, ?, ?)',
    [merchant_id, product_id, quantity, status]
  );
  return result.insertId;
}
// 修改订单
// 修改订单的基本信息
async function updateOrder(id, quantity, status) {
  const [result] = await pool.execute(
    'UPDATE orders SET quantity = ?, status = ? WHERE id = ?',
    [quantity, status, id]
  );
  return result.affectedRows;
}
// 删除订单
async function deleteOrder(id) {
  const [result] = await pool.execute('DELETE FROM orders WHERE id = ?', [id]);
  return result.affectedRows;
}

module.exports = {
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder
};
