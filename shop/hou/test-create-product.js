const axios = require('axios');

async function testCreateProduct() {
    try {
        console.log('=== 测试创建商品API ===');

        const testProduct = {
            name: '测试商品-' + Date.now(),
            price: 99.99,
            merchant_id: 1
        };

        console.log('发送数据:', JSON.stringify(testProduct, null, 2));

        const response = await axios.post('http://localhost:3000/products', testProduct);

        console.log('✅ 创建商品成功!');
        console.log('响应状态:', response.status);
        console.log('响应数据:', response.data);

    } catch (error) {
        console.error('❌ 创建商品失败!');
        if (error.response) {
            console.error('响应状态:', error.response.status);
            console.error('响应数据:', error.response.data);
        } else {
            console.error('网络错误:', error.message);
        }
    }
}

testCreateProduct(); 