import Vue from 'vue'
import moment from 'moment'

const datetimeFormat = {
	DATE_TIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
	DATE_FORMAT: 'YYYY-MM-DD',
	MDONLYFORMAT: 'MMMDo',
	TIMEFORMAT: 'HH:mm',
}

function strPaddingLeft(num, length, char = '0') {
	return (Array(length).join(char) + num).slice(-length)
}

function stringToMoment(dateStr) {
	if (dateStr) {
		return moment(dateStr, datetimeFormat.DATE_TIME_FORMAT)
	}
	return moment()
}

function formatToDateTime(date, format) {
	return moment(date).format(format);
}

function uniqueArray(array, key = '') {
	if (!array || array.length == 0) {
		return array
	}
	if (key) {
		return array.reduce((prev, cur) => prev.map(a => a[key]).includes(cur[key]) ? prev : [...prev, cur], []);
	}
	return array.reduce((prev, cur) => prev.includes(cur) ? prev : [...prev, cur], []);
}

function overflow(value, max = 100) {
	if (!value) {
		return ''
	}
	if (value.length > max) {
		value = value.substring(0, max) + '...'
	}
	return value
}

function formatFileSize(size, pointLength) {
	let unit = ''
	const units = ['B', 'K', 'M', 'G', 'TB']
	while ((unit = units.shift()) && size > 1024) {
		size = size / 1024
	}
	return (unit === 'B' ? size : size.toFixed(pointLength === undefined ? 2 : pointLength)) + unit
}

function convertToJson(json, type = 'object') {
	try {
		let result = json ? JSON.parse(json) : (type == 'object' ? {} : [])
		if (typeof result === 'string') {
			return utils.convertToJson(result, type)
		}
		return result
	} catch (e) {
		return type == 'object' ? {} : []
	}
}
const ajutil = {
	stringToMoment,
	formatToDateTime,
	formatFileSize,
	uniqueArray,
	overflow,
	convertToJson,
	datetimeFormat,
	strPaddingLeft,
	commonRegex: {
		phone: /^1[0-9]{10,10}$/,
		password: /^[\S]{6,12}$/,
		code: /^[A-Za-z0-9_-]+$/,
		idCard: /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/,
		decimal: /^\d+(\.\d+)?$/,
		email: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
		video: /\.(flv|3gp|rmvb|rm|swf|mp4|mkv|avi|mov|wmv|mpg)/i,
		audio: /\.(mp3|wma|ape|flac|aac|amr|m4a|m4r|ogg|wav)/i,
		image: /\.(jpg|jpeg|png|ico|bmp|gif|tif|tga)/i,
		zip: /\.zip/i,
		pdf: /\.pdf/i,
		word: /\.(doc|docx)/i,
		excel: /\.(xlx|xlsx)/i,
		ppt: /\.(ppt|pptx)/i,
		url: /^(http|https):\/\/.+/,
		windowsFile: /[\\\\/:*?\"<>|]/
	},
}
export default ajutil

Vue.prototype.$ajutil= ajutil;
Vue.prototype.$moment = moment;
