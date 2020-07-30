Page({
	data: {
		orderType: '0',
		showquxiao: false,
		allOrderTypeList: [
			{ name: '全部', value: '0' },
			{ name: '等待开奖', value: '1' },
			{ name: '已中奖', value: '2' },
			{ name: '未中奖', value: '3' }
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
	},
	getOrderList() {
		wx.$api.my_loot({
			page: this.data.page,
			limit: 8,
			type: this.data.orderType
		}, true).then(res => {
			if (res.last_page == this.data.page || !res.last_page) {
				this.setData({
					noMore: true
				})
			}
			this.setData({
				pageCount: res.last_page,
				orderList: this.data.page == 1 ? res.data : this.data.orderList.concat(res.data)
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
	//回到首页
	backindex(){
		wx.switchTab({
            url: '/pages/index/index'
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
    pay(e) {
		wx.$api.confirm_payment({
            order_id: e.currentTarget.dataset.id
        }, true).then(res => {
            wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 2000
            })
            setTimeout(() => {
                wx.navigateTo({
                    url: '/pages/mine/my-order/my-order'
                })
            },2100)
        }).catch(data => {
            wx.showToast({
                title: data.msg,
                icon: 'none',
                duration: 2000
            })
        })
		// let goods = [], list = this.data.list
		// for (let i = 0; i < list.length; i++) {
		// 	goods.push({
		// 		goodsid: list[i].goodsid,
		// 		optionid: list[i].optionid,
		// 		total: list[i].total,
		// 		cartid: list[i].id,
		// 		lens_id: list[i].lens_id
		// 	})
		// }
		// if (this.data.address) {
		// 	wx.$api.submitOrder({
		// 		addressid: this.data.address.id,
		// 		couponid: this.data.coupon.id ? this.data.coupon.id : 0,
		// 		freight: this.data.postage ? this.data.postage : 0,
		// 		goods_cost: this.data.totalPrice,
		// 		pay_cost: this.data.grandTotal,
		// 		remark: this.data.remark,
		// 		goods: JSON.stringify(goods)
		// 	}).then(res => {
		// 		wx.$api.pay({
		// 			orderid: res.orderid
		// 		}).then(data => {
		// 			wx.requestPayment({
		// 				timeStamp: data.payinfo.timeStamp,
		// 				nonceStr: data.payinfo.nonceStr,
		// 				package: data.payinfo.package,
		// 				signType: data.payinfo.signType,
		// 				paySign: data.payinfo.paySign,
		// 				success: (response) => {
		// 					wx.$api.paymentSuccessCallback({
		// 						orderid: res.orderid
		// 					})
		// 					wx.redirectTo({
		// 						url: '/pages/cart/order/payment-success/payment-success?orderId=' + res.orderid
		// 					})
		// 				},
		// 				fail: (response) => {
		// 					wx.redirectTo({
		// 						url: '/pages/cart/order/payment-failed/payment-failed?orderId=' + res.orderid
		// 					})
		// 				}
		// 			})
		// 		}).catch(data => {
		// 			wx.showToast({
		// 				title: data.message,
		// 				icon: 'none',
		// 				duration: 2000
		// 			})
		// 		})
		// 	}).catch(res => {
		// 		wx.showToast({
		// 			title: res.message,
		// 			icon: 'none',
		// 			duration: 2000
		// 		})
		// 	})
		// } else {
		// 	wx.showToast({
		// 		title: '请选择收货地址',
		// 		icon: 'none',
		// 		duration: 2000
		// 	})
		// }
	}
})