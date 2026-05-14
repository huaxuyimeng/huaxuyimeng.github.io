const axios = require('axios');

async function testFrontendRequest() {
    try {
        console.log('=== 模拟前端请求测试 ===');

        // 模拟前端可能发送的数据格式
        const testCases = [
            {
                name: '测试1: 正常数据',
                data: {
                    name: '测试商品',
                    price: 99.99,
                    merchant_id: 1
                }
            },
            {
                name: '测试2: 空字符串merchant_id',
                data: {
                    name: '测试商品',
                    price: 99.99,
                    merchant_id: ''
                }
            },
            {
                name: '测试3: null merchant_id',
                data: {
                    name: '测试商品',
                    price: 99.99,
                    merchant_id: null
                }
            },
            {
                name: '测试4: 字符串merchant_id',
                data: {
                    name: '测试商品',
                    price: 99.99,
                    merchant_id: '1'
                }
            }
        ];

        for (const testCase of testCases) {
            console.log(`\n${testCase.name}:`);
            console.log('发送数据:', JSON.stringify(testCase.data, null, 2));

            try {
                const response = await axios.post('http://localhost:3000/products', testCase.data);
                console.log('✅ 成功 - 响应:', response.data);
            } catch (error) {
                console.log('❌ 失败 - 状态:', error.response?.status);
                console.log('❌ 失败 - 消息:', error.response?.data?.message);
            }
        }

    } catch (error) {
        console.error('测试失败:', error.message);
    }
}

testFrontendRequest(); 