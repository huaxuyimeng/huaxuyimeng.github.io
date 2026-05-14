<template>
  <view class="map-container">
    <map
      :latitude="latitude"
      :longitude="longitude"
      :markers="markers"
      :scale="scale"
      :show-location="showLocation"
      class="map"
      @tap="handleMapTap"
      @marker-tap="handleMarkerTap"
    ></map>
    <view v-if="showControls" class="map-controls">
      <view class="control-button" @click="handleLocation">
        <text>📍</text>
      </view>
      <view class="control-button" @click="handleZoomIn">
        <text>+</text>
      </view>
      <view class="control-button" @click="handleZoomOut">
        <text>-</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  markers: {
    type: Array,
    default: () => []
  },
  scale: {
    type: Number,
    default: 16
  },
  showLocation: {
    type: Boolean,
    default: true
  },
  showControls: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['tap', 'marker-tap', 'location', 'zoom-in', 'zoom-out'])

const currentScale = ref(props.scale)

const handleMapTap = (e) => {
  emit('tap', e.detail)
}

const handleMarkerTap = (e) => {
  emit('marker-tap', e.detail)
}

const handleLocation = () => {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      emit('location', res)
    }
  })
}

const handleZoomIn = () => {
  currentScale.value = Math.min(currentScale.value + 1, 20)
  emit('zoom-in', currentScale.value)
}

const handleZoomOut = () => {
  currentScale.value = Math.max(currentScale.value - 1, 3)
  emit('zoom-out', currentScale.value)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.map-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.map {
  width: 100%;
  height: 100%;
}

.map-controls {
  position: absolute;
  right: $spacing-3;
  bottom: $spacing-3;
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
  z-index: 10;
}

.control-button {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $white;
  border-radius: 50%;
  box-shadow: $shadow-base;
  cursor: pointer;
  transition: all $transition-duration $transition-timing;
  
  &:active {
    transform: scale(0.95);
    box-shadow: $shadow-sm;
  }
  
  text {
    font-size: $font-size-lg;
    color: $gray-7;
  }
}
</style>
