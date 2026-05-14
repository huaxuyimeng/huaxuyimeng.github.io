const productModel = require('../models/productModel');

// 获取所有商品
async function getAllProducts(ctx) {
    const page = parseInt(ctx.query.page) || 1;
    const pageSize = parseInt(ctx.query.pageSize) || 10;

    try {
        const result = await productModel.getAllProducts(page, pageSize);
        ctx.body = { data: result };
    } catch (error) {
        console.error('获取商品列表出错:', error);
        ctx.status = 500;
        ctx.body = { message: '查询失败' };
    }
}

// 创建商品
async function createProduct(ctx) {
    const { name, price, merchant_id, stock, image_url, description } = ctx.request.body;

    if (!name || price === undefined || merchant_id === undefined) {
        ctx.status = 400;
        ctx.body = { message: '商品名称、价格和商户ID是必需的' };
        return;
    }

    try {
        const productId = await productModel.createProduct(name, price, merchant_id, stock, image_url, description);
        ctx.status = 201;
        ctx.body = { message: '商品创建成功', productId };
    } catch (error) {
        console.error('创建商品出错:', error);
        ctx.status = 500;
        ctx.body = { message: '创建失败: ' + error.message };
    }
}

// 更新商品
async function updateProduct(ctx) {
    const { name, price, merchant_id, stock, image_url, description } = ctx.request.body;
    try {
        const affectedRows = await productModel.updateProduct(ctx.params.id, name, price, merchant_id, stock, image_url, description);
        if (affectedRows > 0) {
            ctx.body = { message: '商品更新成功' };
        } else {
            ctx.status = 404;
            ctx.body = { message: '商品未找到' };
        }
    } catch (error) {
        ctx.status = 500;
        ctx.body = { message: '更新失败' };
    }
}

// 获取商品详情
async function getProductDetail(ctx) {
    try {
        const product = await productModel.getProductById(ctx.params.id);
        if (product) {
            ctx.body = { data: product };
        } else {
            ctx.status = 404;
            ctx.body = { message: '商品未找到' };
        }
    } catch (error) {
        ctx.status = 500;
        ctx.body = { message: '查询失败' };
    }
}

// 删除商品
async function deleteProduct(ctx) {
    try {
        const affectedRows = await productModel.deleteProduct(ctx.params.id);
        if (affectedRows > 0) {
            ctx.body = { message: '商品删除成功' };
        } else {
            ctx.status = 404;
            ctx.body = { message: '商品未找到' };
        }
    } catch (error) {
        ctx.status = 500;
        ctx.body = { message: '删除失败' };
    }
}

// 搜索商品
async function searchProducts(ctx) {
    try {
        const products = await productModel.searchProducts(ctx.query.keyword);
        ctx.body = { data: products };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { message: '搜索失败' };
    }
}

// 按价格筛选商品
async function filterByPrice(ctx) {
    try {
        const products = await productModel.filterByPrice(ctx.query.min, ctx.query.max);
        ctx.body = { data: products };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { message: '筛选失败' };
    }
}

// 根据商户ID获取商品列表
async function getProductsByMerchant(ctx) {
    const { merchantId } = ctx.params;
    const page = parseInt(ctx.query.page) || 1;
    const pageSize = parseInt(ctx.query.pageSize) || 10;

    try {
        const result = await productModel.getProductsByMerchant(merchantId, page, pageSize);
        ctx.body = { data: result };
    } catch (error) {
        console.error('获取商户商品列表出错:', error);
        ctx.status = 500;
        ctx.body = { message: '查询失败' };
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductsByMerchant,
    getProductDetail,
    updateProduct,
    deleteProduct,
    searchProducts,
    filterByPrice
};