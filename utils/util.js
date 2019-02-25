const app = getApp();
const api = require("./constant.js");


const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


/**  
 * @param error 接口报错
 **/
function showErrMsg(error) {
  let message = error.msg || error.message;
  if (message) {
    wx.showToast({
      title: message,
      icon: 'none'
    })
    return
  }
}

/**  
 * @param res 接口的res
 **/
function showMsg(res) {
  if (res.code != 0) {
    wx.showToast({
      title: res.data.msg,
      icon: "none"
    })
    return false
  }
  return true
}

function showTipMsg(title, icon = "none", callback) {
  wx.showToast({
    title: title,
    icon: icon,
    success: function () {
      typeof callback == "function" && callback()
    }
  })
  return false
}



/** 
 * 清楚全局 保存的活动类型 
 **/
function clearActivityStatus() {
  app.globalData.type = 0;
  app.globalData.activityId = 0;
  app.globalData.keyword = "";
}

/**
 *
 * @param code {string} wx.longin 回传的用户code
 * @param callback {function} 登录成功以后回调函数
 * @param result {object} 用户授权后的用户信息
 */
function requestInfo(code, callback, result) {


  const url = api.auth;
  // console.log(result)
  wx.request({
    url,
    data: {
      busId: app.globalData.busId,
      jsCode: code,
      appId: app.globalData.appid,
      rawData: result.rawData,
      industryCode: app.globalData.style
    },
    success(res2) {

      // console.log(res2)
      if (res2.data.code === 0) { //开发时关闭注释
        const data = res2.data.data
        if (!data) {
          return
        }
        //登录成功
        wx.setStorageSync('phone', data.member && data.member.phone || ''); //开发时关闭注释
        wx.setStorageSync('memberId', data.member && data.member.id); //开发时关闭注释 
        wx.setStorageSync('appid', app.globalData.appid);

        if (callback) callback(res2)
      } else {
        wx.showModal({
          title: '提示',
          content: '授权失败!',
          showCancel: false,
        })
      }
    },
    fail(err) {
      console.log(err)
      wx.showModal({
        title: '提示',
        content: '授权失败!',
        showCancel: false,
      })
    }
  })
}

/**
 * @param callback {function} 获取用户信息回调 获取用户
 * @param result {object}  用户授权的用户信息
 */
function login(callback, result) {

  if (wx.getStorageSync('memberId') && callback) {
    callback()
  } else {

    wx.login({ //login流程
      success: function (res) { //登录成功
        // console.log(res)
        if (res.code) {

          var code = res.code;

          if (result) {
            requestInfo(code, callback, result.detail)
          } else {
            wx.getSetting({
              success(res2) {
                // console.log(res2)
                // console.log(res2.authSetting['scope.userInfo'])
                if (res2.authSetting['scope.userInfo']) {
                  wx.getUserInfo({
                    success(res3) {
                      // console.log(res3)
                      requestInfo(code, callback, res3)
                    },
                    fail(err) {
                      wx.showModal({
                        title: '提示',
                        content: '获取用户信息失败！',
                        showCancel: false
                      })
                    }
                  })
                }
              }
            })
          }
        }
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '登录失败！',
          showCancel: false,
        })
      }
    });
  }
}


module.exports = {
  formatTime: formatTime,
  showErrMsg: showErrMsg,
  showMsg: showMsg,
  clearActivityStatus: clearActivityStatus,
  login,
  showTipMsg
}