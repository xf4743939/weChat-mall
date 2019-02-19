const http = 'https://nbmall.deeptel.com.cn';

const baseImgUrl = 'http://maint.deeptel.com.cn/upload/';

//查询店铺列表
const getShopList = http + `/pageApplet/79B4DE7C/getShopList`;
// 获取店铺首页的id
const getHomePageId = http + `/pageApplet/79B4DE7C/getHomePageId`



module.exports = {
    getShopList,
    getHomePageId
}