export default{
    //存储分类信息
    categories:[{cids:[],product:[]}],
    //存储所有商品
    products:[],
    //用户信息
    users:{
        selectSite:{}
    },
    //购物车信息
    carts:[],
    //控制tabBar的显示隐藏
    tabBarShow : true,
    //城市列表
    citys:[],
    //选择的城市
    selectCity:'',
    //选择的地区
    selectSite:'',
    //选择的地区坐标
    cityX:'',
    cityY:'',
    //用户的地址信息
    sites:[],
    //存储购物车图标的位置（动画的终点位置）
    location:[],
    coordinate:[],
    //用户的收藏列表
    favorList:[]
}