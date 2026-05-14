const axios = require('axios');

async function testAPI() {
    try {
        console.log('=== 测试API ===\n');

        // 1. 测试获取商品列表
        console.log('1. 获取商品列表...');
        const productsResponse = await axios.get('http://localhost:3000/api/products');
        console.log('商品数量:', productsResponse.data.data.products.length);
        productsResponse.data.data.products.forEach(p => {
            console.log(`  - ID: ${p.id}, 名称: ${p.name}`);
        });

        // 2. 测试获取所有订单
        console.log('\n2. 获取所有订单...');
        const allOrdersResponse = await axios.get('http://localhost:3000/api/orders');
        console.log('总订单数:', allOrdersResponse.data.data.total);
        console.log('订单列表:', allOrdersResponse.data.data.orders.map(o => ({
            id: o.id,
            product_name: o.product_name,
            quantity: o.quantity,
            total_amount: o.total_amount,
            status: o.status
        })));

        // 3. 测试根据商品ID获取订单
        console.log('\n3. 测试根据商品ID获取订单...');
        for (let i = 1; i <= 5; i++) {
            try {
                const response = await axios.get(`http://localhost:3000/api/orders/product/${i}`);
                const orders = response.data.data.orders || [];
                console.log(`商品ID ${i} 的订单数量: ${orders.length}`);
                if (orders.length > 0) {
                    orders.forEach(order => {
                        console.log(`  - 订单号: ${order.id}, 商品: ${order.product_name}, 数量: ${order.quantity}, 金额: ¥${order.total_amount}, 状态: ${order.status}`);
                    });
                }
            } catch (error) {
                console.log(`商品ID ${i} 没有订单或出错:`, error.response?.data?.message || error.message);
            }
        }

    } catch (error) {
        console.error('API测试失败:', error.response ? error.response.data : error.message);
    }
}

testAPI(); 