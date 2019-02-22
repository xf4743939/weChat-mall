// const http = 'https://mall.deeptel.com.cn'; //测试环境

const http = `https://nbmall.deeptel.com.cn`; //堡垒环境


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
const getShopCart = http + `/shopCartApplet/79B4DE7C/getShopCart`


module.exports = {
    auth,
    getShopList,
    getHomePageId,
    pageIndexNew,
    searchLabel,
    getShopCart
}