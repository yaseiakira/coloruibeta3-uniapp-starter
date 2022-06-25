import http from '@/app/js/http.js'

export function login(params, options) {
	return http.request('account/login', params, 'POST', options)
}
