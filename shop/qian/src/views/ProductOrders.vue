<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOrders } from '../api/order'
import merchantApi from '@/api/merchant'

const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
const merchantId = userInfo.merchant_id
const merchantInfo = ref(null)
const loading = ref(false)
const orders = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableEmptyText = '暂无订单数据'
const isAdmin = userInfo.is_admin === 1
const route = useRoute()

// 获取商家信息
const fetchMerchantInfo = async () => {
  if (!merchantId) return
  try {
    const res = await merchantApi.getMerchants()
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
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value
    }
    if (!isAdmin && merchantId) {
      params.merchant_id = merchantId
    }
    const response = await getOrders({ product_id: route.params.productId, ...params })
    if (response.data && response.data.data) {
      orders.value = response.data.data.orders || []
      total.value = response.data.data.total || 0
    } else {
      orders.value = []
      total.value = 0
    }
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

const viewOrder = (order) => {
  ElMessageBox.alert(
    `订单号: ${order.id}<br/>用户: ${order.user_name}<br/>金额: ${order.amount}<br/>状态: ${order.status === 1 ? '已支付' : '未支付'}<br/>下单时间: ${order.created_at}`,
    '订单详情',
    { dangerouslyUseHTMLString: true }
  )
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchOrders()
}
</script>

<template>
  <div class="product-orders">
    <div v-if="merchantInfo" class="merchant-info">
      <span>店铺名称：{{ merchantInfo.shop_name }}</span>
      <span style="margin-left: 24px;">登录账户：{{ merchantInfo.name }}</span>
    </div>
    <el-card>
      <el-table
        :data="orders"
        v-loading="loading"
        :empty-text="tableEmptyText"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="订单号" width="120" />
        <el-table-column prop="user_name" label="用户" width="120" />
        <el-table-column prop="amount" label="金额" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <span>{{ scope.row.status === 1 ? '已支付' : '未支付' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="下单时间" width="180" />
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewOrder(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.product-orders {
  padding: 24px;
}
.merchant-info {
  margin-bottom: 16px;
  font-size: 16px;
  color: #333;
}
.pagination-wrapper {
  margin-top: 16px;
  text-align: right;
}
</style> 