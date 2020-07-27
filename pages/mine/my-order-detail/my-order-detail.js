var setInterva
Page({
    data: {
        orderId: 0,
        orderInfo: {},
        chaperson: 0,
        showquxiao: false,
		shareShow: false,
		imgShow: false,
        endTime: '',
        dataTime: '',
        day: '',
        hou: '',
        min: '',
        sec: '',
        lensTypeList: {
            Myopia: "近视",
            Hyperopia: "远视",
            Progressive: "渐进",
        },
        orderStateIcon: {
            '待付款': 'iconicon1 iconfont',
            '待发货': 'iconicon2 iconfont',
            '待收货': 'iconicon3 iconfont',
            '已完成': ''
        }
    },
	onLoad(options) {
        this.setData({
            orderId: options.id ? options.id : options
        })
    },
    onHide(){
        clearInterval(setInterva)
    },
    onUnload(){
        clearInterval(setInterva)
    },
    onShow() {
        this.getOrderInfo()
    },
    //倒计时
    countDown:function(){
        var that = this;
        var nowTime = new Date().getTime();//现在时间（时间戳）
        var endTime =  this.data.orderInfo.second * 1000
        var time = (endTime-nowTime)/1000;//距离结束的毫秒数
        // 获取天、时、分、秒
        let day = parseInt(time / (60 * 60 * 24));
        let hou = parseInt(time % (60 * 60 * 24) / 3600);
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        day = that.timeFormin(day),
        hou = that.timeFormin(hou),
        min = that.timeFormin(min),
        sec = that.timeFormin(sec)
        that.setData({
          day: that.timeFormat(day),
          hou: that.timeFormat(hou),
          min: that.timeFormat(min),
          sec: that.timeFormat(sec)
        })
        console.log(time <= 0)
        // 每1000ms刷新一次
        if (time <= 0) {
            console.log(time)
            clearInterval(setInterva)
            setTimeout(() => {
                this.onLoad(this.data.orderId)
            }, 1500);
        }
        // if (time>0){
        //     setTimeout(this.countDown, 1000);
        // }else{
        //     setTimeout(() => {
        //         this.onLoad(this.data.orderId)
        //     }, 1500);
        // }
    },
      //小于10的格式化函数（2变成02）
    timeFormat(param) {
        return param < 10 ? '0' + param : param;
    },
      //小于0的格式化函数（不会出现负数）
    timeFormin(param) {
        return param < 0 ? 0: param;
    },
    yaoqing(){
		wx.switchTab({
            url: '/pages/making-money/making-money'
        })
    },
    
    checkTime(i){ //将0-9的数字前面加上0，例1变为01 
        if(i<10) 
        { 
        i = "0" + i; 
        } 
        return i; 
    },
    goIndex(){
        wx.switchTab({
            url: '/pages/index/index'
         })
    },
    //取消订单
    endorder(){
        wx.$api.cancelOrder({
            order_id: this.data.orderId,
        }, true).then(res => {
            this.setData({
                showquxiao: true
            })
        })
    },
	closeDialog(){
		this.setData({
			showquxiao: false
		})
	},
    //确认收货
    confirmOrder(){
        wx.$api.getShip({
            order_id: this.data.orderId
        }, true).then(res => {
            wx.showToast({
                title: '已确认收货',
                icon:"none"
            })
            wx.navigateTo({
                url: '/pages/mine/my-order/my-order'
            })
        })
    },
    //获取订单信息
    getOrderInfo() {
        wx.$api.getOrderInfo({
            order_id: this.data.orderId
        }, true).then(res => {
            this.setData({
                orderInfo: res,
                user: res.user.slice(0,6),
                chaperson: 15 - res.user.length
            })
            if (this.data.orderInfo.group_status == 1) {
                setInterva = setInterval(() => {
                    this.countDown()
                },1000)
                // setInterva = setInterval(this.countDown(), 1000);
            }
        })
    },
    // 复制
    copy(e){
        wx.setClipboardData({
            data: e.currentTarget.dataset.id,
        });
    },
    //分享
	share() {
		this.setData({
			shareShow: true
		})
    },
    onShareAppMessage() {
        return {
			title: '快来参团',
			imageUrl: this.data.orderInfo.goods_img,
			path: '/pages/order/group-booking/group-booking?from=friend&id=' + this.data.orderId + '&group_id=' + this.data.orderInfo.group_id + '&from_id=' + wx.getStorageSync('userId'),
        }
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
    pay() {
        wx.$api.confirm_payment({
            order_id: this.data.orderId
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
	},
})