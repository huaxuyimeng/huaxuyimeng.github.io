<!--
 * 文件路径: pages/login/index.vue
 * 功能说明: 登录页面优化版
 * 优化点：
 *   1. 重构UI设计，采用现代登录界面
 *   2. 添加表单验证和实时提示
 *   3. 支持多种登录方式
 *   4. 添加记住密码和自动登录
 *   5. 优化登录流程和状态提示
 *   6. 添加第三方登录
 *   7. 支持验证码登录
 *   8. 添加隐私协议勾选
 *   9. 优化动画和过渡效果
 *   10. 添加密码显示切换
 -->
 <template>
	<view class="page">
		<!-- 背景动画 -->
		<view class="bg-animation"></view>
		
		<!-- 登录容器 -->
		<view class="login-container">
			<!-- 头部 -->
			<view class="login-header">
				<view class="back-btn" @click="handleBack" v-if="showBack">
					<uni-icons type="left" size="24" color="#fff"></uni-icons>
				</view>
				<view class="logo-section">
					<image src="/static/logo.png" class="logo" mode="aspectFit"></image>
					<text class="app-name">校园资讯</text>
					<text class="app-desc">连接校园，发现精彩</text>
				</view>
			</view>
			
			<!-- 登录表单 -->
			<view class="login-form">
				<!-- 登录方式切换 -->
				<view class="login-type-tabs">
					<view 
						class="tab-item" 
						:class="{ 'active': loginType === 'password' }"
						@click="loginType = 'password'"
					>
						密码登录
					</view>
					<view 
						class="tab-item" 
						:class="{ 'active': loginType === 'verifyCode' }"
						@click="loginType = 'verifyCode'"
					>
						验证码登录
					</view>
				</view>
				
				<!-- 密码登录表单 -->
				<view class="form-content" v-if="loginType === 'password'">
					<view class="form-group" :class="{ 'error': formErrors.username }">
						<view class="form-label">
							<uni-icons type="person" size="20" color="#666"></uni-icons>
							<text>用户名/学号</text>
						</view>
						<input 
							class="form-input" 
							v-model="formData.username" 
							placeholder="请输入用户名或学号"
							@input="validateField('username')"
							@blur="validateField('username', true)"
							:maxlength="20"
							placeholder-style="color: #999"
						/>
						<view class="clear-btn" v-if="formData.username" @click="clearField('username')">
							<uni-icons type="clear" size="16" color="#999"></uni-icons>
						</view>
						<view class="error-msg" v-if="formErrors.username">{{ formErrors.username }}</view>
					</view>
					
					<view class="form-group" :class="{ 'error': formErrors.password }">
						<view class="form-label">
							<uni-icons type="locked" size="20" color="#666"></uni-icons>
							<text>密码</text>
						</view>
						<input 
							class="form-input" 
							type="password" 
							v-model="formData.password" 
							placeholder="请输入密码"
							:password="!showPassword"
							@input="validateField('password')"
							@blur="validateField('password', true)"
							:maxlength="20"
							placeholder-style="color: #999"
						/>
						<view class="input-actions">
							<view class="show-pwd" @click="togglePassword">
								<uni-icons :type="showPassword ? 'eye-slash' : 'eye'" size="20" color="#999"></uni-icons>
							</view>
							<view class="clear-btn" v-if="formData.password" @click="clearField('password')">
								<uni-icons type="clear" size="16" color="#999"></uni-icons>
							</view>
						</view>
						<view class="error-msg" v-if="formErrors.password">{{ formErrors.password }}</view>
					</view>
					
					<view class="form-options">
						<view class="remember-me">
							<label class="checkbox" :class="{ 'checked': formData.remember }" @click="formData.remember = !formData.remember">
								<uni-icons v-if="formData.remember" type="checkmark" size="12" color="#fff"></uni-icons>
							</label>
							<text>记住密码</text>
						</view>
						<view class="forgot-pwd" @click="handleForgotPassword">
							<text>忘记密码？</text>
						</view>
					</view>
				</view>
				
				<!-- 验证码登录表单 -->
				<view class="form-content" v-else>
					<view class="form-group" :class="{ 'error': formErrors.phone }">
						<view class="form-label">
							<uni-icons type="phone" size="20" color="#666"></uni-icons>
							<text>手机号</text>
						</view>
						<input 
							class="form-input" 
							v-model="formData.phone" 
							type="number"
							placeholder="请输入手机号"
							@input="validateField('phone')"
							@blur="validateField('phone', true)"
							:maxlength="11"
							placeholder-style="color: #999"
						/>
						<view class="clear-btn" v-if="formData.phone" @click="clearField('phone')">
							<uni-icons type="clear" size="16" color="#999"></uni-icons>
						</view>
						<view class="error-msg" v-if="formErrors.phone">{{ formErrors.phone }}</view>
					</view>
					
					<view class="form-group" :class="{ 'error': formErrors.verifyCode }">
						<view class="form-label">
							<uni-icons type="email" size="20" color="#666"></uni-icons>
							<text>验证码</text>
						</view>
						<input 
							class="form-input" 
							v-model="formData.verifyCode" 
							type="number"
							placeholder="请输入验证码"
							@input="validateField('verifyCode')"
							@blur="validateField('verifyCode', true)"
							:maxlength="6"
							placeholder-style="color: #999"
						/>
						<view class="input-actions">
							<button 
								class="verify-code-btn" 
								:disabled="verifyCodeDisabled"
								:class="{ 'disabled': verifyCodeDisabled }"
								@click="getVerifyCode"
							>
								{{ verifyCodeText }}
							</button>
						</view>
						<view class="error-msg" v-if="formErrors.verifyCode">{{ formErrors.verifyCode }}</view>
					</view>
				</view>
				
				<!-- 登录按钮 -->
				<button 
					class="login-btn" 
					type="primary" 
					:disabled="!formValid || isLoading"
					:class="{ 'disabled': !formValid || isLoading }"
					@click="handleLogin"
				>
					<uni-load-more v-if="isLoading" status="loading" :icon-size="16" :content-text="contentText"></uni-load-more>
					<text v-else>{{ loginType === 'password' ? '登录' : '验证码登录' }}</text>
				</button>
				
				<!-- 第三方登录 -->
				<view class="third-party-login" v-if="showThirdParty">
					<view class="divider">
						<view class="line"></view>
						<text class="text">其他登录方式</text>
						<view class="line"></view>
					</view>
					
					<view class="third-party-list">
						<view class="third-item" @click="handleWechatLogin">
							<view class="icon wechat">
								<uni-icons type="weixin" size="30" color="#fff"></uni-icons>
							</view>
							<text>微信</text>
						</view>
						<view class="third-item" @click="handleQQLogin">
							<view class="icon qq">
								<text class="iconfont">QQ</text>
							</view>
							<text>QQ</text>
						</view>
						<view class="third-item" @click="handleWeiboLogin">
							<view class="icon weibo">
								<uni-icons type="weibo" size="30" color="#fff"></uni-icons>
							</view>
							<text>微博</text>
						</view>
					</view>
				</view>
				
				<!-- 注册和协议 -->
				<view class="login-footer">
					<view class="agreement" @click="handleAgreement">
						<label class="checkbox" :class="{ 'checked': formData.agreed }" @click.stop="formData.agreed = !formData.agreed">
							<uni-icons v-if="formData.agreed" type="checkmark" size="12" color="#fff"></uni-icons>
						</label>
						<text>我已阅读并同意</text>
						<text class="link" @click.stop="handleUserAgreement">《用户协议》</text>
						<text>和</text>
						<text class="link" @click.stop="handlePrivacyPolicy">《隐私政策》</text>
					</view>
					
					<view class="register-link">
						<text>还没有账号？</text>
						<text class="link" @click="handleRegister">立即注册</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 协议弹窗 -->
		<view 
			class="agreement-overlay" 
			v-if="showAgreementPopup"
			@click="handleDisagree"
		>
			<view class="agreement-popup" @click.stop>
				<view class="popup-header">
					<text class="popup-title">用户协议和隐私政策</text>
				</view>
				
				<scroll-view class="popup-content" scroll-y>
					<view class="agreement-content">
						<text class="section-title">欢迎使用校园资讯！</text>
						<text class="section-text">
							请您仔细阅读并充分理解《用户协议》和《隐私政策》的全部内容，特别是免除或限制责任的条款、法律适用和争议解决条款。
						</text>
						<text class="section-text">
							如您同意，请点击"同意"开始接受我们的服务。我们非常重视您的个人信息保护，并将严格遵守相关法律法规要求，为您提供安全可靠的服务。
						</text>
					</view>
				</scroll-view>
				
				<view class="popup-footer">
					<view class="footer-btn cancel" @click="handleDisagree">不同意</view>
					<view class="footer-btn confirm" @click="handleAgree">同意并继续</view>
				</view>
			</view>
		</view>
		
		<!-- 底部安全区域 -->
		<view class="safe-area"></view>
	</view>
</template>

<script>
	import storage from '@/utils/storage.js';
	import { validatePhone, validatePassword, validateStudentId } from '@/utils/validate.js';
	import { debounce } from '@/utils/debounce.js';
	
	export default {
		data() {
			return {
				// 登录方式
				loginType: 'password',
				
				// 表单数据
				formData: {
					username: '',
					password: '',
					phone: '',
					verifyCode: '',
					remember: true,
					agreed: false
				},
				
				// 表单错误
				formErrors: {
					username: '',
					password: '',
					phone: '',
					verifyCode: ''
				},
				
				// 表单验证规则
				validationRules: {
					username: {
						required: true,
						validator: (val) => {
							// 支持用户名或学号
							if (!val) return false;
							const trimmed = val.trim();
							// 用户名：3-20位字母、数字、下划线
							if (/^[a-zA-Z0-9_]{3,20}$/.test(trimmed)) return true;
							// 学号：6-20位数字
							return validateStudentId(trimmed);
						},
						message: '用户名或学号格式不正确'
					},
					password: {
						required: true,
						validator: (val) => {
							if (!val) return false;
							const result = validatePassword(val);
							return result.valid && val.length >= 6 && val.length <= 20;
						},
						message: '密码长度为6-20位'
					},
					phone: {
						required: true,
						validator: validatePhone,
						message: '手机号格式不正确'
					},
					verifyCode: {
						required: true,
						validator: (val) => /^\d{6}$/.test(val),
						message: '验证码为6位数字'
					}
				},
				
				// 状态
				isLoading: false,
				showPassword: false,
				verifyCodeDisabled: false,
				verifyCodeText: '获取验证码',
				countdown: 60,
				showBack: true,
				showThirdParty: true,
				showAgreementPopup: false,
				
				// 加载组件配置
				contentText: {
					contentdown: '',
					contentrefresh: '登录中',
					contentnomore: ''
				}
			}
		},
		computed: {
			// 表单验证
			formValid() {
				if (!this.formData.agreed) return false;
				
				if (this.loginType === 'password') {
					return this.formData.username && 
						   this.formData.password && 
						   !this.formErrors.username && 
						   !this.formErrors.password;
				} else {
					return this.formData.phone && 
						   this.formData.verifyCode && 
						   !this.formErrors.phone && 
						   !this.formErrors.verifyCode;
				}
			}
		},
		created() {
			this.checkLoginStatus();
			this.checkAgreement();
		},
		onLoad(options) {
			if (options.type) {
				this.loginType = options.type;
			}
			if (options.hideBack) {
				this.showBack = false;
			}
		},
		onShow() {
			// 页面显示时恢复保存的登录信息
			if (this.formData.remember) {
				this.loadSavedCredentials();
			}
		},
		methods: {
			// 检查登录状态
			checkLoginStatus() {
				const userInfo = storage.get('userInfo');
				if (userInfo && userInfo.token) {
					uni.switchTab({
						url: '/pages/tabbar/index/index'
					});
				}
			},
			
			// 检查协议同意状态
			checkAgreement() {
				const agreed = storage.get('agreementAgreed');
				if (agreed) {
					this.formData.agreed = true;
				} else {
					this.showAgreementPopup = true;
				}
			},
			
			// 加载保存的凭证
			loadSavedCredentials() {
				const savedCredentials = storage.get('loginCredentials');
				if (savedCredentials) {
					this.formData.username = savedCredentials.username || '';
					this.formData.password = savedCredentials.password || '';
				}
			},
			
			// 保存登录凭证
			saveCredentials() {
				if (this.formData.remember && this.formData.username && this.formData.password) {
					storage.set('loginCredentials', {
						username: this.formData.username,
						password: this.formData.password
					});
				} else {
					storage.remove('loginCredentials');
				}
			},
			
			// 返回
			handleBack() {
				if (this.showBack) {
					uni.navigateBack();
				}
			},
			
			// 清空字段
			clearField(field) {
				this.formData[field] = '';
				this.formErrors[field] = '';
			},
			
			// 切换密码显示
			togglePassword() {
				this.showPassword = !this.showPassword;
			},
			
			// 验证字段
			validateField(field, force = false) {
				const value = this.formData[field];
				const rule = this.validationRules[field];
				
				if (!rule) return;
				
				// 清除之前的错误
				this.formErrors[field] = '';
				
				// 非强制验证时，空值不验证
				if (!force && !value) return;
				
				// 必填验证
				if (rule.required && !value) {
					this.formErrors[field] = '此项为必填项';
					return;
				}
				
				// 自定义验证
				if (value && rule.validator && !rule.validator(value)) {
					this.formErrors[field] = rule.message;
				}
			},
			
			// 获取验证码
			async getVerifyCode() {
				// 验证手机号
				this.validateField('phone', true);
				if (this.formErrors.phone || !this.formData.phone) {
					return;
				}
				
				try {
					// 模拟发送验证码
					uni.showLoading({ title: '发送中' });
					
					setTimeout(() => {
						uni.hideLoading();
						uni.showToast({
							title: '验证码已发送',
							icon: 'success'
						});
						
						// 开始倒计时
						this.startCountdown();
					}, 1000);
					
				} catch (error) {
					console.error('发送验证码失败:', error);
					uni.showToast({
						title: '发送失败，请重试',
						icon: 'none'
					});
				}
			},
			
			// 开始倒计时
			startCountdown() {
				this.verifyCodeDisabled = true;
				this.verifyCodeText = `${this.countdown}s后重试`;
				
				const timer = setInterval(() => {
					this.countdown -= 1;
					this.verifyCodeText = `${this.countdown}s后重试`;
					
					if (this.countdown <= 0) {
						clearInterval(timer);
						this.verifyCodeDisabled = false;
						this.verifyCodeText = '获取验证码';
						this.countdown = 60;
					}
				}, 1000);
			},
			
			// 登录
			async handleLogin() {
				// 验证表单
				if (this.loginType === 'password') {
					this.validateField('username', true);
					this.validateField('password', true);
					
					if (this.formErrors.username || this.formErrors.password) {
						return;
					}
				} else {
					this.validateField('phone', true);
					this.validateField('verifyCode', true);
					
					if (this.formErrors.phone || this.formErrors.verifyCode) {
						return;
					}
				}
				
				// 检查协议
				if (!this.formData.agreed) {
					uni.showToast({
						title: '请先同意用户协议',
						icon: 'none'
					});
					return;
				}
				
				// 开始登录
				this.isLoading = true;
				
				try {
					// 模拟登录请求
					setTimeout(() => {
						// 保存登录凭证
						this.saveCredentials();
						
						// 保存用户信息
						const username = this.formData.username || this.formData.phone;
						const userInfo = {
							id: 1001,
							username: username,
							phone: this.formData.phone || '',
							nickname: '用户' + username.slice(-4),
							avatar: '/static/images/生成动物写实头像.png', // 使用默认狐狸头像
							token: 'mock_token_' + Date.now(),
							loginType: this.loginType,
							loginTime: Date.now(),
							name: '',
							class: '',
							studentId: '',
							school: ''
						};
						
						storage.set('userInfo', userInfo);
						
						// 标记为已登录
						storage.set('isLoggedIn', true);
						
						// 显示登录成功
						uni.showToast({
							title: '登录成功',
							icon: 'success',
							duration: 1500
						});
						
						// 跳转
						setTimeout(() => {
							this.isLoading = false;
							
							// 检查是否有回调页面
							const pages = getCurrentPages();
							if (pages.length > 1) {
								uni.navigateBack();
							} else {
								uni.switchTab({
									url: '/pages/tabbar/index/index'
								});
							}
						}, 1500);
						
					}, 1500);
					
				} catch (error) {
					console.error('登录失败:', error);
					this.isLoading = false;
					
					uni.showToast({
						title: '登录失败，请重试',
						icon: 'none'
					});
				}
			},
			
			// 忘记密码
			handleForgotPassword() {
				uni.showToast({
					title: '忘记密码功能开发中',
					icon: 'none'
				});
				// uni.navigateTo({
				// 	url: '/pages/login/forgot'
				// });
			},
			
			// 第三方登录
			handleWechatLogin() {
				uni.showToast({
					title: '微信登录开发中',
					icon: 'none'
				});
			},
			
			handleQQLogin() {
				uni.showToast({
					title: 'QQ登录开发中',
					icon: 'none'
				});
			},
			
			handleWeiboLogin() {
				uni.showToast({
					title: '微博登录开发中',
					icon: 'none'
				});
			},
			
			// 注册
			handleRegister() {
				// 跳转到注册页面（如果存在）或显示提示
				uni.showToast({
					title: '注册功能开发中',
					icon: 'none'
				});
				// uni.navigateTo({
				// 	url: '/pages/user/register'
				// });
			},
			
			// 协议相关
			handleAgreement() {
				if (!this.formData.agreed) {
					this.showAgreementPopup = true;
				}
			},
			
			handleUserAgreement() {
				uni.showToast({
					title: '用户协议页面开发中',
					icon: 'none'
				});
				// uni.navigateTo({
				// 	url: '/pages/agreement/user'
				// });
			},
			
			handlePrivacyPolicy() {
				uni.showToast({
					title: '隐私政策页面开发中',
					icon: 'none'
				});
				// uni.navigateTo({
				// 	url: '/pages/agreement/privacy'
				// });
			},
			
			handleAgree() {
				this.formData.agreed = true;
				storage.set('agreementAgreed', true);
				this.showAgreementPopup = false;
			},
			
			handleDisagree() {
				this.showAgreementPopup = false;
				uni.showModal({
					title: '提示',
					content: '您需要同意用户协议和隐私政策才能使用我们的服务',
					showCancel: false,
					confirmText: '我知道了',
					success: () => {
						// 如果用户点击了"我知道了"，再次显示协议弹窗
						setTimeout(() => {
							this.showAgreementPopup = true;
						}, 500);
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
.page {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	overflow: hidden;
	
	.bg-animation {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(45deg, 
			rgba(102, 126, 234, 0.1) 0%, 
			rgba(118, 75, 162, 0.1) 25%,
			rgba(255, 107, 107, 0.1) 50%,
			rgba(255, 149, 0, 0.1) 75%,
			rgba(52, 199, 89, 0.1) 100%);
		background-size: 400% 400%;
		animation: gradientBG 15s ease infinite;
	}
	
	@keyframes gradientBG {
		0% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
		100% { background-position: 0% 50%; }
	}
}

.login-container {
	width: 100%;
	padding: 60rpx 40rpx;
	position: relative;
	z-index: 1;
}

.login-header {
	position: relative;
	margin-bottom: 60rpx;
	
	.back-btn {
		position: absolute;
		top: 0;
		left: 0;
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		backdrop-filter: blur(10rpx);
		
		&:active {
			background: rgba(255, 255, 255, 0.3);
		}
	}
	
	.logo-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		
		.logo {
			width: 120rpx;
			height: 120rpx;
			margin-bottom: 20rpx;
			border-radius: 24rpx;
			background: rgba(255, 255, 255, 0.9);
			padding: 20rpx;
			box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);
			animation: logoFloat 3s ease-in-out infinite;
		}
		
		@keyframes logoFloat {
			0%, 100% { transform: translateY(0); }
			50% { transform: translateY(-10rpx); }
		}
		
		.app-name {
			font-size: 48rpx;
			font-weight: bold;
			color: #fff;
			margin-bottom: 10rpx;
			text-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.2);
		}
		
		.app-desc {
			font-size: 24rpx;
			color: rgba(255, 255, 255, 0.9);
			letter-spacing: 2rpx;
		}
	}
}

.login-form {
	background-color: #fff;
	border-radius: 32rpx;
	padding: 60rpx 40rpx 50rpx;
	box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.2);
	animation: formSlideUp 0.6s ease-out;
	
	@keyframes formSlideUp {
		from {
			opacity: 0;
			transform: translateY(60rpx);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	.login-type-tabs {
		display: flex;
		background: #f5f5f5;
		border-radius: 30rpx;
		padding: 4rpx;
		margin-bottom: 50rpx;
		
		.tab-item {
			flex: 1;
			text-align: center;
			padding: 20rpx 0;
			border-radius: 30rpx;
			font-size: 28rpx;
			color: #666;
			font-weight: 500;
			transition: all 0.3s;
			
			&.active {
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				color: #fff;
				box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
			}
		}
	}
	
	.form-content {
		.form-group {
			margin-bottom: 40rpx;
			position: relative;
			
			&.error {
				.form-label {
					color: #ff3b30;
				}
				
				.form-input {
					border-color: #ff3b30;
					background: rgba(255, 59, 48, 0.05);
				}
			}
			
			.form-label {
				display: flex;
				align-items: center;
				gap: 12rpx;
				margin-bottom: 16rpx;
				font-size: 28rpx;
				font-weight: 600;
				color: #1a1a1a;
			}
			
			.form-input {
				width: 100%;
				height: 88rpx;
				padding: 0 24rpx;
				background: #f8f9fa;
				border: 2rpx solid transparent;
				border-radius: 16rpx;
				font-size: 30rpx;
				color: #1a1a1a;
				transition: all 0.3s;
				box-sizing: border-box;
				
				&:focus {
					background: #fff;
					border-color: #667eea;
					box-shadow: 0 0 0 6rpx rgba(102, 126, 234, 0.1);
				}
			}
			
			.clear-btn {
				position: absolute;
				right: 24rpx;
				top: 50%;
				transform: translateY(-50%);
				width: 40rpx;
				height: 40rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #e0e0e0;
				border-radius: 50%;
				
				&:active {
					background: #d0d0d0;
				}
			}
			
			.input-actions {
				position: absolute;
				right: 24rpx;
				top: 50%;
				transform: translateY(-50%);
				display: flex;
				align-items: center;
				gap: 20rpx;
				
				.show-pwd {
					width: 40rpx;
					height: 40rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					
					&:active {
						opacity: 0.7;
					}
				}
				
				.verify-code-btn {
					padding: 8rpx 20rpx;
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					color: #fff;
					border-radius: 20rpx;
					font-size: 24rpx;
					border: none;
					transition: all 0.3s;
					
					&:active:not(.disabled) {
						transform: scale(0.95);
						opacity: 0.9;
					}
					
					&.disabled {
						background: #e0e0e0;
						color: #999;
					}
				}
			}
			
			.error-msg {
				position: absolute;
				bottom: -30rpx;
				left: 0;
				font-size: 24rpx;
				color: #ff3b30;
			}
		}
		
		.form-options {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 50rpx;
			
			.remember-me {
				display: flex;
				align-items: center;
				gap: 12rpx;
				font-size: 24rpx;
				color: #666;
				
				.checkbox {
					width: 32rpx;
					height: 32rpx;
					border: 2rpx solid #ddd;
					border-radius: 6rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					transition: all 0.3s;
					
					&.checked {
						background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
						border-color: transparent;
					}
				}
			}
			
			.forgot-pwd {
				font-size: 24rpx;
				color: #667eea;
				
				&:active {
					opacity: 0.7;
				}
			}
		}
	}
	
	.login-btn {
		margin-top: 20rpx;
		height: 96rpx;
		line-height: 96rpx;
		border-radius: 48rpx;
		font-size: 34rpx;
		font-weight: 600;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: #fff;
		border: none;
		box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.4);
		transition: all 0.3s;
		letter-spacing: 1rpx;
		
		&:active:not(.disabled) {
			transform: scale(0.98);
			box-shadow: 0 4rpx 15rpx rgba(102, 126, 234, 0.3);
		}
		
		&.disabled {
			background: #e0e0e0;
			color: #999;
			box-shadow: none;
		}
		
		::v-deep .uni-load-more {
			height: 96rpx;
			line-height: 96rpx;
			
			.uni-load-more__text {
				color: #fff;
				font-size: 34rpx;
			}
		}
	}
	
	.third-party-login {
		margin-top: 60rpx;
		
		.divider {
			display: flex;
			align-items: center;
			margin-bottom: 40rpx;
			
			.line {
				flex: 1;
				height: 1rpx;
				background: #e0e0e0;
			}
			
			.text {
				padding: 0 20rpx;
				font-size: 24rpx;
				color: #999;
			}
		}
		
		.third-party-list {
			display: flex;
			justify-content: center;
			gap: 60rpx;
			
			.third-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 12rpx;
				
				.icon {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					
					&.wechat {
						background: linear-gradient(135deg, #07C160, #09A855);
					}
					
					&.qq {
						background: linear-gradient(135deg, #12B7F5, #0E9AE0);
						
						.iconfont {
							font-size: 36rpx;
							color: #fff;
							font-weight: bold;
						}
					}
					
					&.weibo {
						background: linear-gradient(135deg, #E6162D, #C91428);
					}
				}
				
				text {
					font-size: 24rpx;
					color: #666;
				}
			}
		}
	}
	
	.login-footer {
		margin-top: 50rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 30rpx;
		
		.agreement {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			justify-content: center;
			gap: 8rpx;
			font-size: 24rpx;
			color: #999;
			
			.checkbox {
				width: 28rpx;
				height: 28rpx;
				border: 2rpx solid #ddd;
				border-radius: 6rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				transition: all 0.3s;
				
				&.checked {
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					border-color: transparent;
				}
			}
			
			.link {
				color: #667eea;
				
				&:active {
					opacity: 0.7;
				}
			}
		}
		
		.register-link {
			font-size: 28rpx;
			color: #666;
			
			.link {
				color: #667eea;
				font-weight: 600;
				
				&:active {
					opacity: 0.7;
				}
			}
		}
	}
}

.agreement-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 1000;
	display: flex;
	align-items: center;
	justify-content: center;
	animation: fadeIn 0.3s;
}

.agreement-popup {
	background: #fff;
	border-radius: 20rpx;
	overflow: hidden;
	width: 600rpx;
	animation: scaleIn 0.3s;
	
	.popup-header {
		padding: 40rpx 30rpx 20rpx;
		border-bottom: 1rpx solid #f0f0f0;
		
		.popup-title {
			font-size: 36rpx;
			font-weight: 700;
			color: #333;
			text-align: center;
		}
	}
	
	.popup-content {
		max-height: 600rpx;
		padding: 30rpx;
		
		.agreement-content {
			display: flex;
			flex-direction: column;
			gap: 20rpx;
			
			.section-title {
				font-size: 32rpx;
				font-weight: 600;
				color: #333;
				margin-bottom: 10rpx;
			}
			
			.section-text {
				font-size: 28rpx;
				color: #666;
				line-height: 1.6;
			}
		}
	}
	
	.popup-footer {
		display: flex;
		padding: 20rpx 30rpx;
		border-top: 1rpx solid #f0f0f0;
		gap: 20rpx;
		
		.footer-btn {
			flex: 1;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			border-radius: 40rpx;
			font-size: 28rpx;
			font-weight: 600;
			
			&.cancel {
				background: #f5f5f5;
				color: #666;
			}
			
			&.confirm {
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				color: #fff;
			}
		}
	}
}

.safe-area {
	height: env(safe-area-inset-bottom);
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes scaleIn {
	from {
		transform: scale(0.9);
		opacity: 0;
	}
	to {
		transform: scale(1);
		opacity: 1;
	}
}
</style>