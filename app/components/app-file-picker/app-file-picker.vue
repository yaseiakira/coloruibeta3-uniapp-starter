<template>
	<view class='app-file-picker van-uploader'>
		<view class="van-uploader__wrapper">
			<view class="van-uploader__preview" v-for="item in files" :key="item.Id">
				<image class="van-uploader__preview-image" :src="item.Url" mode="aspectFill">
				</image>
				<view class="van-uploader__mask" v-if="item.status != 1">
					<view class="van-uploader__loading">
						<text class="loading"
							:class="item.status == 0 ? '_icon-loader icon-spin' : '_icon-close-round-o'"></text>
					</view>
					<view class="van-uploader__mask-message">{{item.status == 0 ? '上传中...' : '上传失败'}}</view>
				</view>
				<view class="van-uploader__preview-delete" v-if="item.status != 0" @tap="deleteFile(item)">
					<text class="cicon-move van-uploader__preview-delete-icon"></text>
				</view>

			</view>
			<view class="van-uploader__upload" @tap="chooseFile" v-if="files.length < max">
				<text class="cicon-camera van-uploader__upload-icon"></text>
				<view v-if="text"><text class="text-sm">{{text}}</text></view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		upload,
		deleteFile
	} from '@/api/common/common.js'
	export default {
		name: 'AppFilePicker',
		model: {
			prop: 'value',
			event: 'input'
		},
		props: {
			text: {
				type: String,
				default: '上传图片'
			},
			value: {
				type: [String, Array]
			},
			mutil: {
				type: Boolean,
				default: false // true 多图, false 单图
			},
			max: {
				type: Number,
				default: 1
			},
			customData: {
				type: Object
			}
		},
		data() {
			return {
				files: []
			}
		},
		watch: {
			value: {
				deep: true,
				handler: function() {
					this.initFiles()
				}
			}
		},
		created() {
			this.initFiles()
		},
		methods: {
			deleteFile(item) {
				const index = this.files.findIndex(p => p.Id == item.Id)
				if (index != -1) {
					const item = this.files[index]
					if (item.status == 1) {
						deleteFile({
							url: item.Url
						}, {
							debug: true
						}).then(() => {}).catch(() => {})
					}
					this.files.splice(index, 1)
					this.updateValues()
				}
			},
			updateValues() {
				const successFiles = this.files.filter(p => p.status == 1)
				if (successFiles.length) {
					this.$emit('input', this.mutil ? successFiles.map(p => {
						return {
							Id: p.Id,
							Url: p.Url
						}
					}) : (successFiles[0].Url || ''))
				} else {
					this.$emit('input', this.mutil ? [] : '')
				}

			},
			initFiles() {
				if (this.value && this.value.length && typeof this.value == Object) {
					this.files = this.value.map(p => {
						return {
							Id: this.$util.getUuid(),
							Url: p,
							status: 1 // 0 上传中, 1 成功, 2 失败
						}
					})
				}
				if (this.value && typeof this.value == String) {
					this.files = [{
						Id: this.$util.getUuid(),
						Url: this.value,
						status: 1
					}]
				}
				if (!this.value) {
					this.files = []
				}
			},
			chooseFile() {

				uni.chooseImage({
					success: (res) => {
						const len = res.tempFilePaths.length
						if (len + this.files.length > this.max) {
							this.$util.showTips(`已超出最大上传限制:${this.max}`)
							return
						}
						if (len) {
							res.tempFilePaths.forEach((f, index) => {

								const item = {
									Id: this.$util.getUuid(),
									Url: f,
									status: 0
								}
								this.files.push(item)

								upload(f, this.customData, {
									// loading: `正在上传${index + 1}/{len}`,
									debug: [{
										Url: 'http://v9.emd315.com/content/images/media-empty.png'
									}]
								}).then(data => {
									const index = this.files.findIndex(p => p.Id == item.Id)
									if (data && data.length) {
										const {
											Url
										} = data[0]
										this.files[index].status = 1
										this.files[index].Url = Url
										this.updateValues()
									} else {
										this.files[index].status = 2
									}

								}).catch(err => {
									console.log(err)
									const index = this.files.findIndex(p => p.Id == item.Id)
									this.files[index].status = 2
								})

							})

						}
					},
					fail: (res) => {
						console.log(res)
						this.$util.showTips(res.errMsg)
					}
				})
			}
		}
	}
</script>

<style scoped>
	.van-uploader {
		position: relative;
		display: inline-block;
	}

	.van-uploader__wrapper {
		display: flex;
		flex-wrap: wrap;
	}

	.van-uploader__upload {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		width: 160upx;
		height: 160upx;
		margin: 0 16upx 16upx 0;
		background-color: #f7f8fa;
		border-radius: 16upx;
	}

	.van-uploader__upload-icon {
		color: #2F3033;
		font-size: 48upx;
	}

	.van-uploader__preview {
		position: relative;
		margin: 0 16upx 16upx 0;
		cursor: pointer;

	}

	.van-uploader__preview-image {
		display: block;
		width: 160upx;
		height: 160upx;
		overflow: hidden;
		border-radius: 16upx;
	}

	.van-uploader__preview-delete {
		position: absolute;
		top: -8upx;
		right: -8upx;
		width: 40upx;
		height: 40upx;
		background-color: #F94E4E;
		border-radius: 50%;
	}

	.van-uploader__preview-delete-icon {
		color: white;
		font-size: 32upx;
		font-weight: bold;
		position: absolute;
		top: 2upx;
		right: 4upx;
	}

	.van-uploader__mask {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #fff;
		background-color: rgba(50, 50, 51, 0.88);
		border-radius: 16upx;
	}

	.van-uploader__loading {
		width: 44upx;
		height: 44upx;
		color: #fff;

	}

	.van-uploader__loading .loading {
		font-size: 48upx;
	}

	.van-uploader__mask-message {
		margin-top: 24upx;
		padding: 0 8upx;
		font-size: 24upx;
		line-height: 24upx;
	}
</style>
