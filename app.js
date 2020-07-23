import api from '/utils/js/api.js'

App({
	onLaunch() {
		// 挂载接口
		wx.$api = api
		// 获取用户信息
		wx.getSetting({
			success:(res) => {
				if (res.authSetting['scope.userInfo']) {
					wx.getUserInfo({
						success:(response) => {
							this.globalData.userInfo = response.userInfo
						}
					})
				}
			} 
		})
	},
	globalData: {
		userInfo: null,
		openId: null,
		orderData: null,
		tempRoute: null
	}
})
