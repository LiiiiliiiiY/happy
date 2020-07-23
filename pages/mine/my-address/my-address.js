Page({
	data: {
		addressList: [],
		orderFlag: false
	},
	onLoad(options) {
		// 判断是否从确认订单页进入
		if (options.fromOrder) {
			this.setData({
				orderFlag: true
			})
		}
	},
	serMoren(){
		
	},
	// 获取用户收货地址列表
	getAddressList() {
		// wx.$api.getAddressList({openid: wx.getStorageSync('userId')}, true).then(res => {
		// 	this.setData({
		// 		addressList: res.list
		// 	})
		// })
		wx.$api.getAddressList({}, true).then(res => {
			this.setData({
				addressList: res
			})
		})
	},
	setMoren(e) {
		if (e.currentTarget.dataset.flag == 0) {
			wx.$api.flagAddress({address_id: e.currentTarget.dataset.id}, true).then(res => {
				// wx.showToast({title: "设置成功"})
				this.onShow()
			})
		} else{
			wx.showToast({title: "已经是默认地址"})
		}
		
	},
	deleteAddress(e) {
		wx.$api.delAddress({address_id: e.currentTarget.dataset.id}, true).then(res => {
            wx.showToast({title: "删除成功"})
            this.onShow()
        })
	},
	// 获取用户微信收货地址
	onGetUserAddress() {
        wx.chooseAddress({
            success (res) {
				console.log(res)
				wx.$api.addAddress({
                    user_name: res.userName,
                    phone: res.telNumber,
                    province: res.provinceName,
                    city: res.cityName,
                    area: res.countyName,
                    desc: res.detailInfo,
                    is_flag: 0
                }, true).then(res => {})
            }
        })
	},
	onEditAddress(ev) {
		let itemstring = JSON.stringify(ev.currentTarget.dataset.item)
		wx.navigateTo({url: `/pages/mine/my-add-address/my-add-address?type=edit&id=${itemstring}`})
	},
	// 向确认订单页传参
	changeOrderAddress(e) {
		if (this.data.orderFlag) {
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.emit('acceptDataFromOpenedPage', {data: e.currentTarget.dataset.item})
			wx.navigateBack()
		}
	},
	onShow() {
		this.getAddressList()
	}
})