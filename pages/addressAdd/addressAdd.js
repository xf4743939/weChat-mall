const app = getApp();
const utils = require("../../utils/util.js");
const ajax = require("../../utils/request.js");
const api = require("../../utils/constant.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['广东省', '深圳市', '南山区'],
    customItem: '全部',
    name: '',
    mobile: '',
    detailed: '',
    isAddress: true, //是否增加地址
    _id: null
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log(e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

  bindKeyName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindKeyMobile: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  bindKeyDetailed: function (e) {
    this.setData({
      detailed: e.detail.value
    })
  },
  submitFun: function () {
    const myreg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    let mobile = this.data.mobile;
    if (!this.data.name) {
      utils.showTipMsg("姓名不能为空")
      return;
    }

    if (!mobile) {
      utils.showTipMsg("请输入手机号码")
      return;
    }
    if (!myreg.test(mobile)) {
      utils.showTipMsg("手机号码有误")
      return
    }
    if (!this.data. ) {
      utils.showTipMsg("请输入门牌号")
      return;
    }
    if (this.data.isAddress) { //添加
      ajax.request(api.addCity, {
          name: this.data.name,
          mobile: this.data.mobile,
          detailed: this.data.detailed,
          city: this.data.region
        }, 'POST')
        .then(res => {
          if (res.code == 200) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
        .catch(err => {
          utils.showErrMsg(err)
        })
    } else {
      ajax.request(api.editCity, {
          name: this.data.name,
          mobile: this.data.mobile,
          detailed: this.data.detailed,
          city: this.data.region,
          id: this.data._id
        }, 'POST')
        .then(res => {
          if (res.code == 200) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
        .catch(err => {
          utils.showErrMsg(err)
        })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        region: options.city.split(','),
        name: options.name,
        mobile: options.mobile,
        detailed: options.detailed,
        _id: options.id,
        addressIs: false
      })
    }
  },

})