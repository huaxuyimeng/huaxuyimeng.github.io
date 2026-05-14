# 后端说明

## 数据库建表
- 运行 `rebuild-database.sql` 创建所有表，字段与 products.json、merchants.json、users.json、orders.json 完全一致。

## 数据导入
- 推荐用可视化工具或命令行将 json 文件导入对应表。
- 字段映射见 `接口字段映射说明.md`。

## 字段一致性
- 前后端所有接口字段名与数据库字段保持一致。
- 时间字段统一用 created_at，金额用 total_amount，商品图片用 image_url。

## 启动
- 后端：cd hou && npm install && npm run dev
- 前端：cd qian && npm install && npm run dev

## 常见问题
- 字段不一致、类型不符会导致接口报错或数据无法展示，请严格按字段映射文档执行。 