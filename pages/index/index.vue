<template>
	<ui-sys bg="bg-appwhite" :footer="false">
		<ui-form ui="ui-BG">
			<ui-form-group title="出生地" contentui="justify-end">
				<app-city-picker v-model="formData.RegionData"></app-city-picker>
			</ui-form-group>
			<ui-form-group title="上传图片" contentui="justify-end">
				<app-file-picker v-model="formData.Avatar" :custom-data="{desc:'avatar'}"></app-file-picker>
			</ui-form-group>
		</ui-form>
	</ui-sys>
</template>

<script>
	
	export default {
		components: {
			
		},
		data() {
			return {
				formData: {
					Avatar: '',
					RegionData: '',
				}
			}
		},
		onLoad() {
			const auth = uni.getStorageSync('auth')
			if (!auth) {
				uni.reLaunch({
					url: '../public/login'
				})
			}
		},
		methods: {

			
		}
	}
</script>

<style scoped>
	.uploader {
		margin: 16upx 0 0 16upx;
	}
</style>
