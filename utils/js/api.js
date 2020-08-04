import { request, uploadFile } from 'http.js'

function mergeParam(data) {
	return Object.assign(data || {}, {
		user_id: wx.getStorageSync('userId')
	})
}

const api = {
	// 首页
	homePage(data) {
		return request('/api/Index/index', data, true)
	},
	// 分类页
	classify(data) {
		return request('/api/Index/goods_classify', data, true)
	},
	// 商品列表
	goodsList(data) {
		return request('/api/Index/goods_list', data, true)
	},
	// 商品详情
	goodsDetail(data) {
		return request('/api/Goods/goods_desc', data, true)
	},
	getOpenId(data) {
		return request('/api/wechat/loginIn', data, true)
	},
	getHot(data) {
		return request('/api/index/hot_goods', data, true)
	},
	// 提交订单
	submitOrder(data) {
		return request('/api/Grouporder/submitOrder', mergeParam(data), true, true)
	},
	// 微信支付
	wcPay(data) {
		return request('/api/newpay/confirm_payment', mergeParam(data), true, true)
	},
	// 个人中心首页
	mine(data) {
		return request('/api/home/index', mergeParam(data))
	},
	// 获取地址列表
	getAddressList(data, showError) {
		return request('/api/Address/AddressList', mergeParam(data), true, showError)
	},
	//默认地址
	flagAddress(data, showError) {
		return request('/api/Address/setflag', mergeParam(data), true, showError)
	},
	//新增地址
	addAddress(data, showError) {
		return request('/api/Address/add', mergeParam(data), true, showError)
	},
	// 编辑地址
	updateAddress(data, showError) {
		return request('/api/Address/update', mergeParam(data), true, showError)
	},
	// 删除地址
	delAddress(data, showError) {
		return request('/api/Address/remove', mergeParam(data), true, showError)
	},
	// 获取订单详情
	getOrderInfo(data, showError) {
		return request('/api/order/detail', mergeParam(data), true, showError)
	},
	//问题
	faq(data, showError) {
		return request('/api/Index/faq', mergeParam(data), true, showError)
	},
	//我的余额
	myBalance(data, showError) {
		return request('/api/home/myBalance', mergeParam(data), true, showError)
	},
	//我的奖励金
	myBounty(data, showError) {
		return request('/api/home/myBounty', mergeParam(data), true, showError)
	},
	//我的好友
	myfriends(data, showError) {
		return request('/api/home/myfriends', mergeParam(data), true, showError)
	},
	//我的订单
	orders(data, showError) {
		return request('/api/home/orders', mergeParam(data), true, showError)
	},
	// 推荐商品列表
	recommendList(data) {
		return request('/api/Index/goods_list', mergeParam(data), true)
	},
	//取消订单
	cancelOrder(data) {
		return request('/api/home/cancelOrder', mergeParam(data), true)
	},
	//奖励金转余额
	toBalance(data) {
		return request('/api/home/toBalance', mergeParam(data), true)
	},
	//提现
	paytoBalance(data) {
		return request('/api/newpay/toBalance', mergeParam(data), true)
	},
	//提现
	getShip(data) {
		return request('/api/home/getShip', mergeParam(data), true)
	},
	//物流查询
	trackOrder(data) {
		return request('/api/home/trackOrder', mergeParam(data), true)
	},
	// 拼团中
	groupBooking(data, showError) {
		return request('/api/order/detail', data, true, showError)
	},
	// 获取二维码
	getErcode(data) {
		return request('/api/wechat/getErcode', mergeParam(data))
	},
	//一元夺宝
	Lootgoods(data, showError) {
		return request('/api/Lootgoods/index', mergeParam(data), true, showError)
	},
	//滚动消息
	roll(data, showError) {
		return request('/api/Lootgoods/roll_message', mergeParam(data), true, showError)
	},
	//夺宝详情页
	LootDetail(data, showError) {
		return request('/api/Lootgoods/goods_desc', mergeParam(data), true, showError)
	},
	//添加夺宝
	add_order(data, showError) {
		return request('/api/Lootgoods/add_order', mergeParam(data), true, showError)
	},
	//我的夺宝列表
	my_loot(data, showError) {
		return request('/api/Lootgoods/my_loot', mergeParam(data), true, showError)
	}
}

export default api