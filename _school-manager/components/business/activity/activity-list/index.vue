<template>
  <view class="activity-list">
    <view 
      v-for="(item, index) in activityList" 
      :key="getItemKey(item, index)"
      class="list-item"
    >
      <activity-card 
        :activity="item" 
        :show-status="showStatus"
        :show-actions="showActions"
        @click="handleItemClick"
        @join="handleJoin"
      />
    </view>
    <view v-if="loading" class="list-loading">
      <text>加载中...</text>
    </view>
    <view v-if="finished && activityList.length === 0" class="list-empty">
      <empty-state :description="emptyText" />
    </view>
    <view v-if="error" class="list-error">
      <text>加载失败，请重试</text>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import ActivityCard from '../activity-card/index.vue'
import EmptyState from '@/components/common/empty-state/index.vue'

const props = defineProps({
  activityList: {
    type: Array,
    default: () => []
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
  showStatus: {
    type: Boolean,
    default: true
  },
  showActions: {
    type: Boolean,
    default: true
  },
  emptyText: {
    type: String,
    default: '暂无活动'
  },
  itemKey: {
    type: [String, Function],
    default: 'id'
  }
})

const emit = defineEmits(['load', 'refresh', 'item-click', 'join'])

const getItemKey = (item, index) => {
  if (typeof props.itemKey === 'function') {
    return props.itemKey(item, index)
  }
  return item[props.itemKey] || index
}

const handleItemClick = (activity) => {
  emit('item-click', activity)
}

const handleJoin = (activity) => {
  emit('join', activity)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.activity-list {
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
