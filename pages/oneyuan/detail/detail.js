var setInterva
Page({

    /**
     * 页面的初始数据
     */
    data: {
        moneyShow: false,
        fen: 1,
        lootId: '',
        infor: '',
        endTime: '',
        dataTime: '',
        day: '',
        hou: '',
        min: '',
        sec: '',
        timeend:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            lootId: options.id ? options.id : options
        })
    },
    onShow() {
        this.getduoInfo()
    },
    //获取夺宝信息
    getduoInfo() {
        wx.$api.LootDetail({
            loot_id: this.data.lootId
        }).then(res => {
			this.setData({
                infor: res
            })
            setInterva = setInterval(() => {
                this.countDown()
            },1000)
		}).catch(res => {})
    },
    onHide(){
        clearInterval(setInterva)
    },
    onUnload(){
        clearInterval(setInterva)
    },
    //倒计时
    countDown:function(){
        var that = this;
        var nowTime = new Date().getTime();//现在时间（时间戳）
        var endTime =  this.data.infor.end_time * 1000
        // var endTime =  1596002350000
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
        // 每1000ms刷新一次
        if (time <= 0) {
            that.setData({
                timeend: true
            })
            wx.showToast({
                title: '夺宝结束啦！',
                icon:"none"
            })
            clearInterval(setInterva)
            setTimeout(() => {
                this.onLoad(this.data.lootId)
            }, 1500);
        }
    },
      //小于10的格式化函数（2变成02）
    timeFormat(param) {
        return param < 10 ? '0' + param : param;
    },
      //小于0的格式化函数（不会出现负数）
    timeFormin(param) {
        return param < 0 ? 0: param;
    },
	openMoneyDialog() {
        console.log(111)
		this.setData({
			moneyShow: true
		})
	},
	closeMoneyDialog() {
        wx.$api.add_order({
            loot_id: this.data.lootId,
            buy_num: this.data.fen
        }).then(res => {
            console.log(res)
            wx.$api.lootPay({
                order_id: res.order_id,
                loot_id: this.data.lootId
            }).then(data => {
                wx.requestPayment({
                    timeStamp: data.timeStamp,
                    nonceStr: data.nonceStr,
                    package: data.package,
                    signType: data.signType,
                    paySign: data.paySign,
                    success: (response) => {
                        wx.reLaunch({
                            url: '/pages/oneyuan/myyiyuan/myyiyuan'
                        })
                    },
                    fail: (response) => {
                        
                    }
                })
            })
		}).catch(res => {
            wx.showToast({
                title: res.msg,
                icon: "none"
            })
        })
    },
    
    feninput(e){
        this.setData({
            fen: e.detail.value
        })
    },

})