Page({
	data: {
		personShow: false,
		orderInfo: null,
		orderId: '',
		memberPreview: []
	},
	onLoad(options) {
		this.setData({
			orderId: options.id
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
		wx.$api.getOrderInfo({
			user_id: wx.getStorageSync('userId'),
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
	}
})
