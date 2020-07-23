// pages/mine/rewardToyue/rewardToyue.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        price: 0,
        data: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    usernameInput: function (e) {
        console.log(e.detail.value)
        this.setData({
            price: e.detail.value
        })
    },
    all: function(){
        this.setData({
            price: this.data.data.bounty_can_out
        })
    },
    toreward: function(){
        console.log(this.data.price)
        if (this.data.price == 0) {
            wx.showToast({
                title: '请输入金额',
                icon: "none"
            })
            return
        }
        wx.$api.toBalance({
            balance: this.data.price
        }, true).then(res => {
            wx.showToast({
                title: '转出成功',
                icon:"none"
            })
            setTimeout(() => {
                wx.switchTab({
                    url: '/pages/mine/mine/mine'
                })
            },2000)
        }).catch(data => {
            wx.showToast({
                title: data.msg,
                icon: 'none',
                duration: 2000
            })
        })
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
        wx.$api.myBounty({limit: 10, page: this.data.page}, true).then(res => {
            this.setData({
                data: res
            })
        })

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