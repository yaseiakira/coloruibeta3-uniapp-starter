<template>
	<uni-data-picker v-slot:default="{data, error, options}" :map="{text:'name',value:'code'}" v-model="formData.code"
		:localdata="cities" popup-title="请选择地区" @change="onChange">
		<ui-menu-item arrow class="picker">
			<block slot='action'>
				<view v-if="error" class="text-red">
					<text>{{error}}</text>
				</view>
				<view v-else-if="data.length" class="selected flex align-center">
					<view v-for="(item,index) in data" :key="index" class="selected-item ml-2">
						<text>{{item.text}}</text>
					</view>
				</view>
				<view v-else>
					<view v-if="loading">
						<ui-loading></ui-loading>
					</view>
					<text v-else>请选择</text>
				</view>
			</block>
		</ui-menu-item>

	</uni-data-picker>
</template>

<script>
	import {
		cities
	} from '@/api/common/common.js'
	export default {
		name: 'AppCityPicker',
		model: {
			prop: 'value',
			event: 'change'
		},
		props: {
			value: {
				type: String
			}
		},
		data() {
			return {
				loading: true,
				cities: [],
				formData: {
					code: '',
					regionData: []
				}
			}
		},
		created() {

			this.getCities()
			this.initForm()
		},
		watch: {
			value: function() {
				this.initForm()
			}
		},
		methods: {
			getCities() {
				this.loading = true
				cities({
					debug: [{
						code: 1,
						name: '贵州省',
						children: [{
							code: 2,
							name: '遵义市',
							children: [{
								code: 4,
								name: '红花岗区'
							}, {
								code: 5,
								name: '新蒲新区'
							}]
						}, {
							code: 3,
							name: '贵阳市',
							children: [{
								code: 6,
								name: '花溪区'
							}]
						}]
					}]
				}).then(data => {
					this.cities = data
				}).catch((err) => {
					console.log(err)
				}).finally(() => {
					this.loading = false
				})
			},
			onChange({
				detail
			}) {
				const json = JSON.stringify(detail.value.map(p => {
					return {
						Code: p.value,
						Name: p.text
					}
				}))

				this.$emit('change', json)
			},
			initForm() {

				if (this.value && this.value.length) {
					const array = this.$ajutil.convertToJson(this.value, 'array')
					if (array.length) {
						this.formData.code = array[array.length - 1].Code
					}
					this.formData.regionData = array

				} else {
					this.formData.code = ''
				}
			}
		}
	}
</script>

<style scoped>
	.ui-menu-item.picker {
		padding: 0;
	}
</style>
