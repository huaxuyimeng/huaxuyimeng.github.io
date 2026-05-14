<template>
  <view class="news-list">
    <view 
      v-for="(item, index) in newsList" 
      :key="getItemKey(item, index)"
      class="list-item"
    >
      <news-card 
        :news="item" 
        :layout="layout"
        :show-actions="showActions"
        @click="handleItemClick"
        @like="handleLike"
        @comment="handleComment"
        @collect="handleCollect"
      />
    </view>
    <view v-if="loading" class="list-loading">
      <text>加载中...</text>
    </view>
    <view v-if="finished && newsList.length === 0" class="list-empty">
      <empty-state :description="emptyText" />
    </view>
    <view v-if="error" class="list-error">
      <text>加载失败，请重试</text>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import NewsCard from '../news-card/index.vue'
import EmptyState from '@/components/common/empty-state/index.vue'

const props = defineProps({
  newsList: {
    type: Array,
    default: () => []
  },
  layout: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  finished: {
    type: Boolean,
    default: false
  },
  error: {
    type: Boolean,
    default: false
  },
  showActions: {
    type: Boolean,
    default: true
  },
  emptyText: {
    type: String,
    default: '暂无新闻'
  },
  itemKey: {
    type: [String, Function],
    default: 'id'
  }
})

const emit = defineEmits(['load', 'refresh', 'item-click', 'like', 'comment', 'collect'])

const getItemKey = (item, index) => {
  if (typeof props.itemKey === 'function') {
    return props.itemKey(item, index)
  }
  return item[props.itemKey] || index
}

const handleItemClick = (news) => {
  emit('item-click', news)
}

const handleLike = (news) => {
  emit('like', news)
}

const handleComment = (news) => {
  emit('comment', news)
}

const handleCollect = (news) => {
  emit('collect', news)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.news-list {
  width: 100%;
}

.list-item {
  margin-bottom: $spacing-2;
}

.list-loading,
.list-error {
  padding: $spacing-4;
  text-align: center;
  color: $gray-5;
  font-size: $font-size-sm;
}

.list-empty {
  padding: $spacing-8 0;
}
</style>
