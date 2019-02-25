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
    hasCarList: false, //购物车是否有数据
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

      if (!res.data.shopCartList || !res.data.shopCartList.length) {
        this.setData({
          hasCarList: false
        })
        return;
      }
      let currentShop, goodNums, total = 0;
      let carList = res.data.shopCartList[0];
      goodNums = res.data.shopCartNum
      if (carList && carList.shopResultList.length) {
        currentShop = carList.shopResultList.find(x => x.shopId == shopId);
        that.data.productList = currentShop.productResultList;
        that.data.productList.forEach(item => {
          item.productImageUrl = app.globalData.baseImgUrl + item.productImageUrl;
          item.isTouchMove = false; //默认全部隐藏
          item.isSelect = true;
          total += item.productNum * item.productPrice
        });
      }
      // let currentCars=carList
      that.setData({
        productList: that.data.productList,
        hasCarList: true,
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
  touchStart(e) {

    this.data.productList.forEach(item => {
      //只操作作为true的
      // if (item.isTouchMove) {
      //   item.isTouchMove = false
      // }
      this.startX = e.changedTouches[0].clientX;
      this.startY = e.changedTouches[0].clientY;
      this.setData({
        productList: this.data.productList
      })
    })
  },
  //滑动事件处理
  touchmove(e) {

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

    that.data.productList.forEach(function (v, i) {
      if (startX > touchMoveX) {
        v.isTouchMove = false
      }
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else { //左滑
          v.isTouchMove = true
        }
      }
    })
    //更新数据
    that.setData({
      productList: that.data.productList
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
    /* 
     *  角度=弧度*180/Math.PI
     *  弧度=角度*Math.PI/180
     */
    //返回角度 /Math.atan()返回数字的反正切值
    //Math.PI 圆周长和直径的比 (π)
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  delItem(e) {
    const that = this;
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    this.data.productList.splice(index, 1);
    let clickItem = this.data.productList.find(x => x.id == id);
    let params = {
      ids: clickItem.id
    }
    if (clickItem && clickItem.pifaSpecificaList.length) {
      let pifaSpecificaList = [];
      clickItem.pifaSpecificaList.map(item => {
        pifaSpecificaList.push({
          id: item.id,
          productId: item.productId,
          specificaValueIds: item.specificaValueIds,
          productNum: item.productNum
        })
      })
      params.pifaSpecificaList = JSON.stringify(pifaSpecificaList)
    }
    wx.showModal({
      title: "提示",
      content: "是否删除改商品?",
      success: (respon) => {
        if (respon.confirm) {
          ajax.request(api.removeShopCart, params, 'POST').then(res => {
            if (!utils.showMsg(res)) return;
            that.getShopCart();
          }).catch(err => {
            utils.showErrMsg(err);
          })
        }
      }
    })

  },
  /* 编辑 */
  editNum() {
    this.data.isEdit = !this.data.isEdit;
    this.setData({
      isEdit: this.data.isEdit
    })
  },
  /* 单个商品选中 */
  selected(e) {
    const id = e.currentTarget.dataset.id; //获取每一个点击的购物车ID

    let carts = this.data.productList,
      clickItem = carts.find(x => x.id == id),
      isSelect = clickItem.isSelect;
    clickItem.isSelect = !isSelect;
    let checkall = carts.every(x => x.isSelect);
    this.setData({
      productList: carts,
      selectAllStatus: checkall,
      totalPrice: this.getTotalPrice(carts),
      allNum: this.getAllNum(carts)
    })
  },
  //计算总价格
  getTotalPrice(cars) {

    let total = 0;
    cars.forEach(item => {
      if (item.isSelect) {
        total += item.productNum * item.productPrice
      }
    })
    return total || 0;
  },
  //计算总数量
  getAllNum(cars) {
    let allNums = 0;
    cars.forEach(item => {
      if (item.isSelect) {
        allNums += item.productNum
      }
    })
    return allNums || 0;
  },
  //全选
  checkedAll() {
    let carts = this.data.productList;
    let checkall = carts.every(x => x.isSelect);
    carts.forEach(item => {
      item.isSelect = !checkall
    })
    this.setData({
      productList: carts,
      selectAllStatus: !checkall,
      totalPrice: this.getTotalPrice(carts),
      allNum: this.getAllNum(carts)
    })
  },
  // 数量减少
  reduce(e) {
    const id = e.currentTarget.dataset.id;
    let clickItem = this.data.productList.find(x => x.id == id);
    if (clickItem.productNum <= 1) {
      utils.showTipMsg("数量不能小于1");
      return;
    }
    clickItem.productNum--;
    this.setData({
      productList: this.data.productList,
      totalPrice: this.getTotalPrice(this.data.productList),
      allNum: this.getAllNum(this.data.productList)
    })
  },
  add(e) {
    const id = e.currentTarget.dataset.id;
    let clickItem = this.data.productList.find(x => x.id == id);
    if (clickItem.productNum >= clickItem.stockNum) {
      utils.showTipMsg("数量不能小于1");
      return;
    }
    clickItem.productNum++;
    this.setData({
      productList: this.data.productList,
      totalPrice: this.getTotalPrice(this.data.productList),
      allNum: this.getAllNum(this.data.productList)
    })
  },
  //编辑数量框
  setNum(e) {
    const id = e.currentTarget.dataset.id;
    let clickItem = this.data.productList.find(x => x.id == id);
    let num = e.detail.value;
    if (num < 1) {
      utils.showTipMsg("商品的数量不能小于1")
      clickItem.productNum = 1
    } else if (clickItem.productNum > clickItem.stockNum) {
      utils.showTipMsg("商品数量不能大于库存数量");
      clickItem.productNum = 1;
    } else {
      clickItem.productImageUrl = num;
    }
    this.setData({
      productList: this.data.productList,
      totalPrice: this.getTotalPrice(this.data.productList),
      allNum: this.getAllNum(this.data.productList)
    })
  },
  /*
   * 去结算 
   */
  toPay() {
    debugger
    let that = this,
      carList = this.data.productList,
      ids = [],
      params = [];
    if (this.data.allNum < 1) {
      utils.showTipMsg("你还没有勾选商品");
      return;
    }
    carList.forEach(item => {
      if (item.isSelect) {
        ids.push(item.id);
        params.push({
          id: item.id,
          productNum: item.productNum
        })
      }
    })
    ajax.request(api.shopCartOrder, {
      str: JSON.stringify(params)
    }, 'POST').then(res => {
      if (!utils.showMsg(res)) return;
      wx.navigateTo({
        url: `/pages/orderDetails/orderDetails?carIds=${ids}`,
      })
    }).catch(err => {
      utils.showErrMsg(err)
    })

  }

})