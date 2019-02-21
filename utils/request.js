/**  
 * @param url (string) 请求地址
 * @param data (object) 请求的数据
 * @param method (string) 默认为 get 方法
 * 
 **/
function request(url, data, method = "GET") {

    return new Promise(function (resolve, reject) {
        const header = {
            'Content-Type': method == 'GET' ? 'application/json' : 'application/x-www-form-urlencoded'
        }
        wx.showLoading({
            title: '加载中'
        })
        wx.request({
            url: url,
            data: data,
            method: method,
            header: header,
            success: function (res) {
                if (res.statusCode == 200) {

                    if (res.data && res.data.code == 0) {
                        resolve(res.data)
                    } else {
                        throwError(res, reject)
                    }
                } else {
                    reject({
                        message: '网络错误，请稍后重试',
                        code: res.statusCode
                    })
                }
            },
            fail: function (err) {
                if (err.errMsg && !err.message) {
                    err.message = err.errMsg
                }
                reject(err)

            },
            complete() {
                wx.hideLoading()
            }
        })
    })

}

function throwError(res, reject) {
    if (res.msg) {
        reject({
            message: res.msg,
            code: res.code
        })
    } else if (res.data && res.data.errorMsg) {
        reject({
            message: res.data.errorMsg,
            code: res.code
        })
    } else {
        reject({
            message: '服务器错误，请稍后重试',
            code: res.code
        })
    }
}

module.exports = {
    request
};