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
		backFlag: true,
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
		let pages = getCurrentPages()
		if (pages.length == 1) {
			this.setData({
				backFlag: false
			})
		}
    },
	goHome() {
		wx.switchTab({
			url: '/pages/index/index'
		})
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
        this.onShow()
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
			title: '快来一起拼团，抢全网最低……',
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
        wx.$api.wcPay({
            order_id: this.data.orderId
        }).then(data => {
            wx.requestPayment({
                timeStamp: data.timeStamp,
                nonceStr: data.nonceStr,
                package: data.package,
                signType: data.signType,
                paySign: data.paySign,
                success: (response) => {
                    wx.reLaunch({
                        url: '/pages/mine/my-order-detail/my-order-detail?id=' + this.data.orderId
                    })
                },
                fail: (response) => {
                    wx.reLaunch({
                        url: '/pages/mine/my-order-detail/my-order-detail?id=' + this.data.orderId
                    })
                }
            })
        })
	},
})