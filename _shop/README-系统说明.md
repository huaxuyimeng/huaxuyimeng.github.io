# 商家管理系统

基于Vue3 + Node.js + MySQL的完整商家管理系统，支持用户登录、商家管理和商品展示。

## 🚀 快速启动

### 方法一：使用启动脚本（推荐）
双击运行 `start-system.bat` 文件，系统会自动启动后端和前端服务。

### 方法二：手动启动

1. **启动后端服务**
```bash
cd merchant-system
npm install
npm start
```

2. **启动前端应用**
```bash
cd merchant-vue
npm install
npm run dev
```

## 📋 系统功能

### 🔐 登录功能
- **用户登录**: 支持管理员和普通用户登录
- **商家登录**: 支持商家独立登录
- **记住密码**: 自动保存登录信息
- **智能跳转**: 根据用户类型自动跳转到相应页面

### 🏪 商家管理
- **商家列表**: 展示所有商家信息
- **商家详情**: 查看商家详细信息
- **增删改查**: 完整的商家管理功能
- **搜索筛选**: 支持按名称搜索商家

### 📦 商品展示
- **商品列表**: 展示商家商品
- **商品详情**: 查看商品详细信息
- **库存管理**: 显示商品库存状态

## 👥 用户角色

### 管理员 (admin1 / 123456)
- 可以管理所有商家
- 拥有增删改查权限
- 访问商家管理页面

### 普通用户 (user2 / 123456)
- 只能查看商家列表
- 无管理权限
- 访问商家列表页面

### 商家用户
- **商户A** (商户A / 123456)
- **商户B** (商户B / 123456)
- 可以查看自己的商品
- 访问商品列表页面

## 🗄️ 数据库结构

### 用户表 (users)
```sql
- user_id: 用户ID
- username: 用户名
- user_password: 密码(MD5加密)
- is_admin: 是否管理员
- created_at: 创建时间
```

### 商家表 (merchants)
```sql
- id: 商家ID
- name: 商家名称
- shop_name: 店铺名称
- password: 密码(MD5加密)
- user_id: 关联用户ID
- created_at: 创建时间
```

### 商品表 (products)
```sql
- id: 商品ID
- name: 商品名称
- price: 价格
- merchant_id: 商家ID
- stock: 库存
- image_url: 图片URL
- description: 描述
- created_at: 创建时间
```

### 订单表 (orders)
```sql
- id: 订单ID
- merchant_id: 商家ID
- product_id: 商品ID
- quantity: 数量
- status: 状态
- total_amount: 总金额
- created_at: 创建时间
```

## 🔧 技术栈

### 前端
- **Vue 3**: 渐进式JavaScript框架
- **Vue Router**: 官方路由管理器
- **Vite**: 快速构建工具
- **原生CSS**: 现代化样式设计

### 后端
- **Node.js**: JavaScript运行时
- **Express**: Web应用框架
- **MySQL**: 关系型数据库
- **mysql2**: MySQL驱动

## 📁 项目结构

```
├── merchant-system/          # 后端项目
│   ├── src/
│   │   ├── controllers/      # 控制器
│   │   ├── models/          # 数据模型
│   │   ├── routes/          # 路由
│   │   └── app.js          # 主应用
│   ├── database/            # 数据库脚本
│   └── package.json
│
├── merchant-vue/             # 前端项目
│   ├── src/
│   │   ├── api/            # API接口
│   │   ├── components/     # 组件
│   │   ├── router/         # 路由配置
│   │   ├── utils/          # 工具函数
│   │   ├── views/          # 页面
│   │   ├── App.vue         # 主组件
│   │   └── main.js         # 入口文件
│   └── package.json
│
├── start-system.bat         # 启动脚本
└── README-系统说明.md       # 说明文档
```

## 🌐 API接口

### 认证接口
- `POST /api/auth/user-login` - 用户登录
- `POST /api/auth/merchant-login` - 商家登录

### 商家接口
- `GET /api/merchants` - 获取商家列表
- `GET /api/merchants/:id` - 获取商家详情
- `POST /api/merchants` - 创建商家
- `PUT /api/merchants/:id` - 更新商家
- `DELETE /api/merchants/:id` - 删除商家
- `GET /api/merchants/:merchantId/products` - 获取商家商品

### 系统接口
- `GET /health` - 健康检查
- `GET /api` - API信息

## 🎨 界面特色

- **现代化设计**: 简洁美观的界面设计
- **响应式布局**: 支持各种屏幕尺寸
- **用户体验**: 流畅的交互动画
- **直观导航**: 清晰的页面导航

## 🔒 安全特性

- **密码加密**: MD5加密存储
- **路由守卫**: 权限控制
- **输入验证**: 前端表单验证
- **错误处理**: 完善的错误处理机制

## 📝 使用说明

1. **首次使用**: 运行数据库脚本创建表结构
2. **登录系统**: 使用提供的演示账号登录
3. **功能体验**: 根据用户角色体验不同功能
4. **数据管理**: 管理员可以管理商家信息

## 🛠️ 开发说明

### 环境要求
- Node.js 16+
- MySQL 8.0+
- 现代浏览器

### 开发模式
- 前端热重载
- 后端自动重启
- 实时错误提示

### 部署建议
- 生产环境使用PM2管理Node.js进程
- 配置Nginx反向代理
- 启用HTTPS
- 数据库定期备份

## 📞 技术支持

如有问题，请检查：
1. 数据库连接配置
2. 端口占用情况
3. 依赖包安装状态
4. 环境变量配置

---

**商家管理系统** - 让商家管理更简单！ 