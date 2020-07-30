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
		return request('/api/Grouporder/submitOrder', mergeParam(data), true)
	},
	// 发送验证码
	sendCode(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=index.send_sms&comefrom=wxapp', data, true)
	},
	// 登录
	login(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=index.login&comefrom=wxapp', data, true)
	},
	// 快捷登录
	quickLogin(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=index.fast_login&comefrom=wxapp', data, true)
	},
	// 搜索页热词
	searchPage(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=index.get_search&comefrom=wxapp', data)
	},
	// 商品筛选项
	filter(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=goods.get_screen&comefrom=wxapp', data)
	},
	// 领取优惠券
	getCoupon(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=goods.receive_coupon&comefrom=wxapp', mergeParam(data), true)
	},
	// 收藏
	collect(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=goods.collection&comefrom=wxapp', mergeParam(data), true)
	},
	// 评论列表
	reviewList(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=goods.get_new_comments&comefrom=wxapp', data, true)
	},
	// 加购
	addToCart(data, showError) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.cart.new_add&comefrom=wxapp', mergeParam(data), true, showError)
	},
	// 购物车列表
	cartInfor(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.cart.get_new_cart&comefrom=wxapp', mergeParam(data), true)
	},
	// 更新购物车
	updateCart(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.cart.new_update&comefrom=wxapp', mergeParam(data))
	},
	// 删除购物车条目
	deleteCart(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.cart.new_remove&comefrom=wxapp', mergeParam(data), true)
	},
	// 个人中心首页
	mine(data) {
		return request('/api/home/index', mergeParam(data))
	},
	// 获取个人信息
	getUserInfo(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.info.new_main&comefrom=wxapp', mergeParam(data), true)
	},
	// 编辑个人信息
	editUserInfo(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.info.new_submit&comefrom=wxapp', mergeParam(data), true)
	},
	// 验光单列表
	rxList(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.index.lens_list&comefrom=wxapp', mergeParam(data), true)
	},
	// 新增验光单
	addRx(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.index.lens_add&comefrom=wxapp', mergeParam(data), true)
	},
	// 更新验光单
	updateRx(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.index.lens_update&comefrom=wxapp', mergeParam(data), true)
	},
	// 删除验光单
	deleteRx(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.index.lens_remove&comefrom=wxapp', mergeParam(data), true)
	},
	// 收藏列表
	myCollection(data, showError) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.favorite.get_new_list&comefrom=wxapp', mergeParam(data), true, showError)
	},
	// 删除收藏
	delCollection(data, showError) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.favorite.new_remove&comefrom=wxapp', mergeParam(data), true, showError)
	},
	// 移入收藏夹
	moveToWishList(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.cart.collection&comefrom=wxapp', mergeParam(data), true)
	},
	// 确认订单页面
	confirmOrder(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=order.create.new_caculate&comefrom=wxapp', mergeParam(data))
	},	
	// 发起支付
	pay(data, showError) {
		return request('/app/ewei_shopv2_api.php?i=1&r=order.pay.transfer&comefrom=wxapp', mergeParam(data), true, showError)
	},
	// 支付成功回调
	paymentSuccessCallback(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=order.pay.new_complete&comefrom=wxapp', mergeParam(data))
	},
	// 获取地址列表
	getAddressList(data, showError) {
		return request('/api/Address/AddressList', mergeParam(data), true, showError)
	},
	// 获取地址信息
	getAddress(data, showError) {
		return request('/app/ewei_shopv2_api.php?i=1&r=member.address.get_detail&comefrom=wxapp', mergeParam(data), true, showError)
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
	// 我的优惠券
	myCoupon(data) {
		return request('/app/ewei_shopv2_api.php?i=1&r=sale.coupon.my.get_new_list&comefrom=wxapp', mergeParam(data, true), true)
	},
	// 获取订单列表
	getOrderList(data, showError) {
		return request('/app/ewei_shopv2_api.php?i=1&r=order.index.get_new_list&comefrom=wxapp', mergeParam(data), true, showError)
	},
	// 获取订单详情
	getOrderInfo(data, showError) {
		return request('/api/order/detail', mergeParam(data), true, showError)
	},
	// 订单状态-确认收货
	orderConfirm(data, showError) {
		return request('/app/ewei_shopv2_api.php?i=1&r=order.op.new_finish&comefrom=wxapp', mergeParam(data), true, showError)
	},
	// 订单状态-取消订单
	orderCancel(data, showError) {
		return request('/app/ewei_shopv2_api.php?i=1&r=order.op.new_cancel&comefrom=wxapp', mergeParam(data), true, showError)
	},
	// 获取物流信息
	getExpressInfo(data, showError) {
		return request('/app/ewei_shopv2_api.php?i=1&r=order.index.new_express&comefrom=wxapp', mergeParam(data), true, showError)
	},
	// 提交评论
	submitReviews(data, showError) {
		return request('/app/ewei_shopv2_api.php?i=1&r=order.comment.new_submit&comefrom=wxapp', mergeParam(data), true, showError)
	},
	// 上传文件
	uploadFile(filePath) {
		return uploadFile('/app/ewei_shopv2_api.php?i=1&r=util.uploader.new_upload&comefrom=wxapp', filePath)
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
		return request('/api/pay/toBalance', mergeParam(data), true)
	},
	//提现
	getShip(data) {
		return request('/api/home/getShip', mergeParam(data), true)
	},
	//物流查询
	trackOrder(data) {
		return request('/api/home/trackOrder', mergeParam(data), true)
	},
	//发起支付
	confirm_payment(data) {
		return request('/api/Pay/confirm_payment', mergeParam(data), true)
	},
	// 拼团中
	groupBooking(data, showError) {
		return request('/api/order/detail', data, true, showError)
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
	},
}

export default api