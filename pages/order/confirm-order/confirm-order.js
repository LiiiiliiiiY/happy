const app = getApp()

function add(arg1, arg2) {
	var r1, r2, m;
	try {
		r1 = arg1.toString().split(".")[1].length
	} catch (e) {
		r1 = 0
	}
	try {
		r2 = arg2.toString().split(".")[1].length
	} catch (e) {
		r2 = 0
	}
	m = Math.pow(10, Math.max(r1, r2))
	return (arg1 * m + arg2 * m) / m
}
function accSub(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); 
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

Page({
    data: {
		backFlag: true,
		adShow: false,
		address: null, //地址
		balance: '', //余额
		withBalance: '', //余额抵扣
		deductPrice: '', //抵扣金额
		totalPrice: 0, //总价
		balanceFlag: false,
		detail: null,
		goodsPrice: '',
		moneyShow: false,
		small: true,
		orderType: 1  ,// 1直接购买 2发起拼团 3参团 4四人团,
		groupType: '2',
		groupIndex: 13,
		groupPercent: '93%',
		groupId: '',
		inviteId: '',
		group: [{text: '2人团  最高50%概率可获得3.00元',percent: '50%',id: '2'}, {text: '2-3人团  最高66%概率可获得1.50元',percent: '66%',id: '3'}, {text: '2-4人团  最高75%概率可获得1.00元',percent: '75%',id: '4'}, {text: '2-5人团  最高80%概率可获得0.75元',percent: '80%',id: '5'}, {text: '2-6人团  最高83%概率可获得0.60元',percent: '83%',id: '6'}, {text: '2-7人团  最高85%概率可获得0.50元',percent: '85%',id: '7'}, {text: '2-8人团  最高87%概率可获得0.42元',percent: '87%',id: '8'}, {text: '2-9人团  最高88%概率可获得0.37元',percent: '88%',id: '9'}, {text: '2-10人团  最高90%概率可获得0.33元',percent: '90%',id: '10'}, {text: '2-11人团  最高90.9%概率可获得0.3元',percent: '90.9%',id: '11'}, {text: '2-12人团  最高91%概率可获得0.27元',percent: '91%',id: '12'}, {text: '2-13人团  最高92%概率可获得0.25元',percent: '92%',id: '13'}, {text: '2-14人团  最高92.85%概率可获得0.23元',percent: '92.85%',id: '14'}, {text: '2-15人团  最高93%概率可获得0.21元',percent: '93%',id: '15'}],
    },
	onLoad(options) {
		this.setData({
			orderType: options.type,
			inviteId: options.invite_group_id ? options.invite_group_id : ''
		})
		this.getAddress()
		wx.$api.goodsDetail({
			goods_id: options.goods_id
		}).then(res => {
			this.setData({
				detail: res
			})
			this.getMoney().then(res => {
				this.init(parseInt(options.type))
			})
		})
	},
	smallChange(e) {
		this.setData({
			small: e.detail.value
		})
		this.init(parseInt(this.data.orderType))
	},
	pickerSelect(e) {
		this.setData({
			groupType: this.data.group[e.detail.value].id,
			groupPercent: this.data.group[e.detail.value].percent
		})
	},
	// 获得地址
	getAddress() {
		wx.$api.getAddressList({
			user_id: wx.getStorageSync('userId')
		}).then(res => {
			this.setData({
				address: res.length ? (res.filter((item) => item.is_flag).length ? res.filter((item) => item.is_flag)[0] : res[0]) : null
			})
		})
	},
	// 跳转地址页
	openAddress(e) {
		wx.navigateTo({
			url: e.currentTarget.dataset.type == 'choose' ? '/pages/mine/my-address/my-address?fromOrder=1' : '/pages/mine/my-add-address/my-add-address?fromOrder=1',
			events: {
				acceptDataFromOpenedPage: (data) => {
					if (data.data) {
						this.setData({
							address: data.data
						})
					} else {
						this.getAddress()
					}
				}
			}
		})
	},
	// 导入微信地址
	getWechatAddress() {
		let that = this
	    wx.chooseAddress({
	        success (res) {
				wx.$api.addAddress({
					user_id: wx.getStorageSync('userId'),
	                user_name: res.userName,
	                phone: res.telNumber,
	                province: res.provinceName,
	                city: res.cityName,
	                area: res.countyName,
	                desc: res.detailInfo,
	                is_flag: 1
	            }, true).then(res => {
					that.getAddress()
				})
	        }
	    })
	},
	// 获取余额
	getMoney() {
		return new Promise((resolve, reject) => {
			wx.$api.myBalance({limit: 7, page: 1}, true).then(res => {
				this.setData({
					balance: res.balance ? res.balance : '0.00',
				})
				resolve()
			})
		})
	},
	// 使用余额
	useBalance(e) {
		this.setData({
			balanceFlag: e.currentTarget.dataset.flag,
			deductPrice: e.currentTarget.dataset.flag ? this.data.withBalance : 0
		})
		let total = accSub(parseFloat(this.data.goodsPrice), e.currentTarget.dataset.flag ? this.data.withBalance : 0)
		this.setData({
			totalPrice: parseFloat(total).toFixed(2)
		})
	},
	openMoneyDialog() {
		this.setData({
			moneyShow: true
		})
	},
	closeMoneyDialog() {
		this.setData({
			moneyShow: false
		})
	},
	// 参团
	join() {
		let type
		if (this.data.detail.if_akey == 1) {
			type = 2
			this.setData({
				small: true
			})
		} else {
			type = 4
		}
		this.setData({
			orderType: type
		})
		this.init(type)
	},
	// 初始化
	init(type) {
		let g, p
		switch (type) {
			case 1:
				g = '1',
				p = parseFloat(this.data.detail.direct_price).toFixed(2)
				break;
			case 2:
				g = this.data.small ? '15' : '30',
				p = this.data.small ? parseFloat(this.data.detail.spell_price).toFixed(2) : parseFloat(this.data.detail.akey_price).toFixed(2)
				break;
			case 3:
				g = '30',
				p = parseFloat(this.data.detail.akey_price).toFixed(2)
				break;
			case 4:
				g = '4',
				p = parseFloat(this.data.detail.spell_price).toFixed(2)
				break;
		}
		this.setData({
			groupType: g,
			goodsPrice: p,
			totalPrice: p,
			deductPrice: 0,
			balanceFlag: false,
			withBalance: parseFloat(this.data.balance) >= parseFloat(p) ? parseFloat(p).toFixed(2) : parseFloat(this.data.balance).toFixed(2),
		})
	},
	// 提交订单
	settle() {
		if (!this.data.address) {
			wx.showToast({
				icon: 'none',
				title: '请选择地址'
			})
			return
		}
		wx.$api.submitOrder({
			goods_id: this.data.detail.goods_id,
			goods_name: this.data.detail.goods_name,
			group_type: this.data.orderType,
			rule_number: this.data.groupType,
			goods_price: this.data.goodsPrice,
			freight_price: '',
			deduct_price: this.data.deductPrice,
			payment_price: this.data.goodsPrice,
			address_id: this.data.address.address_id,
			invite_group_id: this.data.inviteId
		}).then(res => {
			wx.$api.wcPay({
				order_id: res.order_id
			}).then(data => {
				if (data && data.timeStamp) {
					wx.requestPayment({
						timeStamp: data.timeStamp,
						nonceStr: data.nonceStr,
						package: data.package,
						signType: data.signType,
						paySign: data.paySign,
						success: (response) => {
							wx.reLaunch({
								url: '/pages/mine/my-order-detail/my-order-detail?id=' + res.order_id
							})
						},
						fail: (response) => {
							wx.reLaunch({
								url: '/pages/mine/my-order-detail/my-order-detail?id=' + res.order_id
							})
						}
					})
				} else {
					wx.reLaunch({
						url: '/pages/mine/my-order-detail/my-order-detail?id=' + res.order_id
					})
				}
			})
		})
	},
	// 返回
	back() {
		if (this.data.backFlag) {
			this.setData({
				adShow: true,
				backFlag: false
			})
		} else {
			wx.navigateBack()
		}
	},
	closeAd() {
		this.setData({
			adShow: false
		})
	},
})