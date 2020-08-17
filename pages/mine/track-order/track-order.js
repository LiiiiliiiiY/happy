Page({
    data: {
		order_id: '',
		info: {},
		sn: ''
    },
    onLoad(options) {
		console.log("options:" + options)
		this.setData({
			// order_id: options.id ? options.id : options.groupId
			order_id: options.id
		})
        this.getExpressInfo()
	},
    onShow() {
    },
	getExpressInfo() {
		console.log(this.data.order_id)
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