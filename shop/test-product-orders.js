const axios = require('axios');

async function testProductOrders() {
    try {
        console.log('测试根据商品ID获取订单列表...');

        // 测试获取商品ID为1的订单
        const response = await axios.get('http://localhost:3000/api/orders/product/1');
        console.log('商品ID 1 的订单列表:', JSON.stringify(response.data, null, 2));

        // 测试获取商品ID为2的订单
        const response2 = await axios.get('http://localhost:3000/api/orders/product/2');
        console.log('商品ID 2 的订单列表:', JSON.stringify(response2.data, null, 2));

        // 测试获取商品ID为3的订单
        const response3 = await axios.get('http://localhost:3000/api/orders/product/3');
        console.log('商品ID 3 的订单列表:', JSON.stringify(response3.data, null, 2));

        console.log('测试完成！');
    } catch (error) {
        console.error('测试失败:', error.response ? error.response.data : error.message);
    }
}

testProductOrders(); 