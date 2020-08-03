import config from '../../config.js'

function showError(msg) {
    wx.showToast({
        title: msg,
        icon: 'none',
        duration: 5000
    })
}
// wx API 仅提供单文件上传
function uploadSingleFile(url, filePath) {
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url: `${config.requestPath}/${url}`, //仅为示例，非真实的接口地址
            filePath: filePath,
            name: 'img',
            formData: {
                file: 'img'
            },
            success(res) {
                resolve(JSON.parse(res.data).files[0].url)
            },
            fail(err) {
                reject(err)
                showError("网络错误")
            }
        })
    })
}

export function uploadFile(url, filePath) {
    return typeof filePath  === "string" ? uploadSingleFile(url, filePath) : filePath.length ? Promise.all(filePath.map(item => {
        return uploadSingleFile(url, item)
    })) : new Promise((resolve, reject) => { resolve([]) })
}

export function request(url, data, loading, showErr) {
    loading && wx.showLoading({
        title: '加载中',
    })
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${config.requestPath}${url}`,
            method: 'POST',
            data: data,
            header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
            success: (res) => {
                if(res.data.code == 1){
                    resolve(res.data.data)
                }else{
                    reject(Object.assign(res.data, {
                        type: 'request'
                    }))
                    showErr && showError(res.data.msg)
                }
            },
            fail: (err) => {
                reject(Object.assign(err, {
                    type: 'net'
                }))
                showError("网络错误")
            },
            complete: () => {
                wx.hideLoading()
            }
        })
    })
} 
