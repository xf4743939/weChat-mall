const app = getApp();
const utils = require("../../utils/util.js");
const ajax = require("../../utils/request.js");
const api = require("../../utils/constant.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: "", //搜索的关键字
    hotKeyword: [], //搜索推荐 热门搜索
    historyKeyword: [], //历史搜索
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  //取消事件
  closeSearch: function () {
    utils.clearActivityStatus();
    wx.navigateBack()
  },



})