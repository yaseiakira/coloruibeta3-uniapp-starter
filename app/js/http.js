import store from '@/ui/store'

function upload(url, filePath, data = {}, options = {}) {
	return new Promise((resolve, reject) => {

		let header = {
			"Accept": "application/json",
		};

		const authInfo = uni.getStorageSync("auth")
		if (authInfo) {
			header['api-token'] = authInfo.token
		}

		if (options.loading) {
			uni.showLoading({
				title: typeof options.loading == Boolean ? '上传中...' : options.loading,
				mask: true
			})
		}

		let apiUrl = store.getters.getDomain + store.getters.getApiPath + '/' + url

		if (options.customApiPath) {
			apiUrl = store.getters.getDomain + options.customApiPath + '/' + url
		}

		if (options.debug) {
			setTimeout(() => {
				resolve(options.debug)
			}, 1000)
			uni.hideLoading()
			return
		}

		const mapFields = store.getters.getResponseMap

		const task = uni.uploadFile({
			url: apiUrl,
			filePath, // 要上传文件资源的路径。
			name: 'file',
			// #ifdef  H5
			withCredentials: true,
			// #endif
			formData: data,
			header: header,
			success(res) {
				if (res.statusCode == 200) {

					const resData = JSON.parse(res.data)

					const Success = resData[mapFields.Success]
					const Message = resData[mapFields.Message]
					const Data = resData[mapFields.Data]
					const NeedLogin = resData[mapFields.NeedLogin]

					if (NeedLogin) {
						uni.showToast({
							title: Message,
							icon: 'none'
						})
					}
					if (Success) {
						resolve(Data);
					} else {
						reject(Message)
						uni.showToast({
							title: Message,
							icon: 'none'
						})

					}
				} else {
					if (res.statusCode == 401) {
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
					} else {

						let errMsg = '接口请求错误'
						if (res.data && res.message) {
							errMsg = res.message
						}

						if (typeof res.data === 'string') {
							const matchs = res.data.match(/<title>\S+<\/title>/i)
							if (matchs && matchs.length) {
								errMsg = matchs[0].replace(/<\/?[^>]*>/g, '') || '接口请求错误:server error'
							}
							errMsg = `${errMsg} ${res.statusCode}`
						}

						reject(errMsg)
						uni.showToast({
							title: errMsg.length > 20 ? errMsg.substring(0, 20) + '...' :
								errMsg,
							icon: 'none'
						})

						uni.setStorageSync('errordetail', errMsg)
					}
				}
			},
			fail(err) {
				const errMsg = typeof err == String ? err : JSON.stringify(err)
				uni.showToast({
					title: errMsg.length > 20 ? errMsg.substring(0, 20) + '...' : errMsg,
					icon: 'none'
				})

				uni.setStorageSync('errordetail', errMsg)
				console.log(err)
				reject(errMsg)
			},
			complete() {
				uni.hideLoading();
			}
		})

		if (options.onProgressUpdate) {
			task.onProgressUpdate((res) => {
				options.onProgressUpdate(res)
			})
		}

	});
}

function request(url, data = {}, method = "GET", options = {}) {
	return new Promise(function(resolve, reject) {
		let header = {
			"Accept": "application/json",
		};

		const authInfo = uni.getStorageSync("auth")
		if (authInfo) {
			header['api-token'] = authInfo.token
		}

		if (options.loading) {
			uni.showLoading({
				title: typeof options.loading == Boolean ? '加载中...' : options.loading,
				mask: true
			})
		}

		let apiUrl = store.getters.getDomain + store.getters.getApiPath + '/' + url

		if (options.customApiPath) {
			apiUrl = store.getters.getDomain + options.customApiPath + '/' + url
		}

		if (options.debug) {
			setTimeout(() => {
				resolve(options.debug)
			}, 1000)
			uni.hideLoading()
			return
		}

		const mapFields = store.getters.getResponseMap

		uni.request({
			url: apiUrl,
			data: data,
			method: method,
			header: header,
			success(res) {
				if (res.statusCode == 200) {

					const Success = res.data[mapFields.Success]
					const Message = res.data[mapFields.Message]
					const Data = res.data[mapFields.Data]
					const NeedLogin = res.data[mapFields.NeedLogin]

					if (NeedLogin) {
						uni.showToast({
							title: Message,
							icon: 'none'
						})
						setTimeout(() => {
							uni.removeStorageSync('auth');
							store.commit('setLogin', false);
							uni.reLaunch({
								url: store.getters.getLoginPath
							});
						}, 1500)
					}
					if (Success) {
						resolve(Data);
					} else {
						reject(Message)
						uni.showToast({
							title: Message,
							icon: 'none'
						})

					}
				} else {
					if (res.statusCode == 401) {
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
						setTimeout(() => {
							uni.removeStorageSync('auth');
							store.commit('setLogin', false);
							uni.reLaunch({
								url: '/pages/login/login'
							});
						}, 1500)
					} else {

						let errMsg = '接口请求错误'
						if (res.data && res.message) {
							errMsg = res.message
						}

						if (typeof res.data === 'string') {
							const matchs = res.data.match(/<title>\S+<\/title>/i)
							if (matchs && matchs.length) {
								errMsg = matchs[0].replace(/<\/?[^>]*>/g, '') || '接口请求错误:server error'
							}
							errMsg = `${errMsg} ${res.statusCode}`
						}

						reject(errMsg)
						uni.showToast({
							title: errMsg.length > 20 ? errMsg.substring(0, 20) + '...' :
								errMsg,
							icon: 'none'
						})

						uni.setStorageSync('errordetail', errMsg)
					}
				}
			},
			fail(err) {
				const errMsg = typeof err == String ? err : JSON.stringify(err)
				uni.showToast({
					title: errMsg.length > 20 ? errMsg.substring(0, 20) + '...' : errMsg,
					icon: 'none'
				})

				uni.setStorageSync('errordetail', errMsg)
				console.log(err)
				reject(errMsg)
			},
			complete() {
				uni.hideLoading();
			}
		})
	});
}

const http = {
	request,
	upload
}

export default http
