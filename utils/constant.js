// const http = 'https://mall.deeptel.com.cn'; //测试环境

const http = `https://nbmall.deeptel.com.cn`; //堡垒环境
const http2 = `https://wx.yogalt.com/api/`; //github(https://github.com/FZliweiliang/wechat-app-mall/blob/master/app.js)

//授权登录
const auth = http + `/pageApplet/79B4DE7C/appletAuth`;
//查询店铺列表
const getShopList = http + `/pageApplet/79B4DE7C/getShopList`;
// 获取店铺首页的id
const getHomePageId = http + `/pageApplet/79B4DE7C/getHomePageId`;
//获取自定义首页的数据
const pageIndexNew = http + `/mallApplet/79B4DE7C/pageIndexNew`;
//查询历史搜索和热门搜索接口
const searchLabel = http + `/mallProductApplet/79B4DE7C/searchLabel`;
// 查询购物车
const getShopCart = http + `/shopCartApplet/79B4DE7C/getShopCart`;
//删除购物车商品
const removeShopCart = http + `/shopCartApplet/79B4DE7C/removeShopCart`;
//购物车去结算
const shopCartOrder = http + `/shopCartApplet/79B4DE7C/shopCartOrder`;
//获取短信验证码
const getValCode = http + `/memberBuyApplet/79B4DE7C/getValCode`;
//绑定手机号
const bindPhone = http + `/memberBuyApplet/79B4DE7C/bindPhone`;
// 获取所有国家区号列表
const areaPhoneList = http + `/memberBuyApplet/79B4DE7C/areaPhoneList`;
// 获取默认城市地址
const defaultCity = http2 + `v1/user/defaultCity`;
// 获取城市列表
const cityList = http2 + `v1/user/cityList`;
// 增加城市
const addCity = http2 + `v1/user/addCity`;
//编辑城市
const editCity = http2 + `v1/user/editCity`;

module.exports = {
    auth,
    getShopList,
    getHomePageId,
    pageIndexNew,
    searchLabel,
    getShopCart,
    removeShopCart,
    shopCartOrder,
    getValCode,
    bindPhone,
    areaPhoneList,
    defaultCity,
    cityList,
    addCity,
    editCity
}