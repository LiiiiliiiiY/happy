// pages/mine/question/question.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        list:[],
        show1: false,
        show2: false,
        show3: false,
        show4: false,
        show5: false,
        show6: false,
        show7: false,
        show8: false,
        show9: false,
        show10: false,
        show11: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.$api.faq({}, true).then(res => {
          // var list_ = res.map
          this.setData({
            list: res.map(item => {
              return Object.assign(item,{
                show: false
              })
            })
          })
       })
    },
    showFn(e){
      var list_ = this.data.list
      if (list_[e.currentTarget.dataset.id].show) {
        list_[e.currentTarget.dataset.id].show = false
      } else {
        list_[e.currentTarget.dataset.id].show = true
      }
      this.setData({
        list: list_
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