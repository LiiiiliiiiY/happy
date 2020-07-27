const app = getApp()
Page({
	data: {
		fromShare: false,
		fromId: '',
		adShow: false,
		orderId: '',
		orderInfo: null,
		time: '',
		memberPreview: [],
		status: 0,
		invited: false,
		backFlag: true
	},
	onLoad(options) {
		this.setData({
			orderId: options.id
		})
		if (options.from == 'friend') {
			if (options.from_id && (options.from_id != wx.getStorageSync('userId'))) {
				this.setData({
					fromShare: true,
					fromId: options.from_id
				})
			} 
		}
		this.getData()
		let pages = getCurrentPages()
		if (pages.length == 1) {
			this.setData({
				backFlag: false
			})
		}
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
	oneKey() {
		if (!wx.getStorageSync('userId')) {
			this.setData({
				adShow: true
			})
			return
		}
		if (this.data.orderInfo.user.some((item) => item.id == wx.getStorageSync('userId'))) {
			wx.showToast({
			    title: '您已经在团中',
			    icon: 'none',
			    duration: 2000,
				complete: () => {
					setTimeout(() => {
						wx.switchTab({
							url: '/pages/index/index'
						})
					}, 2000)
				}
			})
			return
		}
		wx.$api.groupBooking({
			user_id: this.data.fromShare ? this.data.fromId : wx.getStorageSync('userId'),
		    order_id: this.data.orderId
		}, true).then(res => {
			if (res.group_status == 1) {
				wx.navigateTo({
					url: '/pages/order/confirm-order/confirm-order?type=' + this.data.orderInfo.group_type + '&goods_id=' + this.data.orderInfo.goods_id + '&invite_group_id=' + this.data.orderInfo.group_id 
				})
			} else if (res.group_status == 2) {
				wx.navigateTo({
					url: '/pages/order/share-failed/share-failed?id=' + this.data.orderId + '&status=1&fromId=' + this.data.fromId
				})
			} else if (res.group_status == 3) {
				wx.navigateTo({
					url: '/pages/order/share-failed/share-failed?id=' + this.data.orderId + '&status=0&fromId=' + this.data.fromId
				})
			}
		})
	},
	bindGetUserInfo(e) {
		if (e.detail.userInfo) {
			app.globalData.userInfo = e.detail.userInfo
			let that = this
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
						})
					}
				}
			})
		}
	},
	closeAd() {
		this.setData({
			adShow: false
		})
	},
	//倒计时
	Timer() { 
	    if (this.data.orderInfo.second){
	        let lefttime = (this.data.orderInfo.second * 1000 - (new Date()).getTime()) >= 0 ? (this.data.orderInfo.second * 1000 - (new Date()).getTime()) : 0,
	        lefth = this.timeFormat(Math.floor(lefttime / (1000*60*60)%24)),  
	        leftm = this.timeFormat(Math.floor(lefttime / (1000*60)%60)), 
	        lefts = this.timeFormat(Math.floor(lefttime / 1000%60));
	        this.setData({
	            time: lefth + ":" + leftm + ":" + lefts
	        })
	    }
	},
	timeFormat(param) {
	    return param < 10 ? '0' + param : param;
	},
	getData() {
		wx.$api.groupBooking({
			user_id: this.data.fromShare ? this.data.fromId : wx.getStorageSync('userId'),
		    order_id: this.data.orderId
		}, true).then(res => {
			if (res.group_status == 2) {
				if (this.data.fromShare) {
					wx.reLaunch({
						url: '/pages/order/share-failed/share-failed?id=' + this.data.orderId + '&status=1&fromId=' + this.data.fromId
					})
				} else {
					wx.reLaunch({
						url: '/pages/mine/my-order-detail/my-order-detail?id=' + this.data.orderId
					})
				}
			} else if (res.group_status == 3) {
				if (this.data.fromShare) {
					wx.reLaunch({
						url: '/pages/order/share-failed/share-failed?id=' + this.data.orderId + '&status=0&fromId=' + this.data.fromId
					})
				} else {
					wx.reLaunch({
						url: '/pages/mine/my-order-detail/my-order-detail?id=' + this.data.orderId
					})
				}
			}
			let member = []
			for (let i = 0; i < 5; i++) {
				member.push(res.user[i] ? res.user[i] : {})
			}
		    this.setData({
		        orderInfo: res,
				memberPreview: member
		    })
			
			setInterval(() => {
			    this.Timer()
			}, 1000)
		})
	},
	onShareAppMessage() {
		return {
			title: '快来参团',
			imageUrl: this.data.orderInfo.goods_img,
			path: '/pages/order/group-booking/group-booking?from=friend&id=' + this.data.orderId + '&group_id=' + this.data.orderInfo.group_id + '&from_id=' + wx.getStorageSync('userId'),
		}
	}
})
