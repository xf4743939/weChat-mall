const app = getApp();

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

/** 
 * 清楚全局 保存的活动类型 
 **/
function clearActivityStatus() {
  app.globalData.type = 0;
  app.globalData.activityId = 0;
  app.globalData.keyword = "";
}

module.exports = {
  formatTime: formatTime,
  showErrMsg: showErrMsg,
  showMsg: showMsg,
  clearActivityStatus: clearActivityStatus
}