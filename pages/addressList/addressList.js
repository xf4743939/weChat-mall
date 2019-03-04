const app = getApp();
const utils = require("../../utils/util.js");
const ajax = require("../../utils/request.js");
const api = require("../../utils/constant.js");


Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    id: '',
    state: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  defaultFun: function (data) {

    ajax.request(api.defaultCity, {
        id: data.currentTarget.dataset.item._id
      }, 'POST')
      .then(res => {

        app.globalData.userInfo.address = res.data
        this.setData({
          id: res.data._id
        })
        if (this.data.state == 1) {
          wx.navigateBack({
            delta: 1
          })
        }
      })
  },
  onLoad: function (options) {
    // this.setData({
    //   id: app.globalData.userInfo.address._id,
    //   state: options ? options.type : null
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    ajax.request(api.cityList, {
        openid: wx.getStorageSync('openid')
      })
      .then(res => {
        this.setData({
          list: res.data
        })
      }).catch(err => {
        utils.showErrMsg(err);
      })
  },

})