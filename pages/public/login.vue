<template>
	<ui-sys bg="ui-BG" :footer="false">
		<view class="logo-box flex justify-center align-center">
			<image src='../../static/logo.png' mode='widthFix' class="logo"></image>
		</view>
		<view class="p-5">
			<ui-form ui="ui-BG mt-4">
				<ui-form-group class="form-item" icon="cicon-my-o">
					<ui-input v-model="account.phone" placeholder="帐号户名/手机号"></ui-input>
				</ui-form-group>
				<ui-form-group class="form-item" icon="cicon-lock-o">
					<ui-input type="password" v-model="account.password" placeholder="帐号户密码"></ui-input>
				</ui-form-group>
			</ui-form>
			<view class="mt-5">
				<button class="ui-btn bg-blue-gradient radius lg block shadow shadow-blue" @tap="loginSubmit"
					:disabled="isLoading">
					登录
					<text class="cicon-loading1 icon-spin ml-3" v-if="isLoading"></text>
				</button>
			</view>
		</view>
	</ui-sys>
</template>

<script>
	import {
		login
	} from '@/api/account/account.js'
	export default {
		data() {
			return {
				account: {
					phone: '',
					password: ''
				},
				isLoading: false,
			}
		},
		methods: {
			loginSubmit() {

				if (!this.account.phone) {
					this.$util.showTips('请填写账户名')
					return
				}

				if (!this.account.password) {
					this.$util.showTips('请填写登录密码')
					return
				}

				this.isLoading = true;

				login(this.account, {
						debug: {
							token: '123456'
						}
					})
					.then(data => {
						uni.setStorageSync('auth', data)
						this.isLoading = false
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/index/index'
							})
						}, 300)
					})
					.catch(err => {
						console.log(err)
						this.isLoading = false
					});
			}
		}
	}
</script>

<style scoped>
	.logo-box {

		margin: 60upx auto;
	}

	.logo-box {
		margin-top: 240upx;

	}

	.logo {
		width: 160upx;
	}
</style>
