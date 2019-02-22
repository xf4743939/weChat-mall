// pages/shop_list/shop_list.js
const app = getApp();
const ajax = require("../../utils/request.js");
const api = require("../../utils/constant.js");
const utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList: [], // 店铺集合
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let latitude,
      longitude,
      that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        latitude = res.latitude
        longitude = res.longitude
      },
      fail: function () {
        latitude = -1;
        longitude = -1;
      },
      complete: function () {
        wx.setStorageSync('latitude', latitude);
        wx.setStorageSync('longitude', longitude);
        that.getShopList(longitude, latitude)
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 获取店家店铺集合
  getShopList(longitude, latitude) {
    let that = this;
    ajax.request(api.getShopList, {
      userId: app.globalData.busId,
      longitude: longitude,
      latitude: latitude
    }).then(res => {
      if (!utils.showMsg(res)) return;
      if (res.data && res.data.length == 0) return;
      that.setData({
        shopList: res.data
      })
    }).catch(err => {
      utils.showErrMsg(err)
    })
  },
  link(e) {
    let shopId = e.currentTarget.dataset.id;
    if (parseInt(shopId)) {
      wx.setStorageSync('shopId', shopId)
    }
    ajax.request(api.getHomePageId, {
      busId: app.globalData.busId,
      shopId: shopId
    }).then(res => {
      if (!utils.showMsg(res)) return;
      // 缓存页面id
      wx.setStorageSync('pageId', res.data);
      utils.clearActivityStatus();
      wx.switchTab({
        url: '/pages/index/index',
      })
    }).catch(err => {
      utils.showErrMsg(err)
    })

  }

})