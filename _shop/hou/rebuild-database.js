// rebuild-database.js
// 本脚本用于重建数据库表结构，并可根据 products.json、merchants.json、users.json、orders.json 批量导入数据
// 字段映射与数据库表完全一致
// 需先运行 rebuild-database.sql 创建表结构
// 建议用 Navicat、DataGrip、MySQL Workbench 或命令行工具导入json数据

/*
字段映射说明：
products.json -> products 表
  id, name, price, merchant_id, created_at, stock, image_url, description
merchants.json -> merchants 表
  id, name, shop_name, password, created_at
users.json -> users 表
  user_id, username, user_password, merchant_id, created_at, is_admin
orders.json -> orders 表
  id, merchant_id, product_id, quantity, status, created_at, total_amount
*/

// 如需自动导入，可用 nodejs 脚本读取json并批量插入（示例略）
// 推荐用可视化工具直接导入，或用LOAD DATA INFILE命令 