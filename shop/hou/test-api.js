const axios = require('axios');

const API_BASE = 'http://localhost:3000';

async function testCreateProduct() {
    try {
        console.log('测试创建商品API...');

        const testProduct = {
            name: '测试商品',
            price: 99.99,
            merchant_id: 1
        };

        console.log('发送数据:', testProduct);

        const response = await axios.post(`${API_BASE}/products`, testProduct);

        console.log('✅ 创建商品成功');
        console.log('响应状态:', response.status);
        console.log('响应数据:', response.data);

    } catch (error) {
        console.error('❌ 创建商品失败');
        if (error.response) {
            console.error('响应状态:', error.response.status);
            console.error('响应数据:', error.response.data);
        } else {
            console.error('错误:', error.message);
        }
    }
}

async function testGetProducts() {
    try {
        console.log('\n测试获取商品列表API...');

        const response = await axios.get(`${API_BASE}/products`);

        console.log('✅ 获取商品列表成功');
        console.log('响应状态:', response.status);
        console.log('响应数据:', response.data);

    } catch (error) {
        console.error('❌ 获取商品列表失败');
        if (error.response) {
            console.error('响应状态:', error.response.status);
            console.error('响应数据:', error.response.data);
        } else {
            console.error('错误:', error.message);
        }
    }
}

async function testGetMerchants() {
    try {
        console.log('\n测试获取商户列表API...');

        const response = await axios.get(`${API_BASE}/merchants`);

        console.log('✅ 获取商户列表成功');
        console.log('响应状态:', response.status);
        console.log('响应数据:', response.data);

    } catch (error) {
        console.error('❌ 获取商户列表失败');
        if (error.response) {
            console.error('响应状态:', error.response.status);
            console.error('响应数据:', error.response.data);
        } else {
            console.error('错误:', error.message);
        }
    }
}

async function runTests() {
    await testGetMerchants();
    await testGetProducts();
    await testCreateProduct();

    console.log('\n测试完成');
    process.exit(0);
}

runTests(); 