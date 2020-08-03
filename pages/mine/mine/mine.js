const app = getApp()

Page({
	data: {
		infor: null,
		orderList: [],
		adShow:false,
		canIUse: wx.canIUse('button.open-type.getPhoneNumber')
	},
	onShow() {
		wx.$api.mine().then(res => {
			this.setData({
				infor: res
			})
		}).catch(res => {})
		wx.$api.recommendList().then(res => {
			console.log(res)
			this.setData({
				recommendList: res
			})
		}).catch(res => {})
		wx.$api.orders({limit: 2, page: 1}).then(res => {
			this.setData({
				orderList: res.data
			})
		}).catch(res => {})
		!wx.getStorageSync('userId') && this.setData({
			adShow: true
		})
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
        })
	},
	pintuan(e){
		app.globalData.orderData = e.currentTarget.dataset.item
	},
	//获取用户信息
	bindGetUserInfo(e) {
		let pages = getCurrentPages()
		let currPage = null
		if (pages.length) {
		  currPage = pages[pages.length - 1]
		}
		app.globalData.tempRoute = currPage.route
		var that = this
		if (e.detail.userInfo) {
			app.globalData.userInfo = e.detail.userInfo
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
							that.onShow()
						})
					}
				}
			})
		}
	},
	//跳转微信设置页面
	setpage(e) {
		wx.openSetting({
			success (res) {
			  console.log(res.authSetting)
			}
		})
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
	//关闭没授权的弹窗
	closeAd() {
		this.setData({
			adShow: false
		})
	},
	buy(e) {
		wx.navigateTo({
			url: '/pages/order/confirm-order/confirm-order?type=' + e.currentTarget.dataset.type + '&goods_id=' + e.currentTarget.dataset.item.goods_id
		})
	},
	//打开授权弹窗
	adShowFn(){
		this.setData({
			adShow: true
		})
	},
	//支付
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
	},
	//邀请好友
	yaoqing(){
		wx.switchTab({
            url: '/pages/making-money/making-money'
        })
	},
	getPhoneNumber(e) {
		if (e.detail.encryptedData) {
			wx.login({
				success (res) {
					if(res.code) {
						wx.$api.getOpenId({
							code: res.code
						}).then(response => {
							wx.$api.quickLogin({
								session_key: response.session_key,
								encryptedData: e.detail.encryptedData,
								iv: e.detail.iv,
								real_openid: response.real_openid,
								nickName: app.globalData.userInfo.nickName,
								avatarUrl: app.globalData.userInfo.avatarUrl,
								gender: app.globalData.userInfo.gender
							}).then(data => {
								wx.setStorageSync("userId", response.openid)
								// wx.setStorageSync("ruufooChecked", 1)
								wx.reLaunch({
									url: '/' + app.globalData.tempRoute,
									success: () => {
										app.globalData.tempRoute = null
									}
								})
							}).catch((res) => {
								// wx.setStorageSync("ruufooChecked", 0)
							})
						})
					}
				}
			})
		}
	}
})
