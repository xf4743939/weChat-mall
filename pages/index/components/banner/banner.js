// pages/index/components/banner.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bannerData: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动轮播
    interval: 5000, //轮播切换时间
    duration: 500, //轮播滑动动画时长
    imgs: []
  },
  attached() {
    let pics = this.properties.bannerData.pCss.pic; //轮播图片集合
    if (pics && pics.length) {
      let imgs = pics.filter(x => x.src);
      this.setData({
        imgs: imgs
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    enterSearch() {
      wx.navigateTo({
        url: '/pages/search/search',
      })
    }
  }
})