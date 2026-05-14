const orderModel = require('../models/orderModel');

// 获取所有订单
async function getAllOrders(ctx) {
  const page = parseInt(ctx.query.page) || 1;
  const pageSize = parseInt(ctx.query.pageSize) || 10;

  try {
    const orders = await orderModel.getAllOrders(page, pageSize);
    ctx.body = { data: orders };
  } catch (error) {
    console.error('获取订单列表出错:', error);
    ctx.status = 500;
    ctx.body = { message: '查询失败' };
  }
}

// 根据商户ID获取订单列表
async function getOrdersByMerchant(ctx) {
  const { merchantId } = ctx.params;
  const page = parseInt(ctx.query.page) || 1;
  const pageSize = parseInt(ctx.query.pageSize) || 10;

  try {
    const orders = await orderModel.getOrdersByMerchant(merchantId, page, pageSize);
    ctx.body = { data: orders };
  } catch (error) {
    console.error('获取商户订单列表出错:', error);
    ctx.status = 500;
    ctx.body = { message: '查询失败' };
  }
}

// 根据商品ID获取订单列表
async function getOrdersByProduct(ctx) {
  const { productId } = ctx.params;
  const page = parseInt(ctx.query.page) || 1;
  const pageSize = parseInt(ctx.query.pageSize) || 10;

  try {
    const orders = await orderModel.getOrdersByProduct(productId, page, pageSize);
    ctx.body = { data: orders };
  } catch (error) {
    console.error('获取商品订单列表出错:', error);
    ctx.status = 500;
    ctx.body = { message: '查询失败' };
  }
}

// 创建订单
async function createOrder(ctx) {
  const { merchant_id, product_id, quantity, total_amount } = ctx.request.body;

  // 参数验证
  if (!merchant_id || !product_id || !quantity || !total_amount) {
    ctx.status = 400;
    ctx.body = { message: '缺少必要参数' };
    return;
  }

  try {
    const orderId = await orderModel.createOrder(merchant_id, product_id, quantity, total_amount);
    ctx.status = 201;
    ctx.body = { message: '订单创建成功', orderId };
  } catch (error) {
    console.error('创建订单出错:', error);
    ctx.status = 500;
    ctx.body = { message: '创建失败: ' + error.message };
  }
}

// 更新订单状态
async function updateOrderStatus(ctx) {
  const { id } = ctx.params;
  const { status } = ctx.request.body;

  if (!status) {
    ctx.status = 400;
    ctx.body = { message: '订单状态不能为空' };
    return;
  }

  try {
    const affectedRows = await orderModel.updateOrderStatus(id, status);
    if (affectedRows > 0) {
      ctx.body = { message: '订单状态更新成功' };
    } else {
      ctx.status = 404;
      ctx.body = { message: '订单未找到' };
    }
  } catch (error) {
    console.error('更新订单状态出错:', error);
    ctx.status = 500;
    ctx.body = { message: '更新失败' };
  }
}

// 获取订单详情
async function getOrderDetail(ctx) {
  const { id } = ctx.params;

  try {
    const order = await orderModel.getOrderById(id);
    if (order) {
      ctx.body = { data: order };
    } else {
      ctx.status = 404;
      ctx.body = { message: '订单未找到' };
    }
  } catch (error) {
    console.error('获取订单详情出错:', error);
    ctx.status = 500;
    ctx.body = { message: '查询失败' };
  }
}

// 删除订单
async function deleteOrder(ctx) {
  const { id } = ctx.params;

  try {
    const affectedRows = await orderModel.deleteOrder(id);
    if (affectedRows > 0) {
      ctx.body = { message: '订单删除成功' };
    } else {
      ctx.status = 404;
      ctx.body = { message: '订单未找到' };
    }
  } catch (error) {
    console.error('删除订单出错:', error);
    ctx.status = 500;
    ctx.body = { message: '删除失败' };
  }
}

// 多表关联：获取所有订单及商品、商户信息
async function getAllOrdersWithDetail(ctx) {
  try {
    const orders = await orderModel.getAllOrdersWithDetail();
    ctx.body = { data: orders };
  } catch (error) {
    console.error('多表关联获取订单出错:', error);
    ctx.status = 500;
    ctx.body = { message: '查询失败' };
  }
}

module.exports = {
  getAllOrders,
  getOrdersByMerchant,
  getOrdersByProduct,
  createOrder,
  updateOrderStatus,
  getOrderDetail,
  deleteOrder,
  getAllOrdersWithDetail
};
