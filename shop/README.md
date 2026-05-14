# 商户商品管理系统

一个基于 Node.js + Koa + Vue 3 + Element Plus 的现代化商户商品管理系统。

## 🚀 功能特性

### 后端功能 (merchant-system)
- ✅ 商品管理：增删改查
- ✅ 商户管理：增删改查
- ✅ 订单管理：增删改查
- ✅ 数据库操作：MySQL 连接和操作
- ✅ API 接口：RESTful API 设计
- ✅ 参数验证：完整的输入验证
- ✅ 错误处理：统一的错误处理机制
- ✅ CORS 支持：跨域请求支持

### 前端功能 (merchant-vue)
- ✅ 商品列表：美观的表格展示
- ✅ 新增商品：表单验证和提交
- ✅ 删除商品：确认对话框和删除操作
- ✅ 响应式设计：支持移动端
- ✅ 现代化 UI：渐变色彩和动画效果
- ✅ 用户体验：加载状态和错误提示

## 🛠️ 技术栈

### 后端
- **Node.js** - JavaScript 运行时
- **Koa** - 轻量级 Web 框架
- **MySQL** - 关系型数据库
- **mysql2** - MySQL 驱动

### 前端
- **Vue 3** - 渐进式 JavaScript 框架
- **Element Plus** - Vue 3 组件库
- **Vite** - 现代化构建工具
- **Vue Router** - 官方路由管理器

## 📦 安装和运行

### 1. 启动后端服务

```bash
# 进入后端目录
cd merchant-system

# 安装依赖
npm install

# 启动服务器
node src/app.js
```

后端服务将在 `http://localhost:3000` 启动

### 2. 启动前端服务

```bash
# 进入前端目录
cd merchant-vue

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端服务将在 `http://localhost:5173` 启动

## 🗄️ 数据库配置

确保 MySQL 服务已启动，并在 `merchant-system/src/models/db.js` 中配置正确的数据库连接信息：

```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'merchant_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

## 📋 API 接口

### 商品管理
- `GET /products` - 获取商品列表
- `POST /products` - 创建新商品
- `DELETE /products/:id` - 删除商品
- `PUT /products/:id` - 更新商品
- `GET /products/search` - 搜索商品
- `GET /products/price-range` - 按价格筛选

### 商户管理
- `GET /merchants` - 获取商户列表
- `POST /merchants` - 创建新商户
- `DELETE /merchants/:id` - 删除商户
- `PUT /merchants/:id` - 更新商户

### 订单管理
- `GET /orders` - 获取订单列表
- `POST /orders` - 创建新订单
- `DELETE /orders/:id` - 删除订单
- `PUT /orders/:id` - 更新订单状态

## 🎨 界面预览

### 商品列表页面
- 现代化的卡片式设计
- 渐变色彩和阴影效果
- 响应式表格布局
- 悬停动画效果

### 新增商品表单
- 美观的表单设计
- 实时验证反馈
- 平滑的动画过渡
- 友好的用户提示

## 🔧 开发说明

### 项目结构
```
├── merchant-system/          # 后端项目
│   ├── src/
│   │   ├── controllers/      # 控制器
│   │   ├── models/          # 数据模型
│   │   ├── routes/          # 路由配置
│   │   └── app.js           # 应用入口
│   └── package.json
│
└── merchant-vue/             # 前端项目
    ├── src/
    │   ├── api/             # API 接口
    │   ├── components/      # 组件
    │   ├── views/           # 页面
    │   ├── router/          # 路由
    │   └── utils/           # 工具函数
    └── package.json
```

### 代码特点
- **模块化设计**：清晰的目录结构和代码组织
- **类型安全**：完整的参数验证和错误处理
- **用户体验**：流畅的动画和交互效果
- **可维护性**：规范的代码风格和注释

## 🚀 部署说明

### 生产环境部署
1. 构建前端项目：`npm run build`
2. 配置后端环境变量
3. 使用 PM2 或 Docker 部署后端服务
4. 配置 Nginx 反向代理

## 📝 更新日志

### v1.0.0
- ✅ 完成基础的商品管理功能
- ✅ 实现美观的前端界面
- ✅ 添加删除商品功能
- ✅ 优化用户体验和视觉效果

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## �� 许可证

MIT License "# shop" 
