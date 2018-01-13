<template>
  <div class="detail">
    <HeadCart :HeadTitle='productInfo.name' back='true'/>
    <div class="main">
      <!-- 商品区域 -->
      <div class="block">
        <div class="block-img" ref="pro">
          <img v-lazy="productInfo.imgs">
        </div>
        <div class="block-price">
          <p>{{productInfo.name}}</p>
          <p>￥{{productInfo.price}}</p>
        </div>
      </div>
      <!-- 商品详情 -->
      <div class="block-detail">
        <div>商品详情</div>
        <p>品&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;牌<span>{{productInfo.brand}}</span></p>
        <p>产品规格<span>{{productInfo.store_nums}}</span></p>
      </div>
      <!-- 爱鲜蜂图片区域 -->
      <div class="axf-img">
        <img src="./images/axf.jpg" alt="">
      </div>
      <!-- 底部 -->
      <div class="footer">
        <div class="collect">
          <span class="collect-span" @click="favorProduct(productInfo)" :class="{'active':false}">收藏</span>
          <div class="collect-add">
            添加商品：
            <div class="btn-wrap">
              <span @click="subProduct()">-</span>
              <span>{{productInfo.num}}</span>
              <span @click="addProduct()">+</span>
            </div>
          </div>
        </div>
        <div class="append">
          <div ref="nihao" class="append-img"></div>
          <span>{{productInfo.num}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import HeadCart from '../../components/Head/HeadCart'
import http from 'axios'
import api from '@/api'
export default {
  activated(){
    //获取传递过来是商品ID
    let productId = this.$route.params.id
    let categories = this.categories
    if(this.users.id>0){
      //有用户就获取用户对应的商品
      for(let i = 0 ; i < categories.length ; i++ ){
        let products = categories[i].product
        for(let j = 0 ; j < products.length ; j++){
          if(products[j].id == productId){
            this. productInfo  = products[j]
          }
        }
      }
    }else{
      //没有用户就获取数据库里对应到数据
       http.get(api.host + '/products/' + productId)
        .then(res =>{
          this. productInfo = res.data
        })
    }
  },
  components:{
    HeadCart
  },
  data(){
    return {
      productInfo:'',
    }
  },
 computed: {
    users () {
      return this.$store.state.users
    },
    //拿到商品数据
    categories(){
      return this.$store.state.categories
    },
    coordinate(){
      return this.$store.state.coordinate
    }
  },
  methods:{
    //收藏商品
    favorProduct(productInfo){
      //geigei
    },
     //添加商品
    addProduct(){
      let productInfo =  this.productInfo
      productInfo.product_id = productInfo.id
      this.$store.dispatch("addProduct",productInfo)
        .then(res =>{
           //走动画
            //获取图片的位置(refs返回的数组)
           let pos = this.$refs.pro.getBoundingClientRect()
          //获取购物车图标位置
          let coordinate = this.$refs.nihao.getBoundingClientRect()
          let obj = {
            src : productInfo.imgs,
            width : pos.width,
            height : pos.height,
            start:{
              left:pos.left,
              top:pos.top
            },
            end:{
              left:coordinate.left,
              top:coordinate.top
            }
          }
          //调用插件
          this.$toast(obj)
          productInfo.num++
           //保持本地数据与原始数据一致（因为每次改变是只是后台数据，页面渲染的是原始商品数据）
          this.$store.commit("RESET_CARTS",productInfo)
          // this.$msg("提示","添加数量成功")
      })
    },
    //减少商品
    subProduct(){
      let productInfo =  this.productInfo
      if(productInfo.num >0){
      //因为数据重置的时候是用商品的id来判断，所以需要追加一个product_id 
      productInfo.product_id = productInfo.id
        // 如果subCart内部是删除的操作的话，product也会删除掉，所以需要克隆一下以备份,
        //第二是因为不能直接修改product的num,product是vuex的state。修改需要走mutations.
      let cloneProduct = Object.assign({}, productInfo)
      this.$store.dispatch("subCart",productInfo)
      .then(res =>{
        cloneProduct.num--
        //保持本地数据与原始数据一致
        this.$store.commit("RESET_CARTS",cloneProduct)
        this.$msg("提示",res.msg)
      })
      }
    },
  }
}
</script>

<style lang="less" scoped>
@import url('../../styles/var.less');
.detail{
  width: 100%;
}
.main{
  .block-img{
    padding: 1rem;
    background-color: white;
  }
  .block-price{
    color:#333;
    background-color: white;
    p:nth-child(1){
      font-size: 2.3rem;
      font-weight: 500;
    }
    p:nth-child(2){
      font-size: 1.8rem;
      color:#f40;
      font-weight: bold;
      padding: 1rem 0 3rem 0;
    }
  }
  .block-detail{
    padding: 1.5rem;
    margin: .5rem 0;
    background-color: white;
    font-size: 1.4rem;
    div{
      margin-bottom: 1.5rem;
      color:#e0bd6a;
      background: url('./images/title_bg.png') center center no-repeat;
      background-size: auto .2rem;
    }
    p{
      color:#848c99;
      text-align: left;
      line-height: 3rem;
      span{
        color:#333;
        padding-left: 1.5rem;
      }
    }
  }
  .axf-img{
    width: 100%;
    img{
      width: 100%;
    }
  }
  .footer{
    height: 5rem;
    line-height: 5rem;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color:white;
    font-size: 1.4rem;
    border-top: 1px solid #e0e0e0;
    z-index: 100;
  }
}
.collect-span{
  position: absolute;
  left: .8rem;
  padding-top: 1rem;
  font-size: 1.2rem;
  background: url('./images/collect.png') .4rem 1rem no-repeat;
  background-size: 1.8rem auto;
}
.collect-span.active{
  background: url('./images/collectActive.png') .4rem 1rem no-repeat;
  background-size: 1.8rem auto;
}
.collect-add{
  text-align: left;
  margin-left: 5rem;
}
.btn-wrap{
  position: absolute;
  left: 13rem;
  bottom: 0rem;
  width: 9rem;
  height:5rem;
  line-height: 5rem;
  span:nth-child(2n+1){
    display: inline-block;
    width: 2.5rem;
    height: 2.5rem;
    line-height: 2.5rem;
    text-align: center;
    border: 1px solid #f40;
    color: #f40;
    border-radius: 50%;
    font-size: 2.4rem;
  }
  span:nth-child(2){
    display: inline-block;
    width: 2rem;
    height: 3rem;
    line-height: 2.5rem;
    text-align: center;
  }
}
.append{
  position: absolute;
  top: -2rem;
  right: 1.5rem;
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  border:.1rem solid #e0e0e0;
  text-align: center;
  z-index: 1;
  .append-img{
    width: 5.4rem;
    height: 5.4rem;
    background:@color-background url('./images/cart.png') center center no-repeat;
    background-size: 80%;
    border-radius: 50%;
    margin: 0;
    border: .3rem solid #f7f7f7;
  }
  span{
    position: absolute;
    top: 0;
    right: 0;
    width: 1.8rem;
    height: 1.8rem;
    line-height: 1.8rem;
    font-size: 1rem;
    background-color: #ff4400;
    border-radius: 50%;
    color:white;
  }
 }
</style>

