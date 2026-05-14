<template>
  <div v-if="loading" class="page-loading">
    <div class="loading-container">
      <el-icon class="loading-icon" :size="40">
        <Loading />
      </el-icon>
      <div class="loading-text">{{ text }}</div>
      <div class="loading-progress" v-if="showProgress">
        <el-progress 
          :percentage="progress" 
          :stroke-width="4"
          :show-text="false"
          color="#5e35b1"
        />
        <div class="progress-text">{{ progress }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Loading } from '@element-plus/icons-vue'

// Props
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: '页面加载中...'
  },
  showProgress: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0
  }
})

// 响应式数据
const loading = ref(props.loading)
const text = ref(props.text)
const showProgress = ref(props.showProgress)
const progress = ref(props.progress)

// 监听props变化
watch(() => props.loading, (newVal) => {
  loading.value = newVal
})

watch(() => props.text, (newVal) => {
  text.value = newVal
})

watch(() => props.showProgress, (newVal) => {
  showProgress.value = newVal
})

watch(() => props.progress, (newVal) => {
  progress.value = newVal
})
</script>

<style scoped>
.page-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.loading-container {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  min-width: 200px;
}

.loading-icon {
  color: #5e35b1;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.loading-text {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
  font-weight: 500;
}

.loading-progress {
  margin-top: 20px;
}

.progress-text {
  margin-top: 8px;
  font-size: 14px;
  color: #666;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .loading-container {
    padding: 30px 20px;
    min-width: 160px;
  }
  
  .loading-text {
    font-size: 14px;
  }
}
</style> 