Page({
	data: {
		orderType: '0',
		showquxiao: false,
		allOrderTypeList: [
			{ name: '全部', value: '0' },
			{ name: '进行中', value: '1' },
			{ name: '待支付', value: '2' },
			{ name: '待发货', value: '3' },
			{ name: '待收货', value: '4' },
			{ name: '已完成', value: '5' },
			{ name: '其他', value: '6' },
		],
		orderList: [],
		page: 1,
		pageCount: 1
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.setData({
			orderType: options.id ? options.id : '0'
		})
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {
		this.setData({
			page: 1
		})
		this.getOrderList()
	},
	//取消订单
    endorder(e){
        wx.$api.cancelOrder({
            order_id: e.currentTarget.dataset.id,
        }, true).then(res => {
            this.setData({
                showquxiao: true
            })
        })
    },
	//关闭弹窗
	closeDialog(){
		this.setData({
			showquxiao: false
		})
		this.onShow()
	},
	getOrderList() {
		wx.$api.orders({
			page: this.data.page,
			limit: 10,
			type: this.data.orderType
		}, true).then(res => {
			this.setData({
				pageCount: res.last_page,
				orderList: this.data.page == 1 ? res.data : this.data.orderList.concat(res.data)
			})
		})
	},
	onSelectOrderType(ev) {
		if(this.data.orderType == ev.currentTarget.dataset.value) return
		this.setData({
			orderType: ev.currentTarget.dataset.value
		})
		this.onShow()
	},
	onPayOrder(ev) {
		var _orderId = ev.currentTarget.dataset.id
		wx.$api.pay({
			orderid: _orderId
		}).then(data => {
			wx.requestPayment({
				timeStamp: data.payinfo.timeStamp,
				nonceStr: data.payinfo.nonceStr,
				package: data.payinfo.package,
				signType: data.payinfo.signType,
				paySign: data.payinfo.paySign,
				success: res => {
					wx.$api.paymentSuccessCallback({
						orderid: _orderId
					})
					wx.redirectTo({
						url: '/pages/cart/order/payment-success/payment-success?orderId=' + _orderId
					})
				},
				fail: err => {
					wx.showToast({
						title: err,
						icon: 'none',
						duration: 2000
					})
				}
			})
		}).catch(data => {
			wx.showToast({
				title: data.message,
				icon: 'none',
				duration: 2000
			})
		})
	},
	/**
	 * 页面上拉触底事件的处理函数
	 */
	loadMore() {
		console.log(this.data.pageCount)
		if(this.data.page < this.data.pageCount) {
			this.setData({
				page: this.data.page + 1
			})
			this.getOrderList()
		}
	},
    //确认收货
    confirmOrder(e){
        wx.$api.getShip({
            order_id: e.currentTarget.dataset.id,
        }, true).then(res => {
            wx.showToast({
                title: '已确认收货',
                icon:"none"
            })
            this.onShow()
        }).catch(data => {
            wx.showToast({
                title: data.msg,
                icon: 'none',
                duration: 2000
            })
        })
	},
	//回到首页
	backindex(){
		wx.switchTab({
            url: '/pages/index/index'
        })
	},
	//支付
	pay(e) {
        wx.$api.wcPay({
            order_id: e.currentTarget.dataset.id
        }).then(data => {
            wx.requestPayment({
                timeStamp: data.timeStamp,
                nonceStr: data.nonceStr,
                package: data.package,
                signType: data.signType,
                paySign: data.paySign,
                success: (response) => {
                    wx.reLaunch({
                        url: '/pages/mine/my-order-detail/my-order-detail?id=' + e.currentTarget.dataset.id
                    })
                },
                fail: (response) => {
                    wx.reLaunch({
                        url: '/pages/mine/my-order-detail/my-order-detail?id=' + e.currentTarget.dataset.id
                    })
                }
            })
		})
	},
})