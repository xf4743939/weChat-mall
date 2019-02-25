const app = getApp();
const utils = require("../../utils/util.js");
const ajax = require("../../utils/request.js");
const api = require("../../utils/constant.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    areaCode: "+86",
    code: "",
    countDown: -1,
    areaId: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAreaPhoneList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //购物车、立即购买。立即预订 绑定手机号类型
  getAreaPhoneList() {
    ajax.request(api.areaPhoneList).then(res => {
      if (!utils.showMsg(res)) return;
      this.setData({
        areaCode: res.data[0].areacode,
        areaId: res.data[0].id,
      })
    }).catch(error => {
      utils.showErrMsg(error)
    })
  },
  //手机号
  bindinputPhone(e) {
    //手机号
    this.data.phone = e.detail.value;
    this.setData({
      phone: this.data.phone
    })
  },
  bindinputCode(e) {
    // 验证码
    this.data.code = e.detail.value;
    this.setData({
      code: this.data.code
    })
  },
  //发送验证码
  bindtapCode() {
    const myreg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    //发送验证码
    // debugger
    let _this = this,
      data,
      url,
      phone = this.data.phone;
    if (!phone) {
      utils.showTipMsg("请输入手机号码")
      return;
    }
    if (!myreg.test(phone)) {
      utils.showTipMsg("手机号码有误")
      return
    }
    if (myreg.test(phone)) {
      countDown(_this, 60);
      _this.setData({
        countDown: 60
      })

      data = {
        busId: app.globalData.busId,
        phoneNo: phone,
        areaCode: _this.data.areaCode
      }
      ajax.request(api.getValCode, data).then(res => {
        console.log("发送手机号成功")
      }).catch(error => {
        utils.showErrMsg(error)
      })


    }
  },
  //保存手机号
  submitFun() {
    let self = this,
      url,
      data,
      phone = self.data.phone,
      code = self.data.code;

    if (!phone) {
      utils.showTipMsg("请输入手机号码")
      return;
    }
    if (!code) {
      utils.showTipMsg("请输入验证码")
      return;
    }

    data = {
      memberId: wx.getStorageSync('memberId'),
      phone: self.data.phone,
      busId: app.globalData.busId,
      code: self.data.code,
      areaId: self.data.areaId,
      areaCode: self.data.areaCode
    }
    ajax.request(api.bindPhone, data, 'POST').then(res => {

      if (!utils.showMsg(res)) return;

      if (res.data && !res.data.result) {
        utils.showTipMsg(res.data.message)
        return;
      }
      self.setData({
        bindPhoneHidden: true,
        countDown: -1
      })
      wx.setStorageSync('memberId', res.data.member.id);
      wx.setStorageSync('phone', phone);
      utils.showTipMsg(res.data.message, 'success')
      wx.navigateTo({
        url: '/pages/shop_list/shop_list',
      })
    }).catch(error => {
      utils.showErrMsg(error)
    })
  }

})


function countDown(self, count) {
  var self = self,
    count = count;
  if (count > 0) {
    setTimeout(function () {
      --count;
      self.setData({
        countDown: count
      })
      countDown(self, count)
    }, 1000)
  }
}