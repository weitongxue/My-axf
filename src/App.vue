<template>
  <div id="app">
    <TabBar v-show="tabBarShow"/>
    <keep-alive>
      <!-- 缓存页面 -->
      <router-view v-if="!$route.meta.notKeepAlive"></router-view>
    </keep-alive>
    <!-- 不缓存页面 -->
    <router-view v-if="$route.meta.notKeepAlive"></router-view>
  </div>
</template>

<script>
//引入TabBar 组件
import TabBar from './components/TabBar/TabBar'
import api from './api'
export default {
  created(){
    // this.load.open({
    //   text: '加载中...',
    //   spinnerType: 'fading-circle'
    // })
    let that = this
    async function getData (){
       //获取分类数据
        let result = await that.$http.get(api.host + "/categories")
        // that.$store.commit("GET_CATEGORIES",result.data)
        that.categories = result.data
       //获取所有商品的数据
        let res = await that.$http.get(api.host +"/products")
        // that.$store.commit("GET_PRODUCTS",res.data)
        that.products = res.data

        //获取到对应分类的所有商品
        that.sameProduct()
        //停止加载的效果
        // that.loading.close()
    }
    getData ()
  }, 
  name: 'app',
  components: {
    TabBar
  },
  computed:{
    tabBarShow(){
      return this.$store.state.tabBarShow
    }
  },
  methods:{
    sameProduct () {
      for(let i = 0 ; i < this.categories.length ; i++){
        for(let j = 0 ; j < this.products.length ; j++){
          if(this.categories[i].id === this.products[j].categoriesId){
            this.categories[i].product.push(this.products[j])
          }
        }
      }
      this.$store.commit('SAME_PRODUCT', this.categories)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
