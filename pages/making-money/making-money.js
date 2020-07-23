Page({
	data: {
		shareShow: false,
		imgShow: false
	},
	onLoad(options) {
		options.father_id && wx.setStorageSync("fatherId", options.father_id)
	},
	share() {
		this.setData({
			shareShow: true
		})
	},
	closeAd() {
		this.setData({
			imgShow: false
		})
	},
	shareToFriend() {
		this.setData({
			shareShow: false,
			imgShow: true
		})
	},
	handleContact(e) {
		
	},
	onShareAppMessage() {
		return {
			title: '团赚赚规则',
			path: '/pages/index/index' + (wx.getStorageSync('userId') ? ('?father_id=' + wx.getStorageSync('userId')) : '')
		}
	}
})
