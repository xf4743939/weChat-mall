const app = getApp();
const utils = require("../../utils/util.js");
const ajax = require("../../utils/request.js");
const api = require("../../utils/constant.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: [], //购物车商品
    currentShop: null,
    allNum: 0, //全部选中的数量
    selectAllStatus: true, //默认全选
    totalPrice: 0, //总价格
    isEdit: false, //是否编辑状态
    delBtnWidth: 90,
    baseImgUrl: app.globalData.baseImgUrl, //图片的地址
  },
  startX: 0, // 开始位置
  startY: 0,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.baseImgUrl, 'ddd');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    this.getShopCart();
  },
  // 获取购物车数据
  getShopCart() {
    const that = this;
    const shopId = wx.getStorageSync('shopId') || 0;
    ajax.request(api.getShopCart, {
      memberId: 1361756, //1361756
      shopId: 921, //921
      busId: 4856, //4856
    }).then(res => {
      if (!utils.showMsg(res)) return;

      if (!res.data.shopCartList || !res.data.shopCartList.length) return;
      let currentShop, goodNums, total = 0;
      let carList = res.data.shopCartList[0];
      goodNums = res.data.shopCartNum
      if (carList && carList.shopResultList.length) {
        currentShop = carList.shopResultList.find(x => x.shopId == shopId);
        that.data.productList = currentShop.productResultList;
        that.data.productList.forEach(item => {
          item.productImageUrl = app.globalData.baseImgUrl + item.productImageUrl;
          item.isTouchMove = false; //默认全部隐藏
          total += item.productNum * item.productPrice
        });
      }
      // let currentCars=carList
      that.setData({
        productList: that.data.productList,
        selectAllStatus: true,
        allNum: goodNums,
        goodsNum: goodNums,
        totalPrice: total,
        currentShop: currentShop,

      })

    }).catch(err => {
      utils.showErrMsg(err)
    })
  },
  //去店铺
  linkShop() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //手指触摸动作开始，记录起点x坐标
  touchstart: function (e) {
    this.data.productList.forEach(item => {
      //只操作作为true的
      if (item.isTouchMove) {
        item.isTouchMove = false
      }
      this.startX = e.changedTouches[0].clientX;
      this.startY = e.changedTouches[0].clientY;
      this.setData({
        productList: this.data.productList
      })
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    let that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.startX, //开始X坐标
      startY = that.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });
    that.data.items.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      items: that.data.items
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    this.data.productList.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      items: this.data.items
    })
  }

})