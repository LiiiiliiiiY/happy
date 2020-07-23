const app = getApp()

Page({
	data: {
		home: {},
		adShow: false
	},
	onLoad(options) {
		this.getData()
		options.father_id && wx.setStorageSync("fatherId", options.father_id)
		!wx.getStorageSync('userId') && this.setData({
			adShow: true
		})
	},
	checkDetail(e) {
		wx.navigateTo({
			url: '/pages/goods/goods-detail/goods-detail?id=' + e.currentTarget.dataset.id
		})
	},
	go(e) {
		wx.switchTab({
			url: '/pages/making-money/making-money'
		})
	},
	getData() {
		wx.$api.homePage().then(res => {
			this.setData({
				home: res
			})
		})
	},
	bindGetUserInfo(e) {
		if (e.detail.userInfo) {
			app.globalData.userInfo = e.detail.userInfo
			let that = this
			wx.login({
				success (res) {
					if(res.code) {
						wx.$api.getOpenId({
							code: res.code,
							father_id: wx.getStorageSync('fatherId') || '',
							...e.detail.userInfo
						}).then(response => {
							wx.setStorageSync("userId", response.user_id)
							that.setData({
								adShow: false
							})
						})
					}
				}
			})
		}
	},
	closeAd() {
		this.setData({
			adShow: false
		})
	},
	buy(e) {
		if (!wx.getStorageSync('userId')) {
			this.setData({
				adShow: true
			})
			return
		}
		app.globalData.orderData = e.currentTarget.dataset.item
		wx.navigateTo({
			url: '/pages/order/confirm-order/confirm-order?type=' + e.currentTarget.dataset.type + '&goods_id=' + e.currentTarget.dataset.item.goods_id
		})
	},
	onShareAppMessage() {
		return {
			path: '/pages/index/index'
		}
	}
})
