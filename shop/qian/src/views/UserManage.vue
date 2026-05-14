<template>
    <div class="user-manage-container">
        <h2>用户管理（仅管理员可见）</h2>
        <el-table :data="users" style="width:100%;margin-bottom:24px;" stripe border :empty-text="tableEmptyText">
            <el-table-column prop="user_id" label="用户ID" width="80" align="center" />
            <el-table-column prop="username" label="用户名" width="120" align="center" />
            <el-table-column prop="is_admin" label="权限" width="100" align="center">
                <template #default="scope">
                    <el-tag :type="scope.row.is_admin === 1 ? 'success' : 'info'">
                        {{ scope.row.is_admin === 1 ? '管理员' : '普通用户' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="merchant_id" label="所属商家ID" width="120" align="center" />
            <el-table-column prop="created_at" label="创建时间" width="180" align="center" />
            <el-table-column label="操作" width="160" align="center">
                <template #default="scope">
                    <el-button type="warning" size="small" :loading="resetLoadingId===scope.row.user_id" @click="resetPassword(scope.row.user_id)">重置密码</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import userApi from '@/api/user'

const users = ref([])
const resetLoadingId = ref(null)
const tableEmptyText = '暂无用户数据'
const fetchUsers = async () => {
    const res = await userApi.getUsers()
    users.value = res.data.data || []
}
const resetPassword = async (userId) => {
    if (resetLoadingId.value) return
    resetLoadingId.value = userId
    try {
        await userApi.resetPassword(userId)
        ElMessage.success('密码已重置为123456')
        fetchUsers()
    } catch (e) {
        ElMessage.error('重置密码失败，请重试')
    } finally {
        resetLoadingId.value = null
    }
}
onMounted(fetchUsers)
</script>
<style scoped>
.user-manage-container {
    max-width: 900px;
    margin: 40px auto;
    padding: 32px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}
</style>