<template>
  <div v-if="error" class="error-boundary">
    <div class="error-container">
      <el-icon class="error-icon" :size="48">
        <Warning />
      </el-icon>
      <h2 class="error-title">页面出现错误</h2>
      <p class="error-message">{{ error.message || '发生了未知错误' }}</p>
      <div class="error-actions">
        <el-button type="primary" @click="handleRetry">
          <el-icon><Refresh /></el-icon>
          重试
        </el-button>
        <el-button @click="handleGoHome">
          <el-icon><House /></el-icon>
          返回首页
        </el-button>
        <el-button @click="handleGoBack">
          <el-icon><Back /></el-icon>
          返回上页
        </el-button>
      </div>
      <div class="error-details" v-if="showDetails">
        <el-collapse>
          <el-collapse-item title="错误详情" name="error-details">
            <pre class="error-stack">{{ error.stack }}</pre>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
  <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'
import { Warning, Refresh, House, Back } from '@element-plus/icons-vue'
import { showError } from '@/utils/notification'

const router = useRouter()

// 响应式数据
const error = ref(null)
const showDetails = ref(false)

// Props
const props = defineProps({
  fallback: {
    type: Function,
    default: null
  }
})

// 错误捕获
onErrorCaptured((err, instance, info) => {
  console.error('组件错误:', err, instance, info)
  
  error.value = {
    message: err.message,
    stack: err.stack,
    info: info
  }
  
  showError('页面出现错误，请重试')
  
  // 如果有自定义fallback，使用它
  if (props.fallback) {
    props.fallback(err, instance, info)
  }
  
  return false // 阻止错误继续传播
})

// 重试
function handleRetry() {
  error.value = null
  window.location.reload()
}

// 返回首页
function handleGoHome() {
  error.value = null
  router.push('/product')
}

// 返回上页
function handleGoBack() {
  error.value = null
  router.go(-1)
}

// 切换错误详情显示
function toggleDetails() {
  showDetails.value = !showDetails.value
}
</script>

<style scoped>
.error-boundary {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  padding: 20px;
}

.error-container {
  text-align: center;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.error-icon {
  color: #f56c6c;
  margin-bottom: 20px;
}

.error-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 16px;
  font-weight: bold;
}

.error-message {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.5;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.error-details {
  margin-top: 20px;
  text-align: left;
}

.error-stack {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  font-size: 12px;
  color: #666;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 200px;
  overflow-y: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-container {
    padding: 30px 20px;
  }
  
  .error-title {
    font-size: 20px;
  }
  
  .error-message {
    font-size: 14px;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .error-actions .el-button {
    width: 100%;
    max-width: 200px;
  }
}
</style> 