Page({
    data: {
		order_id: '',
		info: {},
		sn: ''
    },
    onLoad(options) {
		this.setData({
			order_id: options.id
		})
	},
    onShow() {
        this.getExpressInfo()
    },
	getExpressInfo() {
		console.log(this.data.orderId)
		wx.$api.trackOrder({order_id: this.data.order_id}, true).then(res => {
			this.setData({
				info: res
			})
		})
	},
	copy() {
		wx.setClipboardData({
			data: this.data.sn
		})
	}
})