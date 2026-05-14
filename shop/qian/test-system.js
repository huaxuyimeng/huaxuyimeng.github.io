// 系统测试脚本
console.log('🔍 开始系统测试...')

// 测试本地存储
console.log('📦 测试本地存储...')
localStorage.setItem('test', 'test-value')
const testValue = localStorage.getItem('test')
console.log('本地存储测试:', testValue === 'test-value' ? '✅ 通过' : '❌ 失败')

// 测试API请求
console.log('🌐 测试API请求...')
fetch('/api/user/info', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
})
    .then(response => {
        console.log('API响应状态:', response.status)
        return response.json()
    })
    .then(data => {
        console.log('API响应数据:', data)
    })
    .catch(error => {
        console.log('API请求失败:', error.message)
    })

// 测试路由
console.log('🛣️ 测试路由...')
const currentPath = window.location.pathname
console.log('当前路径:', currentPath)

// 测试Element Plus
console.log('🎨 测试Element Plus...')
if (typeof ElMessage !== 'undefined') {
    console.log('Element Plus加载: ✅ 成功')
} else {
    console.log('Element Plus加载: ❌ 失败')
}

// 测试Vue
console.log('⚡ 测试Vue...')
if (typeof Vue !== 'undefined') {
    console.log('Vue版本:', Vue.version)
    console.log('Vue加载: ✅ 成功')
} else {
    console.log('Vue加载: ❌ 失败')
}

console.log('🎉 系统测试完成!') 