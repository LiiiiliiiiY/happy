const app = getApp()

Page({
	data: {
		canIUse: wx.canIUse('button.open-type.getPhoneNumber')
	},
	getPhoneNumber(e) {
		if (e.detail.encryptedData) {
			wx.login({
				success (res) {
					if(res.code) {
						wx.$api.getOpenId({
							code: res.code
						}).then(response => {
							wx.$api.quickLogin({
								session_key: response.session_key,
								encryptedData: e.detail.encryptedData,
								iv: e.detail.iv,
								real_openid: response.real_openid,
								nickName: app.globalData.userInfo.nickName,
								avatarUrl: app.globalData.userInfo.avatarUrl,
								gender: app.globalData.userInfo.gender
							}).then(data => {
								wx.setStorageSync("userId", response.openid)
								wx.setStorageSync("ruufooChecked", 1)
								wx.reLaunch({
									url: '/' + app.globalData.tempRoute,
									success: () => {
										app.globalData.tempRoute = null
									}
								})
							}).catch((res) => {
								wx.setStorageSync("ruufooChecked", 0)
							})
						})
					}
				}
			})
		}
	},
	codeLogin() {
		wx.navigateTo({
			url: '/pages/guide/tel/tel'
		})
	},
	later() {
		wx.navigateBack()
	}
})
