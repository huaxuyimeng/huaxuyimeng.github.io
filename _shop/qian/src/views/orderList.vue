<template>
  <div class="order-list-container">
    <div v-if="merchantInfo" class="merchant-info">
      <span>店铺名称：{{ merchantInfo.shop_name }}</span>
      <span style="margin-left: 24px;">登录账户：{{ merchantInfo.name }}</span>
    </div>
    <el-table :data="orders" style="width: 100%" v-loading="loading" :empty-text="tableEmptyText">
      <el-table-column prop="id" label="订单ID" width="80" />
      <el-table-column prop="productName" label="商品名称" />
      <el-table-column prop="merchantName" label="商家" v-if="isAdmin" />
      <el-table-column prop="price" label="单价" />
      <el-table-column prop="quantity" label="数量" />
      <el-table-column prop="totalAmount" label="总金额" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="createTime" label="下单时间" />
    </el-table>
    <el-pagination
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchOrders"
      style="margin-top: 20px; text-align: right;"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getOrders } from '@/api/order'
import { getMerchants } from '@/api/merchant'

const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
const isAdmin = userInfo.is_admin === 1
const merchantId = userInfo.merchant_id || userInfo.id // 兼容不同字段
const merchantInfo = ref(null)

const orders = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableEmptyText = '暂无订单数据'

// 获取商家信息
const fetchMerchantInfo = async () => {
  if (!merchantId) return
  try {
    const res = await getMerchants()
    merchantInfo.value = res.data.data.find(m => m.id === merchantId)
  } catch (e) {
    ElMessage.error('获取商家信息失败')
    merchantInfo.value = null
  }
}

// 获取订单列表
const fetchOrders = async () => {
  loading.value = true
  try {
    let params = {
      page: currentPage.value,
      pageSize: pageSize.value
    }
    if (!isAdmin && merchantId) {
      params.merchant_id = merchantId
    }
    const response = await getOrders(params)
    const items = response.data.data?.orders || response.data.data || response.data.items || []
    orders.value = items.map(item => ({
      id: item.id,
      merchantName: item.merchant_name || item.merchantName || '',
      productName: item.product_name || item.productName || item.name || '',
      price: item.price || 0,
      quantity: item.quantity || 0,
      totalAmount: item.total_amount || item.totalAmount || (item.price * item.quantity) || 0,
      status: item.status || '',
      createTime: item.created_at || item.createTime || ''
    }))
    total.value = response.data.data?.total || response.data.total || orders.value.length
  } catch (error) {
    ElMessage.error('获取订单列表失败')
    orders.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMerchantInfo()
  fetchOrders()
})
</script>

<style scoped>
.order-list-container {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
}
.merchant-info {
  margin-bottom: 16px;
  font-size: 15px;
  color: #666;
}
</style> 