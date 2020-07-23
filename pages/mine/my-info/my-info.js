// pages/mine/my-info.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: {
			avatarUrl: '',
			mobile: '',
			name: '',
			gender: '',
			birthday: '',
			region: '',
			city: ''
		},
		sexyList: [
			{name: '男', value: 1},
			{name: '女', value: 2}
		],
		showNameInput: false,
		nameInputBtnList: [{text: '取消'}, {text: '确定'}],
		userNameCache: '',
		userSexyName: ''
	},
	getUserInfo() {
		wx.$api.getUserInfo().then(res => {
			let _sexyname = this.data.sexyList.filter(item => {
				return item.value == res.member.gender
			});
			let _region = `${res.member.province}/${res.member.city}/${res.member.area}`
			this.setData({
				'userInfo.avatarUrl': res.member.avatarUrl,
				'userInfo.mobile': res.member.mobile,
				'userInfo.name': res.member.realname,
				'userInfo.gender': res.member.gender,
				userSexyName: _sexyname.length ? _sexyname[0].name : '',
				'userInfo.birthday': res.member.birthday.length ? res.member.birthday : '',
				'userInfo.region': _region.length == 2 ? '' : _region
			})
		})
	},
	editUserInfo(param) {
		wx.$api.editUserInfo(param).then(res => {
			wx.showToast({title: "编辑成功"})
		})
	},
	// onChangeUserImg() {
	// 	wx.chooseImage({
	// 		count: 1,
	// 		sizeType: 'compressed',
	// 		success: (res) => {
	// 			this.setData({
	// 				'userInfo.avatarUrl': res.tempFilePaths[0]
	// 			})
	// 			this.editUserInfo({
	// 				type: 1,
	// 				avatarUrl: res.tempFilePaths[0]
	// 			})
	// 		}
	// 	})
	// },
	// 打开填写姓名弹窗
	onOpenNameDialog() {
		this.setData({
			showNameInput: true,
			userNameCache: this.data.userInfo.name
		})
	},
	onUserNameInput(ev) {
		this.setData({ userNameCache: ev.detail.value })
	},
	onCloseNameDialog() {
		this.setData({
			showNameInput: false
		})
	},
	onNameInputBtnClick(ev) {
		if(ev.detail.index === 0) {
			this.onCloseNameDialog()
		}else{
			this.setData({
				"userInfo.name": this.data.userNameCache,
				showNameInput: false
			})
			this.editUserInfo({
				type: 2,
				realname: this.data.userNameCache
			})
		}
	},
	// 性别选择
	onSexyChange(ev) {
		this.setData({
			'userInfo.gender': this.data.sexyList[ev.detail.value].value,
			userSexyName: this.data.sexyList[ev.detail.value].name
		})
		this.editUserInfo({
			type: 3,
			gender: this.data.sexyList[ev.detail.value].value
		})
	},
	// 生日选择
	onBirthdayChange(ev) {
		this.setData({
			"userInfo.birthday": ev.detail.value
		})
		let _birth = ev.detail.value.split('-')
		this.editUserInfo({
			type: 4,
			birthyear: _birth[0],
			birthmonth: _birth[1],
			birthday: _birth[2]
		})
	},
  	// 地区选择
	onRegionChange(ev) {
		this.setData({
			"userInfo.region": ev.detail.value.join('/')
		})
		this.editUserInfo({
			type: 5,
			province: ev.detail.value[0],
			city: ev.detail.value[1],
			area: ev.detail.value[2]
		})
	},
	onShow() {
		this.getUserInfo()
	}
})