// pages/mine/my-reward/my-reward.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showNameInput: false,
        data: '',
        list: [],
		page: 1,
		pageCount: 1,
        noMore:false 
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getListData()
    },
    loadMore() {
		if (this.data.page < this.data.pageCount) {
			let page = this.data.page
			page ++
			this.setData({
				page: page
			})
			this.getListData()
		}
	},
    getListData(){
        return new Promise((resolve, reject) => {
			let list = this.data.list
            wx.$api.myBounty({limit: 10, page: this.data.page}, true).then(res => {
                console.log(res.list.data)
                list = list.concat(res.list.data)
                if (res.list.last_page == this.data.page || !res.list.last_page) {
                    this.setData({
                        noMore: true
                    })
                }
                this.setData({
                    data: res,
                    pageCount: res.list.last_page,
                    list: list
                })
				resolve(res)
            })
		})
    },
	onOpenNameDialog() {
		this.setData({
			showNameInput: true,
		})
    },
    oncloseNameDialog() {
        this.setData({
			showNameInput: false,
		})
    },
    onUserNameInput(ev) {
		this.setData({ userNameCache: ev.detail.value })
	},
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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