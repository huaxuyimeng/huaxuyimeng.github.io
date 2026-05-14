<template>
  <view class="image-viewer" v-if="show" @click="handleClose">
    <view class="viewer-overlay"></view>
    <view class="viewer-content" @click.stop>
      <swiper 
        class="viewer-swiper" 
        :current="currentIndex"
        @change="handleSwiperChange"
        :indicator-dots="images.length > 1"
        indicator-color="rgba(255, 255, 255, 0.5)"
        indicator-active-color="#fff"
      >
        <swiper-item v-for="(image, index) in imageList" :key="index">
          <image 
            :src="getImageUrl(image)" 
            mode="aspectFit"
            class="viewer-image"
            @load="handleImageLoad"
            @error="handleImageError"
          />
        </swiper-item>
      </swiper>
      <view v-if="closeable" class="viewer-close" @click="handleClose">
        <text class="close-icon">✕</text>
      </view>
      <view v-if="images.length > 1" class="viewer-indicator">
        <text class="indicator-text">{{ currentIndex + 1 }} / {{ images.length }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  current: {
    type: Number,
    default: 0
  },
  show: {
    type: Boolean,
    default: false
  },
  closeable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'change'])

const currentIndex = ref(props.current)

watch(() => props.current, (val) => {
  currentIndex.value = val
})

watch(() => props.show, (val) => {
  if (val) {
    currentIndex.value = props.current
  }
})

const imageList = computed(() => {
  return props.images || []
})

const getImageUrl = (image) => {
  if (typeof image === 'string') {
    return image
  }
  return image.url || ''
}

const handleSwiperChange = (e) => {
  currentIndex.value = e.detail.current
  emit('change', e.detail.current)
}

const handleClose = () => {
  if (props.closeable) {
    emit('close')
  }
}

const handleImageLoad = () => {
  // 图片加载成功
}

const handleImageError = () => {
  // 图片加载失败
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.viewer-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
}

.viewer-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.viewer-swiper {
  width: 100%;
  height: 100%;
}

.viewer-image {
  width: 100%;
  height: 100%;
}

.viewer-close {
  position: absolute;
  top: 60rpx;
  right: 30rpx;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  z-index: 10;
  
  .close-icon {
    color: $white;
    font-size: $font-size-xl;
    font-weight: 300;
  }
}

.viewer-indicator {
  position: absolute;
  bottom: 60rpx;
  left: 50%;
  transform: translateX(-50%);
  padding: $spacing-1 $spacing-3;
  background: rgba(0, 0, 0, 0.5);
  border-radius: $border-radius-full;
  z-index: 10;
  
  .indicator-text {
    color: $white;
    font-size: $font-size-sm;
  }
}
</style>
