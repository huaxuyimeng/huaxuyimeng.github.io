<script setup>
import { defineProps, defineEmits } from 'vue'
import { ref, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  content: {
    type: String,
    default: ''
  },
  replyComment: {
    type: Object,
    default: null
  }
})

const emit = defineEmits([
  'update:visible',
  'update:content',
  'cancel-reply',
  'submit',
  'insert-emoji',
  'add-image'
])

const localContent = ref(props.content)
const localImages = ref([])

watch(() => props.content, (newVal) => {
  localContent.value = newVal
})

const handleClose = () => {
  emit('update:visible', false)
}

const handleCancelReply = () => {
  emit('cancel-reply')
}

const handleSubmit = () => {
  if (localContent.value.trim() || localImages.value.length > 0) {
    emit('submit', localContent.value, localImages.value)
    localContent.value = ''
    localImages.value = []
    handleClose()
  }
}

const handleInsertEmoji = () => {
  emit('insert-emoji')
}

const handleAddImage = () => {
  uni.chooseImage({
    count: 9 - localImages.value.length,
    success: (res) => {
      localImages.value = [...localImages.value, ...res.tempFilePaths]
    }
  })
}

const handleContentChange = (e) => {
  localContent.value = e.detail.value
  emit('update:content', e.detail.value)
}
</script>

<template>
  <view v-if="visible" class="comment-input-overlay" @click="handleClose">
    <view class="comment-input-panel" @click.stop>
      <view class="panel-header">
        <view class="panel-title">发表评论</view>
        <view class="panel-close" @click="handleClose">×</view>
      </view>
      
      <view class="input-content">
        <textarea 
          class="comment-textarea" 
          placeholder="写下你的看法..." 
          :value="localContent"
          @input="handleContentChange"
          :focus="visible"
          :maxlength="500"
          auto-height
        />
        
        <view v-if="replyComment" class="reply-preview">
          <text>回复 @{{replyComment.username}}：</text>
          <view class="reply-text">{{replyComment.content}}</view>
          <view class="reply-close" @click="handleCancelReply">×</view>
        </view>
        
        <view class="input-footer">
          <view class="tools">
            <view class="tool-item" @click="handleInsertEmoji">
              <uni-icons type="smile" size="20" color="#666"></uni-icons>
            </view>
            <view class="tool-item" @click="handleAddImage">
              <uni-icons type="image" size="20" color="#666"></uni-icons>
            </view>
          </view>
          <view class="input-counter">
            <text>{{localContent.length}}/500</text>
          </view>
        </view>
      </view>
      
      <view class="panel-footer">
        <button 
          class="submit-btn" 
          :disabled="!localContent.trim()" 
          :class="{ active: localContent.trim() }"
          @click="handleSubmit"
        >
          发表评论
        </button>
      </view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
@import '@/styles/variables.scss';

.comment-input-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 2000;
	display: flex;
	align-items: flex-end;
	
	.comment-input-panel {
		background: #fff;
		border-radius: 20rpx 20rpx 0 0;
		width: 100%;
		max-height: 80vh;
		display: flex;
		flex-direction: column;
		padding-bottom: env(safe-area-inset-bottom);
		
		.night-mode & {
			background: #2a2a2a;
		}
		
		.panel-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx;
			border-bottom: 1rpx solid $gray-2;
			
			.night-mode & {
				border-bottom-color: #444;
			}
			
			.panel-title {
				font-size: 32rpx;
				font-weight: bold;
				color: $gray-8;
				
				.night-mode & {
					color: #e0e0e0;
				}
			}
			
			.panel-close {
				font-size: 40rpx;
				color: $gray-5;
				line-height: 1;
				width: 40rpx;
				height: 40rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 50%;
				transition: all 0.3s;
				
				&:active {
					background: rgba(0, 0, 0, 0.05);
					
					.night-mode & {
						background: rgba(255, 255, 255, 0.05);
					}
				}
			}
		}
		
		.input-content {
			flex: 1;
			padding: 30rpx;
			overflow-y: auto;
			
			.comment-textarea {
				width: 100%;
				min-height: 200rpx;
				font-size: 28rpx;
				color: $gray-8;
				line-height: 1.6;
				
				.night-mode & {
					color: #e0e0e0;
				}
			}
			
			.reply-preview {
				position: relative;
				padding: 20rpx;
				background: $gray-0;
				border-radius: 12rpx;
				margin-top: 20rpx;
				border-left: 4rpx solid $primary-color;
				
				.night-mode & {
					background: #333;
					border-left-color: $primary-color;
				}
				
				text {
					font-size: 24rpx;
					color: $primary-color;
					font-weight: 500;
				}
				
				.reply-text {
					font-size: 24rpx;
					color: $gray-6;
					margin-top: 8rpx;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
					
					.night-mode & {
						color: #999;
					}
				}
				
				.reply-close {
					position: absolute;
					top: 10rpx;
					right: 10rpx;
					width: 30rpx;
					height: 30rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;
					background: $gray-1;
					font-size: 24rpx;
					color: $gray-5;
					transition: all 0.3s;
					
					.night-mode & {
						background: #444;
						color: #999;
					}
					
					&:active {
						background: $gray-2;
						
						.night-mode & {
							background: #555;
						}
					}
				}
			}
			
			.input-footer {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 20rpx;
				
				.tools {
					display: flex;
					align-items: center;
					gap: 20rpx;
					
					.tool-item {
						width: 50rpx;
						height: 50rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 50%;
						background: $gray-1;
						transition: all 0.3s;
						
						.night-mode & {
							background: #3a3a3a;
						}
						
						&:active {
							background: $gray-2;
							transform: scale(0.95);
							
							.night-mode & {
								background: #444;
							}
						}
					}
				}
				
				.input-counter {
					font-size: 24rpx;
					color: $gray-5;
					
					.night-mode & {
						color: #999;
					}
				}
			}
		}
		
		.panel-footer {
			padding: 20rpx 30rpx;
			border-top: 1rpx solid $gray-2;
			
			.night-mode & {
				border-top-color: #444;
			}
			
			.submit-btn {
				width: 100%;
				height: 80rpx;
				background: $gray-1;
				color: $gray-5;
				border-radius: 40rpx;
				font-size: 28rpx;
				border: none;
				transition: all 0.3s ease;
				
				.night-mode & {
					background: #3a3a3a;
					color: #999;
				}
				
				&.active {
					background: $primary-color;
					color: #fff;
					
					&:active {
						opacity: 0.8;
						transform: scale(0.98);
					}
				}
				
				&:disabled {
					opacity: 0.5;
				}
			}
		}
	}
}
</style>