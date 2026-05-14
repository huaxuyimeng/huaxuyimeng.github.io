-- 商品表
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  merchant_id INT NOT NULL,
  created_at DATETIME,
  stock INT DEFAULT 0,
  image_url VARCHAR(255),
  description VARCHAR(255)
);

-- 商户表
CREATE TABLE IF NOT EXISTS merchants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  shop_name VARCHAR(100),
  password VARCHAR(64) NOT NULL,
  created_at DATETIME
);

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  user_password VARCHAR(64) NOT NULL,
  merchant_id INT,
  created_at DATETIME,
  is_admin TINYINT DEFAULT 0
);

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  merchant_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  status VARCHAR(20) DEFAULT '待发货',
  created_at DATETIME,
  total_amount DECIMAL(10,2)
); 