// pages/oneyuan/oneyuan/oneyuan.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        infor: '',
        animate: false,
        rollArr: [],
        adShow: false,
        shadeShow: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
		!wx.getStorageSync('userId') && this.setData({
            adShow: true,
            shadeShow: true
		})
    },
   
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
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
							console.log(response)
							wx.setStorageSync("userId", response.user_id)
							that.setData({
                                adShow: false,
                                shadeShow: false
							})
							that.onShow()
						})
					}
				}
			})
		}
	},
	//打开授权弹窗
	adShowFn(){
		this.setData({
			adShow: true
		})
	},
	//关闭没授权的弹窗
	closeAd() {
		this.setData({
			adShow: false
		})
	},
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        wx.$api.Lootgoods().then(res => {
			this.setData({
				infor: res
			})
        }).catch(res => {})
        wx.$api.roll().then(res => {
            console.log(res)
			this.setData({
				rollArr: res
			})
        }).catch(res => {})
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})