Page({
    data: {
        // create 新建地址 edit 编辑地址
        type: 'create',
        // 是否从订单确认进入
        orderFlag: false,
        // addressId
        id: "",
        addressInfo: {
            user_name: '',
            phone: '',
            region: '',
            desc: '',
            is_flag: 1
        },
        rules: [{
            name: 'user_name',
            rules: {required: true, message: '请输入收货人姓名'},
        }, {
            name: 'phone',
            rules: {required: true, message: '请输入收货人手机号'},
        }, {
            name: 'region',
            rules: {required: true, message: '请选择地区'},
        }, {
            name: 'desc',
            rules: {required: true, message: '请输入详细地址'}
        }]
    },
    onNameInput(ev) { 
        this.setData({
            "addressInfo.user_name": ev.detail.value
        })
    },
    onTelInput(ev) { 
        this.setData({
            "addressInfo.phone": ev.detail.value
        })
    },
    // 修改地区
    onRegionChange(ev) {
        this.setData({
            "addressInfo.region": ev.detail.value.join('/')
        })
    },
    onPlaceInput(ev) { 
        this.setData({
            "addressInfo.desc": ev.detail.value
        })
    },
    onSwitchChange(ev) {
        this.setData({
            "addressInfo.is_flag": ev.detail.value ? 1 : 0
        })
    },
    onGetUserAddress() {
        var _that = this;
        wx.chooseAddress({
            success (res) {
                var _map = {
                    userName: "user_name",
                    telNumber: "phone",
                    detailInfo: "desc"
                }
                _that.setData(Object.keys(_map).reduce((total, item) => {
                    total[`addressInfo.${_map[item]}`] = res[item]
                    return total
                }, {"addressInfo.region": `${res.provinceName}/${res.cityName}/${res.countyName}`}))
            }
        })
    },
    onSubmitAddress() {
        this.selectComponent('#add-form').validate((valid, errors) => {
            if(valid){
                var _area = this.data.addressInfo.region.split('/');
                var apistring
                this.data.type == 'create' ? apistring = wx.$api.addAddress : apistring = wx.$api.updateAddress;
                apistring(Object.assign(this.data.type === 'create' ? {} : {
                    address_id: this.data.id
                }, {
                    user_name: this.data.addressInfo.user_name,
                    phone: this.data.addressInfo.phone,
                    province: _area[0],
                    city: _area[1],
                    area: _area[2],
                    desc: this.data.addressInfo.desc,
                    is_flag: this.data.addressInfo.is_flag
                }), true).then(res => {
                    console.log(res)
                    wx.showToast({
                        title: `${this.data.type === 'create' ? '创建' : '编辑'}成功`
                    })
                    if (this.data.orderFlag) {
                        const eventChannel = this.getOpenerEventChannel()
                        let addressList = {
                            user_name:this.data.addressInfo.user_name,
                            phone:this.data.addressInfo.phone,
                            province:this.data.addressInfo.region.split('/')[0],
                            city:this.data.addressInfo.region.split('/')[1],
                            area:this.data.addressInfo.region.split('/')[2],
                            desc:this.data.addressInfo.desc,
                            address_id:res.address_id
                        }
                        console.log(addressList)
                        eventChannel.emit('acceptDataFromOpenedPage', {data: addressList})
                    }
                    wx.navigateBack()
                })
            }else{
                wx.showToast({
                    title: errors[0].message,
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    onDeleteAddress() {
        wx.$api.delAddress({id: this.data.id}, true).then(res => {
            wx.showToast({title: "删除成功"})
            wx.navigateBack()
        })
    },	
    // 向确认订单页传参
    // changeOrderAddress(e) {
	// 	if (this.data.orderFlag) {
    //         const eventChannel = this.getOpenerEventChannel()
    //         let addressList = {
    //             user_name:this.addressInfo.user_name,
    //             phone:this.addressInfo.phone,
    //             province:this.data.addressInfo.region.split('/')[0],
    //             city:this.data.addressInfo.region.split('/')[1],
    //             area:this.data.addressInfo.region.split('/')[2],
    //             desc:this.addressInfo.desc
    //         }
    //         console.log(addressList)
	// 		eventChannel.emit('acceptDataFromOpenedPage', {data: addressList})
	// 		wx.navigateBack()
	// 	}
	// },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if(options.type === 'edit'){
            var info = JSON.parse(options.id)
            this.setData({
                type: options.type,
                addressInfo: info,
                id: info.address_id,
                "addressInfo.region": `${info.province}/${info.city}/${info.area}`
            });
        }
        console.log(options)
        if (options.fromOrder) {
            this.setData({
                orderFlag: true
            })
        }
    }
})