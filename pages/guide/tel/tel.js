const app = getApp()

Page({
	data: {
		send: false,
		tel: '',
		code: '',
		second: 60
	},
	telInput(e) {
		this.setData({
			tel: e.detail.value
		})
	},
	codeInput(e) {
		this.setData({
			code: e.detail.value
		})
	},
	sendCode() {
		let reg = /^1[345678]\d{9}$/
		if (!reg.test(this.data.tel)) {
			this.warnMsg('请输入正确的手机号码')
		} else {
			wx.$api.sendCode({
				send_type: 1,
				phone: this.data.tel
			}).then(res => {
				this.countTime()
			})
		}
	},
	countTime() {
		let second = this.data.second
		let interval = setInterval(() => {
			second --
			if (second <= 0) {
				clearInterval(interval)
				this.setData({
					second: 60,
					send: false
				})
			} else {
				this.setData({
					second: second,
					send: true
				})
			}
		}, 1000)
	},
	submit() {
		let reg = /^1[345678]\d{9}$/
		if (!reg.test(this.data.tel)) {
			this.warnMsg('请输入正确的手机号码')
		} else if (this.data.code.length != 4) {
			this.warnMsg('验证码格式有误')
		} else {
			let that = this
			wx.login({
				success (res) {
					if(res.code) {
						wx.$api.getOpenId({
							code: res.code
						}).then(response => {
							wx.$api.login({
								code: that.data.code,
								phone: that.data.tel,
								real_openid: response.real_openid,
								nickName: app.globalData.userInfo.nickName,
								avatarUrl: app.globalData.userInfo.avatarUrl,
								gender: app.globalData.userInfo.gender,
							}).then(data => {
								wx.setStorageSync("userId", response.openid)
								wx.setStorageSync("ruufooChecked", 1)
								wx.showToast({
									title: data.message,
									duration: 2000
								})
								wx.reLaunch({
									url: '/' + app.globalData.tempRoute,
									success: () => {
										app.globalData.tempRoute = null
									}
								})
							}).catch(data => {
								wx.setStorageSync("ruufooChecked", 0)
								that.warnMsg(data.message)
							})
						})
					}
				}
			})
			
			
		}
	},
	warnMsg(msg) {
		wx.showToast({
			title: msg,
			duration: 2000,
			icon: 'none'
		})
	},
	later() {
		wx.reLaunch({
			url: '/' + app.globalData.tempRoute,
			success: () => {
				app.globalData.tempRoute = null
			}
		})
	}
})
