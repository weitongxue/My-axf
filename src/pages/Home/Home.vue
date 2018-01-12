<template>
  <div class="main">
      <HeadPage/>
      <div class="banner">
        <mt-swipe :auto="4000">
          <mt-swipe-item v-for="(item,index) in banner" :key="item.id">
            <img :src="item.bannar_img">
          </mt-swipe-item>
        </mt-swipe>
      </div>
      <!-- 展示的商品 -->
      <div class="commodity-wrap" v-if="index < 4" v-for="(item,index) in productData" :key="item.id">
          <!-- 分类名称 -->
          <div class="commodity-name">
            <span :style="{color: item.color, 'border-color': item.color}">{{item.name}}</span>
            <span>更多&nbsp;&nbsp;&gt;</span>
          </div>
          <!-- 分类的图片 -->
          <div class="commodity-img">
            <img v-lazy="item.img">
          </div>
          <!-- 显示商品       -->
          <ul class="commodity">
            <router-link tag="li" :to="'/detail/' + x.id" v-if="(index <3)" v-for="(x,index) in item.product" :key="x.id">
              <div class="shop-img">
                <img v-lazy="x.img" :ref="'pro' + x.id">
              </div>
              <div class="shop-title">
                <h1>{{x.name}}</h1>
              </div>
              <div class="shop-data">
                <span>
                  <p>{{x.store_nums}}g</p>
                  <p>￥{{x.price}}</p>
                </span>
                <span @click.stop="addProduct(x)">+</span>
              </div>
            </router-link>
          </ul>
      </div>
  </div>
</template>

<script>
//引入头部组件
import HeadPage from '../../components/Head/HeadPage'
import api from '@/api'
export default {
  created(){
    this.$http.get(api.host + "/banner")
    .then(res => {
      this.banner = res.data
    })
  },
  data(){
    return{
      banner:[],
    }
  },
  components:{
    HeadPage
  },
  computed:{
    productData(){
      return this.$store.state.categories
    },
    users(){
      return this.$store.state.users
    }
  },
  methods:{
    //添加商品
    addProduct(item){
      //判断是否登录
      if(this.users.id){
        this.$store.dispatch("addProduct",item)
        .then(res =>{
           //动画
          //获取图片的位置(refs返回的数组)
          let pos = this.$refs['pro' + item.id][0].getBoundingClientRect()
          //获取购物车图标位置
          let location = this.$store.state.location
          let obj = {
            src : item.img,
            width : pos.width,
            height : pos.height,
            start:{
              left:pos.left,
              top:pos.top
            },
            end:{
              left:location.left,
              top:location.top
            }
          }
          //调用插件
          this.$toast(obj)
          // this.$msg("提示",res.msg)
          item.num++
        })
      }else{
        this.$msg("提示","未登录，请先登录")
        .then(action => {
          this.$router.push("/longin")
        })  
      }
    },
  }
}
</script>

<style lang="less" scoped>
  img[lazy=loading] {
    background:url("./images/loading.gif") center center no-repeat;
    background-size: 2rem;
  }
  .banner{
    width: 100%;
    height: 120px;
    img{
      width: 100%;
    }
  }
  .commodity-wrap{
      width: 100%;
      background-color: white;
       margin-bottom: 2rem;
    .commodity-img{
      width: 95%;
      margin: 0 auto;
      img{
        width: 100%;
        border-radius: 12rem;
      }
    }
    .commodity-name{
      width: 100%;
      height: 4.8rem;
      overflow: hidden;
      span:nth-of-type(1){
        font-weight: 800;
        font-size:1.4rem;
        margin: 1.4rem 1rem;
        float:left;
        border-left: .8rem solid;
        padding-left: 1rem;
      }
      span:nth-of-type(2){
        float:right;
        display: block;
        height: 100%;
        line-height: 4.8rem;
        padding-right: 2rem;
      }
    }
    .commodity{
      width: 100%;
      overflow: hidden;
      li{
        width: 33.333%;
        padding:.5rem .5rem;
        box-sizing: border-box;
        border-right: 1px solid #cccccc;
        float: left;
        &:nth-of-type(3){
          border:none;
        }
        .shop-img{
          img{
            width: 9.4rem;
            height: 9.4rem;
          }
        }
        .shop-title{
          margin-top: .6rem;
          h1{
             margin-top: 1rem;
          }
        }
        .shop-data{
          margin-top: 2rem;
          line-height: 2rem;
          overflow: hidden;
          margin-left: 1rem;
          span:nth-of-type(1){
            float: left;
            p:nth-of-type(2){
              color: red;
            }
          }
          span:nth-of-type(2){
            float: right;
            display: block;
            width: 2rem;
            height: 2rem;
            line-height: 2rem;
            border-radius: 50%;
            border:1px solid #cccccc;
            margin-top: 1rem;
            margin-right: .4rem;
            color:red;
            font-size: 2rem;
          }
        }
      }
    }
  }
</style>
