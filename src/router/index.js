import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

//引入页面(懒加载)
const Home = () => import('../pages/Home/Home')
const Cart = () => import('../pages/Cart/Cart')
const Market = () => import('../pages/Market/Market')
const My = () => import('../pages/My/My')
const Longin = () => import ('../pages/Longin/Longin')
const Detail = () => import ('../pages/Detail/Detail')
const Site = () => import ('../pages/Site/Site')
const AddSite = () => import ('../pages/AddSite/AddSite')
const AmendSite = () => import ('../pages/AmendSite/AmendSite')
const SelectSite = () => import ('../pages/SelectSite/SelectSite')
const Favor = () => import ('../pages/Favor/Favor')


export default new Router({
    routes:[
        {
            path:'/',
            component:Home
        },
        {
            path:'/cart',
            component:Cart
        },
        {
            path:'/market',
            component:Market,
            meta: {
                // 设置页面不缓存
                notKeepAlive: false
            }
        },
        {
            path:'/my',
            component:My
        },
        {
            path:'/longin',
            component:Longin
        },
        {
            path:'/detail/:id',
            component:Detail,
            meta:{
                //不缓存
                notKeepAlive:false
            }
        },
        {
            path:'/site',
            component:Site,
            meta:{
                //缓存
                notKeepAlive:true
            }
        },
        {
            path:'/add_site',
            component:AddSite
        },
        {
            path:'/amend_site/:id',
            component:AmendSite,
            meta: {
                // 设置页面不缓存
                notKeepAlive: false
            }
        },
        {
            path:'/select_site',
            component:SelectSite,
            meta: {
                // 设置页面不缓存
                notKeepAlive: false
              }
        },
        {
            path:'/favor',
            component:Favor,
        }
    ]
})
