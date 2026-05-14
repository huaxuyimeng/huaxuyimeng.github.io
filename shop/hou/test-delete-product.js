const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testDeleteProduct() {
    try {
        console.log('=== 测试删除商品功能 ===');

        // 1. 先获取所有商品
        console.log('\n1. 获取商品列表...');
        const listResponse = await axios.get(`${BASE_URL}/products`);
        console.log('商品列表:', listResponse.data);

        if (listResponse.data.data.products.length === 0) {
            console.log('没有商品可以删除，先创建一个商品...');

            // 创建商品
            const createResponse = await axios.post(`${BASE_URL}/products`, {
                name: '测试删除商品',
                price: 99.99,
                merchant_id: 1
            });
            console.log('创建商品成功:', createResponse.data);

            // 重新获取商品列表
            const newListResponse = await axios.get(`${BASE_URL}/products`);
            console.log('新的商品列表:', newListResponse.data);
        }

        // 2. 获取第一个商品进行删除测试
        const products = listResponse.data.data.products;
        if (products.length > 0) {
            const firstProduct = products[0];
            console.log(`\n2. 准备删除商品: ${firstProduct.name} (ID: ${firstProduct.id})`);

            // 3. 删除商品
            console.log('\n3. 执行删除操作...');
            const deleteResponse = await axios.delete(`${BASE_URL}/products/${firstProduct.id}`);
            console.log('删除响应:', deleteResponse.data);

            // 4. 验证删除结果
            console.log('\n4. 验证删除结果...');
            const verifyResponse = await axios.get(`${BASE_URL}/products`);
            console.log('删除后的商品列表:', verifyResponse.data);

            const deletedProduct = verifyResponse.data.data.products.find(p => p.id === firstProduct.id);
            if (!deletedProduct) {
                console.log('✅ 删除成功！商品已从列表中移除');
            } else {
                console.log('❌ 删除失败！商品仍然存在于列表中');
            }
        } else {
            console.log('没有商品可以删除');
        }

    } catch (error) {
        console.error('测试失败:', error.response?.data || error.message);
    }
}

testDeleteProduct(); 