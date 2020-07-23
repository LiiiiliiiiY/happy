Component({
    options: {
        multipleSlots: true,
        addGlobalClass: true
    },
    properties: {
        title: {
            type: String,
            value: ''
        },
		icon: {
			type: String,
			value: ''
		},
		iconSize: {
			type: String,
			value: '48'
		},
		iconType: {
			type: String,
			value: 'close'
		},
        showBtn: {
            type: Boolean,
            value: true
        },
        btnText: {
            type: String,
            value: '确定'
        },
		btnType: {
			type: String,
			value: 'close'
		},
        maskClosable: {
            type: Boolean,
            value: true
        },
        mask: {
            type: Boolean,
            value: true
        },
        show: {
            type: Boolean,
            value: false
        }
    },
    methods: {
		iconTap(e) {
			let type = e.currentTarget.dataset.type
			if (type == 'close') {
			    this.setData({
			       show: false
			    })
			    this.triggerEvent('close')
			} else {
			    this.triggerEvent('iconAction')
			}
		},
        buttonTap(e) {
		    let type = e.currentTarget.dataset.type
		    if (type == 'close') {
		        this.setData({
		           show: false
		        })
		        this.triggerEvent('close')
		    } else {
			    this.triggerEvent('actionTap')
		    }
        },
		closeSheet() {
			this.setData({
			    show: false
			})
		},
		preventM() {}
    }
})