<template>
  <view class="activity-filter">
    <view class="filter-tabs">
      <view 
        v-for="(tab, index) in tabs" 
        :key="index"
        class="filter-tab"
        :class="{ 'tab-active': currentTab === tab.value }"
        @click="handleTabClick(tab.value)"
      >
        <text>{{ tab.label }}</text>
      </view>
    </view>
    <view v-if="showMore" class="filter-more" @click="handleMoreClick">
      <text class="more-icon">筛选</text>
      <text class="more-arrow">›</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  tabs: {
    type: Array,
    default: () => [
      { label: '全部', value: 'all' },
      { label: '进行中', value: 'ongoing' },
      { label: '已结束', value: 'finished' }
    ]
  },
  defaultTab: {
    type: String,
    default: 'all'
  },
  showMore: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['change', 'more'])

const currentTab = ref(props.defaultTab)

const handleTabClick = (value) => {
  currentTab.value = value
  emit('change', value)
}

const handleMoreClick = () => {
  emit('more')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.activity-filter {
  display: flex;
  align-items: center;
  padding: $spacing-2 $spacing-3;
  background: $white;
  border-bottom: 1rpx solid $gray-2;
}

.filter-tabs {
  display: flex;
  flex: 1;
  gap: $spacing-2;
}

.filter-tab {
  padding: $spacing-1 $spacing-3;
  border-radius: $border-radius-full;
  font-size: $font-size-sm;
  color: $gray-6;
  background: $gray-1;
  cursor: pointer;
  transition: all $transition-duration $transition-timing;
  
  &.tab-active {
    background: $primary-color;
    color: $white;
  }
}

.filter-more {
  display: flex;
  align-items: center;
  gap: $spacing-1;
  padding: $spacing-1 $spacing-2;
  cursor: pointer;
  
  .more-icon {
    font-size: $font-size-sm;
    color: $gray-6;
  }
  
  .more-arrow {
    font-size: $font-size-lg;
    color: $gray-4;
  }
}
</style>
