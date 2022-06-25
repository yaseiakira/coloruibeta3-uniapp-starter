import http from '@/app/js/http.js'

export function cities(options) {
	return http.request('common/cities', null, 'GET', options)
}

export function upload(filePath, params, options) {
	return http.upload('common/upload', filePath, params, options)
}

export function deleteFile(params, options) {
	return http.request('common/deleteFile', params, 'POST', options)
}
