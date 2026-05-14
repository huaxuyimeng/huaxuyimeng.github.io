<template>
  <div class="login-container">
    <div class="login-background">
      <div class="login-card">
        <div class="login-header">
          <img src="/logo.svg" alt="logo" class="login-logo" />
          <h1 class="login-title">商家管理系统</h1>
          <p class="login-subtitle">请输入管理员账号密码</p>
        </div>
        <form class="login-form" @submit.prevent="handleLogin" autocomplete="on">
          <div class="form-group">
            <label>用户名</label>
            <div class="input-wrapper">
              <input v-model="form.username" ref="usernameRef" type="text" placeholder="请输入用户名" required @keyup.enter="focusPassword" :disabled="loading" @focus="clearError" tabindex="1" />
              <span v-if="form.username" class="clear-btn" @click="form.username='';$refs.usernameRef.focus()">×</span>
            </div>
          </div>
          <div class="form-group">
            <label>密码</label>
            <div class="input-wrapper">
              <input v-model="form.password" ref="passwordRef" :type="showPwd ? 'text' : 'password'" placeholder="请输入密码" required @keyup.enter="handleLogin" :disabled="loading" :class="{ 'input-error': error }" @focus="clearError" tabindex="2" />
              <span class="toggle-pwd" @click="showPwd = !showPwd">{{ showPwd ? '🙈' : '👁️' }}</span>
              <span v-if="form.password" class="clear-btn" @click="form.password='';$refs.passwordRef.focus()">×</span>
            </div>
          </div>
          <button type="submit" class="login-btn" :disabled="!form.username || !form.password || loading" tabindex="3">
            <span v-if="loading" class="loading-spinner"></span>
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>
        <transition name="fade">
          <div v-if="error" class="error-message">
            <span>{{ error }}</span>
            <button class="close-btn" @click="error = ''">×</button>
          </div>
        </transition>
        <div class="login-footer">
          <span>系统版本：v2.0.0 | 技术支持：专业进阶期末项目</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const showPwd = ref(false)
const usernameRef = ref(null)
const passwordRef = ref(null)
const form = reactive({
  username: '',
  password: ''
})
function clearError() {
  error.value = ''
}
function focusPassword() {
  nextTick(()=>passwordRef.value && passwordRef.value.focus())
}
onMounted(() => {
  nextTick(()=>usernameRef.value && usernameRef.value.focus())
})
const handleLogin = async () => {
  if (!form.username || !form.password || loading.value) return
  loading.value = true
  error.value = ''
  try {
    if (form.username === 'admin1' && form.password === '123456') {
      localStorage.setItem('userInfo', JSON.stringify({ username: 'admin1', is_admin: 1, token: 'mockToken' }))
      ElMessage.success('欢迎登录，admin1!')
      router.push('/product-orders')
    } else {
      error.value = '用户名或密码错误'
      form.password = ''
      nextTick(()=>passwordRef.value && passwordRef.value.focus())
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.login-background {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  width: 400px;
  max-width: 90vw;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.login-header {
  text-align: center;
  margin-bottom: 30px;
}
.login-logo {
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
  background: #fff;
}
.login-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.login-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}
.login-form {
  margin-bottom: 20px;
}
.form-group {
  margin-bottom: 16px;
}
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.input-wrapper input {
  width: 100%;
  padding: 10px 32px 10px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  outline: none;
  transition: border 0.2s;
}
.input-wrapper input.input-error {
  border-color: #e53935;
  background: #fff6f6;
}
.clear-btn {
  position: absolute;
  right: 8px;
  color: #bbb;
  font-size: 18px;
  cursor: pointer;
  user-select: none;
}
.toggle-pwd {
  position: absolute;
  right: 32px;
  color: #888;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
}
.login-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 8px;
  position: relative;
}
.login-btn:disabled {
  background: #bdbdbd;
  cursor: not-allowed;
}
.loading-spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid #fff;
  border-top: 2px solid #764ba2;
  border-radius: 50%;
  margin-right: 8px;
  vertical-align: middle;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.error-message {
  background: #ffeaea;
  color: #d93025;
  border: 1px solid #ffd6d6;
  border-radius: 6px;
  padding: 10px 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  animation: shake 0.2s;
}
.close-btn {
  background: none;
  border: none;
  color: #d93025;
  font-size: 18px;
  cursor: pointer;
  margin-left: 8px;
}
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  50% { transform: translateX(4px); }
  75% { transform: translateX(-2px); }
  100% { transform: translateX(0); }
}
.login-footer {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  color: #999;
  font-size: 12px;
}
</style> 