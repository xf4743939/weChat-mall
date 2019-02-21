//index.js
//获取应用实例
const app = getApp();
const utils = require("../../utils/util.js");
const ajax = require("../../utils/request.js");
const api = require("../../utils/constant.js");

Page({
  data: {
    shop: null,
    memberId: wx.getStorageSync('memberId') || "",
    contentList: [], //展示的数据
    hasMoreData: true, //是否还有数据
  },
  currentPage: 1,
  pageSize: 0,
  pageId: 0,
  couponId: 0,
  allData: [], //总数据

  onLoad: function () {
    this.initData();
  },
  onShow() {

  },
  initData() {
    this.pageId = wx.getStorageSync("pageId") || 0;
    this.getPageIndexNew();
    this.getShopList();
  },
  // 获取店家店铺集合
  getShopList() {
    let that = this;
    ajax.request(api.getShopList, {
      userId: app.globalData.busId,
      longitude: wx.getStorageSync('longitude'),
      latitude: wx.getStorageSync('latitude'),
    }).then(res => {
      if (!utils.showMsg(res)) return;
      if (res.data && res.data.length == 0) return;
      let shopId = wx.getStorageSync('shopId') || "";
      let currentShop = res.data.find(x => x.id == shopId);
      that.setData({
        shop: currentShop
      })
    }).catch(err => {
      utils.showErrMsg(err)
    })
  },
  //获取商城首页全部数据
  getPageIndexNew() {
    const that = this;
    ajax.request(api.pageIndexNew, {
      pageId: that.pageId,
      memberId: wx.getStorageSync('memberId') || ""
    }).then(res => {
      if (!utils.showMsg(res)) return;
      debugger
      let data = res.data;
      if (!data.dataJson || !data.dataJson.length) return;
      if (!data.picJson || !data.picJson.length) return;
      //商品对应的样式
      //商品信息
      JSON.parse(data.picJson).forEach((item, i) => {
        JSON.parse(data.dataJson).forEach((data, j) => {
          if (i = j && item.hasOwnProperty("type")) {
            let newData = {
              pCss: data,
              type: item.type,
              pData: item
            }
            that.allData.push(newData)
          }
        })
      });
      that.pageSize = Math.ceil(that.allData.length / 10); //计算总页数
      that.getShowProducts();
    }).catch(err => {
      utils.showErrMsg(err)
    })
  },
  //获取首页显示的数据
  getShowProducts() {
    debugger
    const that = this;
    let page = that.currentPage;
    let lists = []
    for (let i = (page - 1) * 10; i < (page * 10); i++) {
      let item = that.allData[i];
      if (item) {
        lists.push(item)
      }
    }
    //当前页和总页数做对比
    if (page < that.pageSize) {
      this.setData({
        contentList: [...that.data.contentList, ...lists],
        hasMoreData: true,
      })
      that.currentPage++;
    } else {
      this.setData({
        contentList: [...that.data.contentList, ...lists],
        hasMoreData: false
      })
    }
  },
  /* 
   * 页面相关处理函数--监听用户下拉动作
   */
  onPullDownRefreash: function () {
    this.currentPage = 1;
    this.getPageIndexNew();
  },
  /* 
   *页面上拉触底事件处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getShowProducts();
    }
  }


})