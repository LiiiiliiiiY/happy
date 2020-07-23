const app = getApp()

Page({
    data: {
		tabs: [],
		activeTab: 0,
		list: [],
		page: 1,
		pageCount: 1,
		noMore: false,
		adShow: false
    },
    onLoad(options) {
		this.getClassify()
    },
	checkDetail(e) {
		wx.navigateTo({
			url: '/pages/goods/goods-detail/goods-detail?id=' + e.currentTarget.dataset.id
		})
	},
	// 获取分类
	getClassify() {
		wx.$api.classify().then(res => {
			this.setData({
				tabs: res.map((item) => {
					return {data: [], ...item}
				})
			})
			this.getListData(0)
		})
	},
	// 获取列表
	getListData(index) {
		wx.$api.goodsList({
			classify_id: this.data.tabs[index].classify_id
		}).then(data => {
			this.setData({
				[`tabs[${index}].data`]: data
			})
		})
	},
	onTabClick(e) {
		if (this.data.tabs[e.detail.index].data.length) return
		this.getListData(e.detail.index)
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
	buy(e) {
		if (!wx.getStorageSync('userId')) {
			this.setData({
				adShow: true
			})
			return
		}
		wx.navigateTo({
			url: '/pages/order/confirm-order/confirm-order?type=' + e.currentTarget.dataset.type + '&goods_id=' + e.currentTarget.dataset.item.goods_id
		})
	}
})