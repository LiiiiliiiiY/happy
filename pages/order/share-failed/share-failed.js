Page({
	data: {
		status: 0,
		personShow: false,
		fromId: '',
		orderInfo: null,
		orderId: '',
		memberPreview: [],
		hot: []
	},
	onLoad(options) {
		console.log(options.status)
		this.setData({
			orderId: options.id,
			status: options.status,
			fromId: options.fromId
		})
		this.getData()
	},
	openPersonDialog() {
		this.setData({
			personShow: true
		})
	},
	closePersonDialog() {
		this.setData({
			personShow: false
		})
	},
	goHome() {
		wx.switchTab({
			url: '/pages/index/index'
		})
	},
	// 再拼一单
	oneMore() {
		wx.navigateTo({
			url: '/pages/goods/goods-detail/goods-detail?id=' + this.data.orderInfo.goods_id
		})
	},
	// 发起小团
	launchSmall() {
		wx.navigateTo({
			url: '/pages/order/confirm-order/confirm-order?type=2&goods_id=' + this.data.orderInfo.goods_id
		})
	},
	getData() {
		wx.$api.groupBooking({
			user_id: this.data.fromId,
		    order_id: this.data.orderId
		}, true).then(res => {
			let member = []
			for (let i = 0; i < 5; i++) {
				member.push(res.user[i] ? res.user[i] : {})
			}
		    this.setData({
		        orderInfo: res,
				memberPreview: member
		    })
		})
		
		wx.$api.getHot().then(res => {
			this.setData({
			    hot: res
			})
		})
	},
	checkDetail(e) {
		wx.navigateTo({
			url: '/pages/goods/goods-detail/goods-detail?id=' + e.currentTarget.dataset.id
		})
	},
	buy(e) {
		if (!wx.getStorageSync('userId')) {
			this.setData({
				adShow: true
			})
			return
		}
		wx.navigateTo({
			url: '/pages/order/confirm-order/confirm-order?type=' + e.currentTarget.dataset.type + '&goods_id=' + e.currentTarget.dataset.item.goods_id
		})
	}
})
