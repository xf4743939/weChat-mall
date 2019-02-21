const http = 'https://mall.deeptel.com.cn';


//查询店铺列表
const getShopList = http + `/pageApplet/79B4DE7C/getShopList`;
// 获取店铺首页的id
const getHomePageId = http + `/pageApplet/79B4DE7C/getHomePageId`
//获取自定义首页的数据
const pageIndexNew = http + `/mallApplet/79B4DE7C/pageIndexNew`

module.exports = {
    getShopList,
    getHomePageId,
    pageIndexNew
}