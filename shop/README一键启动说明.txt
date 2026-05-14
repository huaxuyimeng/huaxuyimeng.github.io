【一键启动说明】

1. 运行环境：需安装 Node.js、npm
2. 启动方法：
   - Windows 用户可用 Git Bash 或 WSL 运行 start-all.sh
   - 也可手动分两个终端：
     ① cd hou && npm install && npm run dev
     ② cd qian && npm install && npm run dev

3. 启动后：
   - 后端：http://localhost:3000
   - 前端：http://localhost:5173

【session/cors 问题排查】

1. 前端 axios 必须配置 withCredentials: true（已自动配置）
2. 后端 cors 必须配置 credentials: true，且 origin 不能为 *，需指定前端地址（已自动配置）
3. session 必须用 cookie 方式，且 httpOnly: true
4. 前后端端口必须分别为 3000/5173，且都在本地
5. 登录后如接口依然 401/404，建议：
   - 清除浏览器缓存和 cookie
   - 确认浏览器未阻止第三方 cookie
   - 用 Postman 直接请求后端接口，排查 session 是否生效
6. 如遇 404，优先检查接口路径拼写和后端服务是否已重启

如仍有问题，请将终端报错和浏览器控制台报错截图发给开发助手协助排查。

【一键启动说明补充】

1. 数据库建表：
   - 请先运行 hou/rebuild-database.sql 创建所有表，字段与 products.json、merchants.json、users.json、orders.json 完全一致。

2. 数据导入：
   - 可用 Navicat、DataGrip、MySQL Workbench 或命令行工具将 json 文件导入对应表。
   - 字段映射见 hou/接口字段映射说明.md。

3. 字段一致性：
   - 前后端所有接口字段名与数据库字段保持一致。
   - 时间字段统一用 created_at，金额用 total_amount，商品图片用 image_url。

4. 启动后端、前端：
   - 后端：cd hou && npm install && npm run dev
   - 前端：cd qian && npm install && npm run dev

5. 常见问题：
   - 字段不一致、类型不符会导致接口报错或数据无法展示，请严格按字段映射文档执行。 