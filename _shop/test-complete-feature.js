const axios = require('axios');

async function testCompleteFeature() {
    try {
        console.log('=== 测试商品订单功能 ===\n');

        // 1. 测试获取所有商品
        console.log('1. 获取所有商品...');
        const productsResponse = await axios.get('http://localhost:3000/api/products');
        console.log('商品列表:', productsResponse.data.data.products.map(p => ({ id: p.id, name: p.name })));

        // 2. 测试根据商品ID获取订单
        console.log('\n2. 测试根据商品ID获取订单...');

        for (let i = 1; i <= 5; i++) {
            try {
                const ordersResponse = await axios.get(`http://localhost:3000/api/orders/product/${i}`);
                const orders = ordersResponse.data.data.orders || [];
                console.log(`商品ID ${i} 的订单数量: ${orders.length}`);

                if (orders.length > 0) {
                    console.log('订单详情:');
                    orders.forEach(order => {
                        console.log(`  - 订单号: ${order.id}, 商品: ${order.product_name}, 数量: ${order.quantity}, 金额: ¥${order.total_amount}, 状态: ${order.status}`);
                    });
                }
            } catch (error) {
                console.log(`商品ID ${i} 没有订单或出错:`, error.response?.data?.message || error.message);
            }
        }

        // 3. 测试更新订单状态
        console.log('\n3. 测试更新订单状态...');
        try {
            const updateResponse = await axios.put('http://localhost:3000/api/orders/2/status', {
                status: '已发货'
            });
            console.log('更新订单状态成功:', updateResponse.data);
        } catch (error) {
            console.log('更新订单状态失败:', error.response?.data?.message || error.message);
        }

        console.log('\n=== 测试完成 ===');

    } catch (error) {
        console.error('测试失败:', error.response ? error.response.data : error.message);
    }
}

testCompleteFeature(); 