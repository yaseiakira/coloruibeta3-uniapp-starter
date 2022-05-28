const baseUrlConfig = {
	// #ifdef APP-PLUS || MP
	baseUrl : 'http://localhost:63002'
	// #endif
	
	// #ifdef H5
	 baseUrl : ''
	// #endif
}


module.exports = baseUrlConfig