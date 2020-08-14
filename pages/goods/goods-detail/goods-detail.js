const app = getApp()

Page({
	data: {
		detail: null,
		height: 0,
		loginShow: false,
		trackShow: false,
		id: '',
		shareShow: false,
		imgShow: false,
		adShow: false
	},
	onLoad(options) {
		this.setData({
			id: options.id
		})
		options.father_id && wx.setStorageSync("fatherId", options.father_id)
		this.getData(options.id)
	},
	openTrackDialog() {
		this.setData({
			trackShow: true
		})
	},
	closeTrackDialog() {
		this.setData({
			trackShow: false
		})
	},
	imgShow(e) {
		wx.previewImage({
			current: e.currentTarget.dataset.src,
			urls: this.data.detail.slideshow_imgs,
		})
	},
	imageLoad(e) {
		// let imgwidth = e.detail.width, imgheight = e.detail.height, ratio = imgwidth / imgheight
		// this.setData({
		//     height: 750 / ratio,
		// })
	},
	// 客服回调
	handleContact(e) {
	},
	getData(id) {
		wx.$api.goodsDetail({
			goods_id: id
		}).then(res => {
			let content = res.goods_desc
			content = content.replace(/\<p/gi, '<p style="width:100%;max-width:100%;box-sizing:border-box;" ')
							 .replace(/\<img/gi, '<img class="detail-img" style="display:block;max-width:100%;width:100%;height:auto" ')
			res.goods_desc = content
			this.setData({
				detail: res
			})
		})
	},
	addToCart(e) {
		if (!wx.getStorageSync('userId')) {
			this.setData({
				adShow: true
			})
			return
		}
		wx.navigateTo({
			url: '/pages/order/confirm-order/confirm-order?type=' + e.currentTarget.dataset.type + '&goods_id=' + this.data.detail.goods_id
		})
	},
	share() {
		this.setData({
			shareShow: true
		})
	},
	shareToFriend() {
		this.setData({
			shareShow: false,
			imgShow: true
		})
	},
	closeAd() {
		this.setData({
			imgShow: false
		})
	},
	closeLogin() {
		this.setData({
			adShow: false
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
	onShareAppMessage() {
		return {
			title: this.data.detail.goods_name,
			imageUrl: this.data.detail.slideshow_imgs[0],
			path: '/pages/goods/goods-detail/goods-detail?id=' + this.data.id + '&' + (wx.getStorageSync('userId') ? ('father_id=' + wx.getStorageSync('userId')) : '')
		}
	},
})
