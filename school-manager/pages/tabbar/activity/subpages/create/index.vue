<!--
 * 文件路径: pages/tabbar/activity/subpages/create/index.vue
 * 功能说明: 创建活动页面
 * 主要功能:
 *   1. 创建新的校园活动
 *   2. 填写活动信息（标题、时间、地点、内容等）
 *   3. 上传活动封面图
 *   4. 设置活动分类和标签
 *   5. 发布活动
 * 数据来源: 表单输入，保存到本地存储或API
 * 相关页面: pages/tabbar/activity/index.vue (活动列表)
 -->
<template>
  <view class="create-activity-container">
    <!-- 头部 -->
    <view class="create-header">
      <view class="back-btn" @click="handleBack">
        <text class="iconfont">←</text>
      </view>
      <view class="header-title">创建活动</view>
      <view class="header-actions">
        <view class="header-btn" @click="handleSaveDraft">存草稿</view>
        <view class="header-btn primary" @click="handleSubmit">发布</view>
      </view>
    </view>

    <!-- 表单区域 -->
    <scroll-view class="form-scroll" scroll-y>
      <view class="form-container">
        <!-- 活动封面 -->
        <view class="form-section">
          <view class="section-title">活动封面</view>
          <view class="cover-upload">
            <view 
              class="upload-area" 
              :class="{ 'has-image': coverImage }"
              @click="chooseCover"
            >
              <image v-if="coverImage" :src="coverImage" class="cover-image" mode="aspectFill" />
              <view v-else class="upload-placeholder">
                <text class="iconfont">📷</text>
                <text class="upload-text">点击上传封面</text>
                <text class="upload-tip">建议尺寸 750x400px</text>
              </view>
              <view v-if="coverImage" class="cover-actions">
                <view class="cover-btn" @click.stop="chooseCover">更换</view>
                <view class="cover-btn" @click.stop="removeCover">删除</view>
              </view>
            </view>
          </view>
        </view>

        <!-- 基本信息 -->
        <view class="form-section">
          <view class="section-title">基本信息</view>
          <view class="form-item">
            <view class="item-label">活动标题</view>
            <input 
              class="item-input" 
              v-model="formData.title" 
              placeholder="请输入活动标题"
              maxlength="30"
            />
            <view class="input-count">{{ formData.title.length }}/30</view>
          </view>
          
          <view class="form-item">
            <view class="item-label">活动分类</view>
            <picker 
              class="item-picker" 
              mode="selector" 
              :range="categoryLabels" 
              :value="categoryIndex"
              @change="onCategoryChange"
            >
              <view class="picker-value">
                {{ formData.category ? getCategoryLabel(formData.category) : '请选择分类' }}
              </view>
              <text class="iconfont picker-arrow">▼</text>
            </picker>
          </view>
          
          <view class="form-item">
            <view class="item-label">活动简介</view>
            <textarea 
              class="item-textarea" 
              v-model="formData.description" 
              placeholder="简要描述活动内容、特色等"
              maxlength="200"
            />
            <view class="input-count">{{ formData.description.length }}/200</view>
          </view>
        </view>

        <!-- 时间地点 -->
        <view class="form-section">
          <view class="section-title">时间地点</view>
          
          <view class="form-item">
            <view class="item-label">开始时间</view>
            <picker 
              class="item-picker" 
              mode="datetime" 
              :value="formData.startTime"
              @change="onStartTimeChange"
            >
              <view class="picker-value">
                {{ formData.startTime || '请选择开始时间' }}
              </view>
              <text class="iconfont picker-arrow">▼</text>
            </picker>
          </view>
          
          <view class="form-item">
            <view class="item-label">结束时间</view>
            <picker 
              class="item-picker" 
              mode="datetime" 
              :value="formData.endTime"
              @change="onEndTimeChange"
            >
              <view class="picker-value">
                {{ formData.endTime || '请选择结束时间' }}
              </view>
              <text class="iconfont picker-arrow">▼</text>
            </picker>
          </view>
          
          <view class="form-item">
            <view class="item-label">活动地点</view>
            <input 
              class="item-input" 
              v-model="formData.location" 
              placeholder="请输入活动地点"
              @focus="handleLocationFocus"
            />
            <view v-if="showLocationTips" class="location-tips">
              <view class="tip-item" @click="selectLocation('学校大礼堂')">学校大礼堂</view>
              <view class="tip-item" @click="selectLocation('学校操场')">学校操场</view>
              <view class="tip-item" @click="selectLocation('图书馆报告厅')">图书馆报告厅</view>
            </view>
          </view>
          
          <view class="form-item">
            <view class="item-label">详细地址</view>
            <input 
              class="item-input" 
              v-model="formData.address" 
              placeholder="如：XX楼XX室"
            />
          </view>
        </view>

        <!-- 费用设置 -->
        <view class="form-section">
          <view class="section-title">费用设置</view>
          <view class="price-setting">
            <view class="price-type">
              <view 
                class="price-option"
                :class="{ active: formData.priceType === 'free' }"
                @click="formData.priceType = 'free'"
              >
                <text class="iconfont">💰</text>
                <text>免费</text>
              </view>
              <view 
                class="price-option"
                :class="{ active: formData.priceType === 'paid' }"
                @click="formData.priceType = 'paid'"
              >
                <text class="iconfont">💵</text>
                <text>付费</text>
              </view>
            </view>
            
            <view v-if="formData.priceType === 'paid'" class="price-inputs">
              <view class="price-item">
                <view class="price-label">价格（元）</view>
                <input 
                  type="number" 
                  class="price-input" 
                  v-model.number="formData.price"
                  placeholder="0.00"
                />
              </view>
              <view class="price-item">
                <view class="price-label">原价（元）</view>
                <input 
                  type="number" 
                  class="price-input" 
                  v-model.number="formData.originalPrice"
                  placeholder="0.00"
                />
              </view>
            </view>
          </view>
        </view>

        <!-- 参与设置 -->
        <view class="form-section">
          <view class="section-title">参与设置</view>
          
          <view class="form-item">
            <view class="item-label">参与人数限制</view>
            <view class="capacity-setting">
              <view 
                class="capacity-option"
                :class="{ active: formData.capacityType === 'unlimited' }"
                @click="formData.capacityType = 'unlimited'"
              >
                不限人数
              </view>
              <view 
                class="capacity-option"
                :class="{ active: formData.capacityType === 'limited' }"
                @click="formData.capacityType = 'limited'"
              >
                限制人数
              </view>
            </view>
            
            <view v-if="formData.capacityType === 'limited'" class="capacity-input">
              <input 
                type="number" 
                class="capacity-number" 
                v-model.number="formData.capacity"
                placeholder="请输入人数"
              />
              <text class="capacity-unit">人</text>
            </view>
          </view>
          
          <view class="form-item">
            <view class="item-label">报名截止时间</view>
            <picker 
              class="item-picker" 
              mode="datetime" 
              :value="formData.deadline"
              @change="onDeadlineChange"
            >
              <view class="picker-value">
                {{ formData.deadline || '不设置截止时间' }}
              </view>
              <text class="iconfont picker-arrow">▼</text>
            </picker>
          </view>
          
          <view class="form-item">
            <view class="item-label">报名需要审核</view>
            <switch 
              :checked="formData.needReview" 
              @change="onNeedReviewChange"
              color="#007AFF"
            />
          </view>
        </view>

        <!-- 详情描述 -->
        <view class="form-section">
          <view class="section-title">详情描述</view>
          <view class="rich-editor">
            <view class="editor-toolbar">
              <view class="tool-item" @click="insertText('bold', '**加粗**')">
                <text class="iconfont">B</text>
              </view>
              <view class="tool-item" @click="insertText('italic', '*斜体*')">
                <text class="iconfont">I</text>
              </view>
              <view class="tool-item" @click="insertText('image', '![图片描述](图片地址)')">
                <text class="iconfont">🖼️</text>
              </view>
              <view class="tool-item" @click="insertText('link', '[链接描述](链接地址)')">
                <text class="iconfont">🔗</text>
              </view>
            </view>
            <textarea 
              class="editor-textarea" 
              v-model="formData.content" 
              placeholder="详细描述活动内容、流程、注意事项等..."
              :maxlength="5000"
            />
            <view class="editor-tip">
              支持Markdown语法，已输入 {{ formData.content.length }} 字
            </view>
          </view>
        </view>

        <!-- 联系方式 -->
        <view class="form-section">
          <view class="section-title">联系方式</view>
          <view class="form-item">
            <view class="item-label">联系人</view>
            <input 
              class="item-input" 
              v-model="formData.contact.name" 
              placeholder="请输入联系人姓名"
            />
          </view>
          <view class="form-item">
            <view class="item-label">联系电话</view>
            <input 
              class="item-input" 
              v-model="formData.contact.phone" 
              placeholder="请输入联系电话"
              type="number"
            />
          </view>
          <view class="form-item">
            <view class="item-label">联系微信</view>
            <input 
              class="item-input" 
              v-model="formData.contact.wechat" 
              placeholder="请输入微信号（选填）"
            />
          </view>
        </view>

        <!-- 其他设置 -->
        <view class="form-section">
          <view class="section-title">其他设置</view>
          <view class="form-item">
            <view class="item-label">活动标签</view>
            <view class="tags-container">
              <view 
                v-for="tag in formData.tags" 
                :key="tag" 
                class="tag-item"
              >
                {{ tag }}
                <text class="tag-close" @click="removeTag(tag)">×</text>
              </view>
              <view v-if="formData.tags.length < 5" class="tag-add" @click="showAddTag = true">
                <text class="iconfont">+</text>
              </view>
            </view>
            <view v-if="showAddTag" class="tag-input-area">
              <input 
                class="tag-input" 
                v-model="newTag" 
                placeholder="输入标签"
                @confirm="addTag"
              />
              <view class="tag-hot">
                <text>热门标签：</text>
                <view class="hot-tags">
                  <text 
                    v-for="tag in hotTags" 
                    :key="tag"
                    class="hot-tag"
                    @click="addHotTag(tag)"
                  >
                    {{ tag }}
                  </text>
                </view>
              </view>
            </view>
          </view>
          
          <view class="form-item">
            <view class="item-label">活动权限</view>
            <picker 
              class="item-picker" 
              mode="selector" 
              :range="permissionOptions" 
              :value="permissionIndex"
              @change="onPermissionChange"
            >
              <view class="picker-value">
                {{ permissionOptions[permissionIndex] }}
              </view>
              <text class="iconfont picker-arrow">▼</text>
            </picker>
          </view>
        </view>

        <!-- 保存按钮 -->
        <view class="form-actions">
          <view class="action-btn cancel" @click="handleReset">重置</view>
          <view class="action-btn primary" @click="handleSubmit">发布活动</view>
        </view>
      </view>
    </scroll-view>

    <!-- 添加标签弹窗 -->
    <view v-if="showAddTag" class="tag-modal-overlay" @click="showAddTag = false">
      <view class="tag-modal" @click.stop>
        <view class="tag-modal-header">
          <text>添加标签</text>
          <text class="modal-close" @click="showAddTag = false">×</text>
        </view>
        <view class="tag-modal-body">
          <input 
            class="modal-input" 
            v-model="newTag" 
            placeholder="请输入标签"
            @confirm="addTag"
          />
          <view class="modal-hot-tags">
            <text>推荐标签：</text>
            <view class="modal-hot-list">
              <text 
                v-for="tag in hotTags" 
                :key="tag"
                class="modal-hot-tag"
                @click="addHotTag(tag)"
              >
                {{ tag }}
              </text>
            </view>
          </view>
        </view>
        <view class="tag-modal-footer">
          <view class="modal-btn" @click="showAddTag = false">取消</view>
          <view class="modal-btn primary" @click="addTag">确定</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'

// 表单数据
const formData = ref({
  title: '',
  category: '',
  description: '',
  coverImage: '',
  startTime: '',
  endTime: '',
  location: '',
  address: '',
  priceType: 'free',
  price: 0,
  originalPrice: 0,
  capacityType: 'unlimited',
  capacity: 0,
  deadline: '',
  needReview: false,
  content: '',
  contact: {
    name: '',
    phone: '',
    wechat: ''
  },
  tags: [],
  permission: 0
})

// UI状态
const coverImage = ref('')
const categoryIndex = ref(0)
const permissionIndex = ref(0)
const showLocationTips = ref(false)
const showAddTag = ref(false)
const newTag = ref('')
const isDraft = ref(false)

// 选项数据
const categoryOptions = [
  { label: '学术讲座', value: 'academic' },
  { label: '体育赛事', value: 'sport' },
  { label: '文艺演出', value: 'culture' },
  { label: '社交活动', value: 'social' },
  { label: '志愿服务', value: 'volunteer' },
  { label: '其他', value: 'other' }
]
const categoryLabels = categoryOptions.map(item => item.label)
const permissionOptions = ['公开', '仅校内', '仅邀请']
const hotTags = ['热门', '免费', '周末', '线上', '实践', '竞赛', '公益', '娱乐']

// 工具函数
const getCategoryLabel = (value) => {
  if (!value) return '请选择'
  const found = categoryOptions.find(item => item.value === value)
  return found ? found.label : '请选择'
}

// 事件处理
const handleBack = () => {
  // 如果有未保存的内容，提示用户
  if (formData.value.title || coverImage.value) {
    uni.showModal({
      title: '提示',
      content: '离开页面后，未保存的内容将丢失，是否继续？',
      confirmText: '继续',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          uni.navigateBack()
        }
      }
    })
  } else {
    uni.navigateBack()
  }
}

const removeCover = () => {
  coverImage.value = ''
  formData.value.coverImage = ''
}

const handleSaveDraft = () => {
  // 保存草稿时需要包含封面图片
  const draftData = {
    ...formData.value,
    coverImage: coverImage.value
  }
  uni.setStorageSync('activityDraft', draftData)
  uni.showToast({
    title: '已保存到草稿',
    icon: 'success'
  })
  isDraft.value = true
}

const chooseCover = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      coverImage.value = res.tempFilePaths[0]
      formData.value.coverImage = res.tempFilePaths[0]
      // 这里应该上传图片到服务器，获取真实的图片URL
      // uploadCoverImage(res.tempFilePaths[0])
    },
    fail: (err) => {
      console.error('选择图片失败:', err)
      uni.showToast({
        title: '选择图片失败',
        icon: 'none'
      })
    }
  })
}

const onCategoryChange = (e) => {
  categoryIndex.value = e.detail.value
  formData.value.category = categoryOptions[e.detail.value].value
}

const onPermissionChange = (e) => {
  permissionIndex.value = e.detail.value
  formData.value.permission = e.detail.value
}

const onStartTimeChange = (e) => {
  formData.value.startTime = e.detail.value
}

const onEndTimeChange = (e) => {
  const endTime = e.detail.value
  if (formData.value.startTime && endTime < formData.value.startTime) {
    uni.showToast({
      title: '结束时间不能早于开始时间',
      icon: 'none'
    })
    return
  }
  formData.value.endTime = endTime
}

const onDeadlineChange = (e) => {
  formData.value.deadline = e.detail.value
}

const onNeedReviewChange = (e) => {
  formData.value.needReview = e.detail.value
}

const handleLocationFocus = () => {
  showLocationTips.value = true
}

const selectLocation = (location) => {
  formData.value.location = location
  showLocationTips.value = false
}

const insertText = (type, text) => {
  const content = formData.value.content
  formData.value.content = content + text
}

const addTag = () => {
  if (newTag.value.trim() && formData.value.tags.length < 5) {
    formData.value.tags.push(newTag.value.trim())
    newTag.value = ''
    showAddTag.value = false
  }
}

const addHotTag = (tag) => {
  if (!formData.value.tags.includes(tag) && formData.value.tags.length < 5) {
    formData.value.tags.push(tag)
  }
}

const removeTag = (tag) => {
  formData.value.tags = formData.value.tags.filter(t => t !== tag)
}

const handleReset = () => {
  uni.showModal({
    title: '确认重置',
    content: '确定要清空所有表单内容吗？',
    success: (res) => {
      if (res.confirm) {
        formData.value = {
          title: '',
          category: '',
          description: '',
          coverImage: '',
          startTime: '',
          endTime: '',
          location: '',
          address: '',
          priceType: 'free',
          price: 0,
          originalPrice: 0,
          capacityType: 'unlimited',
          capacity: 0,
          deadline: '',
          needReview: false,
          content: '',
          contact: {
            name: '',
            phone: '',
            wechat: ''
          },
          tags: [],
          permission: 0
        }
        coverImage.value = ''
        formData.value.coverImage = ''
        categoryIndex.value = 0
        permissionIndex.value = 0
        isDraft.value = false
        // 清除草稿
        uni.removeStorageSync('activityDraft')
      }
    }
  })
}

const validateForm = () => {
  if (!formData.value.title.trim()) {
    uni.showToast({ title: '请填写活动标题', icon: 'none' })
    return false
  }
  if (!formData.value.category) {
    uni.showToast({ title: '请选择活动分类', icon: 'none' })
    return false
  }
  if (!formData.value.description.trim()) {
    uni.showToast({ title: '请填写活动简介', icon: 'none' })
    return false
  }
  if (!coverImage.value) {
    uni.showToast({ title: '请上传活动封面', icon: 'none' })
    return false
  }
  if (!formData.value.startTime) {
    uni.showToast({ title: '请选择开始时间', icon: 'none' })
    return false
  }
  if (formData.value.endTime && formData.value.endTime < formData.value.startTime) {
    uni.showToast({ title: '结束时间不能早于开始时间', icon: 'none' })
    return false
  }
  if (!formData.value.location.trim()) {
    uni.showToast({ title: '请填写活动地点', icon: 'none' })
    return false
  }
  if (formData.value.priceType === 'paid') {
    if (!formData.value.price || formData.value.price <= 0) {
      uni.showToast({ title: '请填写有效的活动价格', icon: 'none' })
      return false
    }
  }
  if (formData.value.capacityType === 'limited') {
    if (!formData.value.capacity || formData.value.capacity <= 0) {
      uni.showToast({ title: '请填写有效的人数限制', icon: 'none' })
      return false
    }
  }
  if (!formData.value.contact.name.trim()) {
    uni.showToast({ title: '请填写联系人', icon: 'none' })
    return false
  }
  if (!formData.value.contact.phone.trim()) {
    uni.showToast({ title: '请填写联系电话', icon: 'none' })
    return false
  }
  // 简单的手机号验证
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(formData.value.contact.phone.trim())) {
    uni.showToast({ title: '请输入正确的手机号码', icon: 'none' })
    return false
  }
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    uni.showLoading({ title: '发布中...' })
    
    // 准备提交数据
    const submitData = {
      title: formData.value.title.trim(),
      category: formData.value.category,
      description: formData.value.description.trim(),
      cover: coverImage.value, // 这里应该是上传后的URL
      startTime: formData.value.startTime,
      endTime: formData.value.endTime || null,
      location: formData.value.location.trim(),
      address: formData.value.address.trim() || null,
      price: formData.value.priceType === 'free' ? 0 : formData.value.price,
      originalPrice: formData.value.originalPrice || null,
      capacity: formData.value.capacityType === 'unlimited' ? null : formData.value.capacity,
      deadline: formData.value.deadline || null,
      needReview: formData.value.needReview,
      content: formData.value.content.trim(),
      contact: {
        name: formData.value.contact.name.trim(),
        phone: formData.value.contact.phone.trim(),
        wechat: formData.value.contact.wechat.trim() || null
      },
      tags: formData.value.tags,
      permission: formData.value.permission
    }
    
    // 这里应该调用真实的API
    // const response = await store.dispatch('activity/createActivity', submitData)
    
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 清除草稿
    uni.removeStorageSync('activityDraft')
    
    uni.hideLoading()
    uni.showToast({
      title: '活动发布成功',
      icon: 'success',
      duration: 2000
    })
    
    // 跳转回活动列表
    setTimeout(() => {
      uni.setStorageSync('needRefreshActivity', true)
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    uni.hideLoading()
    console.error('发布活动失败:', error)
    uni.showToast({
      title: error.message || '发布失败，请重试',
      icon: 'none',
      duration: 2000
    })
  }
}

// 生命周期
onLoad((options) => {
  if (options.draft) {
    // 加载草稿
    const draft = uni.getStorageSync('activityDraft')
    if (draft) {
      formData.value = { ...draft }
      if (draft.coverImage) {
        coverImage.value = draft.coverImage
      }
      // 恢复分类索引
      const foundIndex = categoryOptions.findIndex(item => item.value === draft.category)
      if (foundIndex !== -1) {
        categoryIndex.value = foundIndex
      }
      isDraft.value = true
    }
  }
})

onUnload(() => {
  // 页面卸载时，如果有内容但没有发布，询问是否保存草稿
  if (formData.value.title || coverImage.value) {
    // 自动保存草稿（可选：也可以提示用户）
    // 这里选择自动保存，不打扰用户
    const draftData = {
      ...formData.value,
      coverImage: coverImage.value
    }
    uni.setStorageSync('activityDraft', draftData)
  }
})
</script>

<style lang="scss" scoped>
.create-activity-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}

.create-header {
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  height: 90rpx;
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;
  
  .back-btn {
    font-size: 40rpx;
    color: #333;
  }
  
  .header-title {
    flex: 1;
    font-size: 36rpx;
    font-weight: bold;
    text-align: center;
    color: #333;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 20rpx;
    
    .header-btn {
      font-size: 28rpx;
      color: #666;
      
      &.primary {
        color: #007AFF;
        font-weight: bold;
      }
    }
  }
}

.form-scroll {
  flex: 1;
  height: 0;
}

.form-container {
  padding-bottom: 40rpx;
}

.form-section {
  margin: 20rpx 30rpx 0;
  padding: 30rpx;
  background: #fff;
  border-radius: 16rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
  }
}

.cover-upload {
  .upload-area {
    height: 300rpx;
    border: 2rpx dashed #e5e5e5;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    
    &.has-image {
      border-style: solid;
    }
    
    .cover-image {
      width: 100%;
      height: 100%;
    }
    
    .upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20rpx;
      
      .iconfont {
        font-size: 60rpx;
        color: #999;
      }
      
      .upload-text {
        font-size: 28rpx;
        color: #666;
      }
      
      .upload-tip {
        font-size: 24rpx;
        color: #999;
      }
    }
    
    .cover-actions {
      position: absolute;
      bottom: 20rpx;
      right: 20rpx;
      display: flex;
      gap: 20rpx;
      
      .cover-btn {
        padding: 8rpx 20rpx;
        background: rgba(0, 0, 0, 0.6);
        color: #fff;
        border-radius: 20rpx;
        font-size: 24rpx;
      }
    }
  }
}

.form-item {
  margin-bottom: 30rpx;
  position: relative;
  
  .item-label {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 16rpx;
    font-weight: 500;
  }
  
  .item-input,
  .item-textarea {
    width: 100%;
    padding: 20rpx;
    border: 1rpx solid #e5e5e5;
    border-radius: 8rpx;
    font-size: 28rpx;
    background: #fafafa;
  }
  
  .item-textarea {
    height: 200rpx;
  }
  
  .item-picker {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx;
    border: 1rpx solid #e5e5e5;
    border-radius: 8rpx;
    background: #fafafa;
    
    .picker-value {
      font-size: 28rpx;
      color: #333;
      
      &:empty:before {
        content: attr(placeholder);
        color: #999;
      }
    }
    
    .picker-arrow {
      font-size: 24rpx;
      color: #999;
    }
  }
  
  .input-count {
    text-align: right;
    font-size: 24rpx;
    color: #999;
    margin-top: 8rpx;
  }
}

.location-tips {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  z-index: 10;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  
  .tip-item {
    padding: 20rpx;
    font-size: 28rpx;
    color: #333;
    border-bottom: 1rpx solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:active {
      background: #f5f5f5;
    }
  }
}

.price-setting {
  .price-type {
    display: flex;
    gap: 20rpx;
    margin-bottom: 30rpx;
    
    .price-option {
      flex: 1;
      padding: 20rpx;
      border: 1rpx solid #e5e5e5;
      border-radius: 8rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10rpx;
      font-size: 28rpx;
      color: #666;
      
      &.active {
        border-color: #007AFF;
        background: rgba(0, 122, 255, 0.1);
        color: #007AFF;
      }
    }
  }
  
  .price-inputs {
    display: flex;
    gap: 20rpx;
    
    .price-item {
      flex: 1;
      
      .price-label {
        font-size: 24rpx;
        color: #666;
        margin-bottom: 10rpx;
      }
      
      .price-input {
        width: 100%;
        padding: 20rpx;
        border: 1rpx solid #e5e5e5;
        border-radius: 8rpx;
        font-size: 28rpx;
        background: #fafafa;
      }
    }
  }
}

.capacity-setting {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
  
  .capacity-option {
    flex: 1;
    padding: 20rpx;
    border: 1rpx solid #e5e5e5;
    border-radius: 8rpx;
    text-align: center;
    font-size: 28rpx;
    color: #666;
    
    &.active {
      border-color: #007AFF;
      background: rgba(0, 122, 255, 0.1);
      color: #007AFF;
    }
  }
}

.capacity-input {
  display: flex;
  align-items: center;
  gap: 20rpx;
  
  .capacity-number {
    flex: 1;
    padding: 20rpx;
    border: 1rpx solid #e5e5e5;
    border-radius: 8rpx;
    font-size: 28rpx;
    background: #fafafa;
  }
  
  .capacity-unit {
    font-size: 28rpx;
    color: #333;
  }
}

.rich-editor {
  .editor-toolbar {
    display: flex;
    gap: 20rpx;
    margin-bottom: 20rpx;
    
    .tool-item {
      width: 60rpx;
      height: 60rpx;
      border: 1rpx solid #e5e5e5;
      border-radius: 8rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
      color: #666;
    }
  }
  
  .editor-textarea {
    width: 100%;
    height: 300rpx;
    padding: 20rpx;
    border: 1rpx solid #e5e5e5;
    border-radius: 8rpx;
    font-size: 28rpx;
    background: #fafafa;
  }
  
  .editor-tip {
    font-size: 24rpx;
    color: #999;
    margin-top: 8rpx;
  }
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  
  .tag-item {
    padding: 12rpx 24rpx;
    background: #f0f0f0;
    border-radius: 40rpx;
    font-size: 24rpx;
    color: #333;
    display: flex;
    align-items: center;
    gap: 8rpx;
    
    .tag-close {
      font-size: 28rpx;
      color: #999;
    }
  }
  
  .tag-add {
    width: 60rpx;
    height: 60rpx;
    border: 2rpx dashed #e5e5e5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    color: #999;
  }
}

.tag-input-area {
  margin-top: 20rpx;
  
  .tag-input {
    width: 100%;
    padding: 20rpx;
    border: 1rpx solid #e5e5e5;
    border-radius: 8rpx;
    font-size: 28rpx;
    margin-bottom: 20rpx;
  }
  
  .tag-hot {
    font-size: 24rpx;
    color: #666;
    
    .hot-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 10rpx;
      margin-top: 10rpx;
      
      .hot-tag {
        padding: 8rpx 16rpx;
        background: #f0f0f0;
        border-radius: 20rpx;
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

.form-actions {
  display: flex;
  gap: 20rpx;
  padding: 40rpx 30rpx;
  
  .action-btn {
    flex: 1;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    border-radius: 40rpx;
    font-size: 28rpx;
    
    &.cancel {
      background: #f5f5f5;
      color: #666;
    }
    
    &.primary {
      background: #007AFF;
      color: #fff;
    }
  }
}

.tag-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.tag-modal {
  width: 600rpx;
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  
  .tag-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40rpx 30rpx 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
    
    .modal-close {
      font-size: 40rpx;
      color: #999;
    }
  }
  
  .tag-modal-body {
    padding: 30rpx;
    
    .modal-input {
      width: 100%;
      padding: 20rpx;
      border: 1rpx solid #e5e5e5;
      border-radius: 8rpx;
      font-size: 28rpx;
      margin-bottom: 20rpx;
    }
    
    .modal-hot-tags {
      .modal-hot-list {
        display: flex;
        flex-wrap: wrap;
        gap: 10rpx;
        margin-top: 10rpx;
        
        .modal-hot-tag {
          padding: 8rpx 16rpx;
          background: #f0f0f5;
          border-radius: 20rpx;
          font-size: 24rpx;
          color: #666;
        }
      }
    }
  }
  
  .tag-modal-footer {
    display: flex;
    padding: 20rpx 30rpx;
    border-top: 1rpx solid #f0f0f0;
    gap: 20rpx;
    
    .modal-btn {
      flex: 1;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      border-radius: 40rpx;
      font-size: 28rpx;
      background: #f5f5f5;
      color: #666;
      
      &.primary {
        background: #007AFF;
        color: #fff;
      }
    }
  }
}
</style>