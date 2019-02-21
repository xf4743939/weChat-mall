// pages/index/components/header.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shop: Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    change() {
      wx.navigateTo({
        url: '/pages/shop_list/shop_list',
      })
    }
  }
})