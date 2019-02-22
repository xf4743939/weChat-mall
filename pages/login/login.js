// pages/login/login.js
const utils = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let memberId = wx.getStorageSync("memberId") || "";
    if (memberId) {
      wx.redirectTo({
        url: '/pages/shop_list/shop_list',
      })
    }
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

  },
  userInfoHandler() {
    const that = this;
    utils.login(() => {
      wx.navigateTo({
        url: '/pages/shop_list/shop_list',
      })
    })
  }

})