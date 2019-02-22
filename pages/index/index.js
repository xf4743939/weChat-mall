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
    let shopId = wx.getStorageSync('shopId') || 0;
    // 判断店铺有没有变化

    if (this.data.shop && this.data.shop.id != shopId) {
      this.data.contentList = [];
      this.data.hasMoreData = true; //是否还有数据
      this.initData()
    }
  },
  initData() {
    this.pageId = wx.getStorageSync("pageId") || 0;
    if (this.pageId == 0) {
      utils.wx.showToast({
        title: '只显示自定义首页,请切换店铺',
        icon: 'none'
      })
      return
    }
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
    let alldata = [];
    ajax.request(api.pageIndexNew, {
      pageId: that.pageId,
      memberId: wx.getStorageSync('memberId') || ""
    }).then(res => {
      if (!utils.showMsg(res)) return;
      let data = res.data;
      if (!data.picJson || !data.picJson.length) return;
      //商品对应的样式
      //商品信息
      JSON.parse(data.picJson).forEach((item, i) => {
        if (!item) return;
        if (item && !item.hasOwnProperty("type")) return;
        let newData = {
          type: item.type,
          pData: item
        }
        alldata.push(newData)
      });
      JSON.parse(data.dataJson).forEach((item, i) => {
        alldata[i].pCss = item
      });

      that.allData = alldata;
      that.pageSize = Math.ceil(that.allData.length / 10); //计算总页数
      that.getShowProducts();
    }).catch(err => {
      utils.showErrMsg(err)
    })
  },
  //获取首页分页加载的数据
  getShowProducts() {

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
    console.log(this.data.contentList, "lists")
    console.log(this.currentPage, 'page')
    console.log(this.data.hasMoreData, 'has')
  },
  /* 
   * 页面相关处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

    this.currentPage = 1;
    this.allData = [];
    this.data.contentList = [];
    
    this.getPageIndexNew();
    wx.stopPullDownRefresh();
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