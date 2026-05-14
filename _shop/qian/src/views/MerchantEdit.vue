<template>
  <el-card>
    <h2>商家详情编辑</h2>
    <el-form :model="merchant" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="登录账户" prop="name"><el-input v-model="merchant.name" /></el-form-item>
      <el-form-item label="店铺名称" prop="shop_name"><el-input v-model="merchant.shop_name" /></el-form-item>
      <el-form-item label="描述" prop="description"><el-input v-model="merchant.description" /></el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import merchantApi from '@/api/merchant'
const route = useRoute(), router = useRouter()
const merchant = ref({})
const loading = ref(false)
const formRef = ref(null)
// 表单校验规则
const rules = {
  name: [{ required: true, message: '请输入登录账户', trigger: 'blur' }],
  shop_name: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }]
}
onMounted(async () => {
  const res = await merchantApi.getMerchantDetail(route.params.id)
  merchant.value = res.data.data
})
const save = async () => {
  if (loading.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      await merchantApi.updateMerchant(merchant.value.id, merchant.value)
      ElMessage.success('保存成功，正在返回...')
      setTimeout(() => {
        router.push('/merchant-manage')
      }, 600)
    } catch (e) {
      ElMessage.error('保存失败，请重试')
    } finally {
      loading.value = false
    }
  })
}
</script> 