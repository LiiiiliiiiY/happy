// pages/mine/withdraw/withdraw.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        price: 0,
        balance: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options.balance)
        this.setData({
            balance: options.balance
        })
    },

    priceInput: function (e) {
        this.setData({
            price: e.detail.value
        })
    },
    toreward: function(){
        console.log(this.data.balance)
        if (this.data.price == 0 || this.data.balance < this.data.price) {
            wx.showToast({
                title: '请输入正确金额',
                icon: "none"
            })
            return
        }
        wx.$api.paytoBalance({
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