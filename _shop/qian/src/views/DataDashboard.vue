<template>
  <div class="page">
    <h2>数据大屏页面</h2>
    <p>这里是数据大屏的静态内容。</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import dashboardApi from '@/api/dashboard'

const stats = ref({ users: 0, merchants: 0, products: 0, orders: 0 })
const orderTrendChart = ref(null)
const hotProductChart = ref(null)

let orderChart = null
let productChart = null

const fetchStats = async () => {
  try {
    const res = await dashboardApi.getStats()
    if (res.data && res.data.code === 200) {
      stats.value = res.data.data || { users: 0, merchants: 0, products: 0, orders: 0 }
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
    ElMessage.error('获取统计数据失败')
  }
}

const initOrderTrendChart = () => {
  if (orderTrendChart.value) {
    orderChart = echarts.init(orderTrendChart.value)
    const option = {
      title: {
        text: '订单趋势',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [120, 200, 150, 80, 70, 110],
        type: 'line',
        smooth: true
      }]
    }
    orderChart.setOption(option)
  }
}

const initHotProductChart = () => {
  if (hotProductChart.value) {
    productChart = echarts.init(hotProductChart.value)
    const option = {
      title: {
        text: '热门商品',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [{
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: '商品A' },
          { value: 735, name: '商品B' },
          { value: 580, name: '商品C' },
          { value: 484, name: '商品D' },
          { value: 300, name: '商品E' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    }
    productChart.setOption(option)
  }
}

const fetchOrderTrend = async () => {
  try {
    const res = await dashboardApi.getOrderTrend()
    if (res.data && res.data.code === 200 && orderChart) {
      // 更新图表数据
      orderChart.setOption({
        series: [{
          data: res.data.data || [120, 200, 150, 80, 70, 110]
        }]
      })
    }
  } catch (error) {
    console.error('获取订单趋势失败:', error)
  }
}

const fetchHotProducts = async () => {
  try {
    const res = await dashboardApi.getHotProducts()
    if (res.data && res.data.code === 200 && productChart) {
      // 更新图表数据
      productChart.setOption({
        series: [{
          data: res.data.data || [
            { value: 1048, name: '商品A' },
            { value: 735, name: '商品B' },
            { value: 580, name: '商品C' },
            { value: 484, name: '商品D' },
            { value: 300, name: '商品E' }
          ]
        }]
      })
    }
  } catch (error) {
    console.error('获取热门商品失败:', error)
  }
}

onMounted(() => {
  fetchStats()
  initOrderTrendChart()
  initHotProductChart()
  
  // 延迟获取数据，确保图表已初始化
  setTimeout(() => {
    fetchOrderTrend()
    fetchHotProducts()
  }, 100)
})

// 组件卸载时销毁图表
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (orderChart) {
    orderChart.dispose()
  }
  if (productChart) {
    productChart.dispose()
  }
})
</script>

<style scoped>
.page {
  padding: 40px;
  text-align: center;
}
</style> 