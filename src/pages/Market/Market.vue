<template>
  <div class="market">
      <HeadPage/>
      <div class="main">
        <!-- 分类列表 -->
        <div class="category-list">
          <ul>
            <li @click="changeActive(index)" :class="{active:activeIndex === index}" v-for="(item,index) in productData" :key="item.id">{{item.name}}</li>
          </ul>
        </div>
        <!-- 商品详情 -->
        <div class="product-details">
          <!-- 综合排序 -->
          <div class="product-sort">
            <!-- 大分类 -->
            <ul>
              <li @click="changeBol" :class="{active:activeBol}">{{activeCid}}<span></span></li>
              <li @click="changeCol" :class="{active:activeCol}">{{activeSort}}<span></span></li>
            </ul>
            <!-- 小分类 -->
            <div class="product-kids" v-show="activeBol">
              <span :class="{active:activeCid === '全部分类'}" @click="changeCid('全部分类','all')">全部分类</span>
              <span :class="{active:activeCid === item.name}" @click="changeCid(item.name,index)" v-for="(item,index) in productData[activeIndex].cids" :key="item.id">{{item.name}}</span>
            </div>
            <div class="product-kids" v-show="activeCol">
              <span :class="{active:activeSort === item}" @click="changeActiveSort(item)" v-for="(item,index) in arr" :key="item.id">{{item}}</span>
            </div>
          </div>
          <!-- 对应商品 -->
          <div class="details">
            <ul>
              <router-link tag="li" :to="'/detail/' + item.id" v-for="(item,index) in activeRortProduct" :key="item.id">
                <img v-lazy="item.img" :ref="'pro' + item.id">
                <div>
                  <h5>{{item.name}}</h5>
                  <span>{{item.store_nums}}g</span>
                  <span style="color:red">￥{{item.price}}</span>
                </div>
                <div class="indicator">
                  <span v-show="(item.num > 0)" @click.stop="subProduct(item)">-</span>
                  <span v-show="(item.num > 0)">{{item.num}}</span>
                  <span @click.stop="addProduct(item)">+</span>
                </div>
              </router-link>
            </ul>
          </div>
          <!-- 蒙版 -->
          <div class="masking" v-show="(activeBol || activeCol)">
          </div>
        </div>
      </div>
  </div>
</template>
<script>
import HeadPage from '../../components/Head/HeadPage'
export default {
  data (){
    return{
      //激活的分类 （默认为第一个）
      activeIndex:0,
      //综合排序数组
      arr:["综合排序","价格最高","价格最低"],
      //判断分类按钮的状态
      activeBol : false,
      activeCol : false,
      //激活的子分类（默认的是全部分类）
      activeCid:'全部分类',
      activeSort:'综合排序',
      //激活的子分类的下标(默认all为全部分类)
      activeCidIndex:'all',
    }
  },
  methods:{
    //切换激活的大分类
    changeActive(index){
      this.activeIndex = index;
      this.activeCid = '全部分类'
      this.activeCidIndex ='all'
      this.activeSort = '综合排序'
    },
    //切换按钮的状态并控制显示隐藏
    changeBol(){
      this.activeBol = !this.activeBol
      this.activeCol = false
    },
    changeCol(){
      this.activeBol = false
      this.activeCol = !this.activeCol
    },
    //切换激活的小分类
    changeCid(item,index){
      this.activeCid = item
      this.activeCidIndex = index
      this.activeBol = false
      this.activeCol = false
    },
    changeActiveSort(item){
      this.activeSort = item
      this.activeBol = false
      this.activeCol = false
    },
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
    //减少商品
    subProduct(item){
      //判断是否登录
      if(this.users.id>0){
        if(item.num > 0){
          this.$store.dispatch("subProduct",item)
            .then(res =>{
            this.$msg("提示",res.msg)
            item.num--
          })
        }
      }else{
        this.$msg("提示","未登录，请先登录")
        this.$router.push("/longin")
      }
    }
  },
  components:{
    HeadPage
  },
  computed:{
    //分类商品数据
    productData(){
      return this.$store.state.categories
    },
    //激活分类所对应的商品数据
    activeProductData(){
      return this.productData[this.activeIndex].product
    },
    //激活的小分类对应的商品数据
    activeProduct(){
      if(this.activeCidIndex === 'all'){
        return this.activeProductData
      } else{
        return this.activeProductData.filter(item=>item.cidsId === this.activeCidIndex)
      }
    },
    //激活的排序方式对应的商品数据
    activeRortProduct(){
      if(this.activeSort === '综合排序'){
        return this.activeProduct
      }else if(this.activeSort === '价格最低'){
         return this.activeProduct.slice(0).sort((a,b)=>
            a.price - b.price
        )
      }else if(this.activeSort === '价格最高'){
        return this.activeProduct.slice(0).sort((a,b)=>
            b.price - a.price
        )
      }
    },
    users(){
      return this.$store.state.users
    }
  }
}
</script>

<style lang="less" scoped>
@import url("../../styles/var.less");
  img[lazy=loading] {
    background:url("../Home/images/loading.gif") center center no-repeat;
    background-size: 2rem;
  }
  .main{
    background-color: white;
    color:@color-text-gray;
  }
  .category-list{
    background-color: #F8F8F8;
    position: absolute;
    top:0px;
    bottom: 0;
    left: 0;
    right: 76%;
    overflow-y: scroll;
    ul{ 
      li{
        height: 4rem;
        line-height: 4rem;
        border-bottom: 1px solid #cccccc;
        font-size: 1.2rem;
        position:relative;
      }
      li.active:before{
          content: "";
          display: block;
          position: absolute;
          top:.5rem;
          width: .4rem;
          height: 2.8rem;
          background-color: @color-background;
      }
    }
  }
  .product-details{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 24%;
    right: 0;
    .product-sort{
      ul{
        width: 76%;
        position: fixed;
        top:4.5rem;
        display: flex;
        height: 4rem;
        line-height: 4rem;
        border-bottom: 1px solid #cccccc;
        li{
          font-size: 1.2rem;
          flex: 1; 
          box-sizing: border-box;
          position: relative;
          &:nth-of-type(1){
            &::after{
              position: absolute;
              content: "";
              display: block;
              width: 1px;
              height: 1.3rem;
              background-color:#ccc;
              top:1.3rem;
              right: 0;
            }
          }
          span{
            display: block;
            width: 1rem;
            height: .7rem;
            background: url("./images/icon-down.png") 0 0 no-repeat;
            background-size: 1rem;
            position: absolute;
            top:1.6rem;
            right: 1.9rem;
            transition: all 0.5s;
          }
        }
        li.active span{
          transform: rotate(-180deg)
        }
      }
      .product-kids{
        background-color:white;
        overflow: hidden;
        width: 100%;
        position: absolute;
        top: 4rem;
        text-align: center;
        z-index: 1000;
        span{
          font-size: 1.3rem;
          display: block;
          padding: .5rem 1rem;
          border:1px solid #cccccc;
          float:left;
          margin:.5rem .4rem;
          border-radius: .4rem;
          &.active{
            border-color: yellow;
            background-color: #FFF9D9;
          }
        }
      }
    }
  }
  .details{
      z-index: 10;
      position: absolute;
      top:4.5rem;
      right: 0;
      left:0;
      bottom:0;
      overflow: hidden;
      overflow-y: scroll;
    }
    .details ul li{
      overflow: hidden;
      border-bottom: 1px solid #ccc;
      position: relative;
    }
    .details ul li img{
        float:left;
        width: 10rem;
        padding:.5rem;
    }
    .details ul li div{
        font-size: 1.2rem;
        float:left;
        width:10rem ;
        height: 100%;
        text-align: left;
    }
    .details ul li div h5{
        width: 100%;
        margin:20px 0 30px 0;
        color: black;
    }
    .details ul li div span{
        width: 100%;
        display: inline-block;
        margin-bottom: 5px;
    }
    .details ul li .indicator{
      position: absolute;
      right: 0;
      bottom: 0;
      width: 9rem;
      height: 5rem;
      line-height: 5rem;
      text-align: center;
      span{
        display: inline-block;  
        line-height: 2.5rem;
        width: 2.5rem;
        height: 2.5rem;
        text-align: center;
        margin: 0!important;
      }
      span:nth-child(1){
        position: absolute;
        top:0;
        left: .5rem;
        font-size: 2.3rem;
        color:red;
        border-radius: 50%;
        border:1px solid #ccc;
      }
      span:nth-child(2){
        position: absolute;
        top:0;
        right: 3.5rem;
        line-height: 2.5rem;
        width: 2.5rem;
        height: 2.5rem;
        font-size: 1rem;
        color:#232B33;
      }
      span:nth-child(3){
        position: absolute;
        top:0;
        right: 1rem;
        float: right;
        font-size: 2.3rem;
        color:red;
        border-radius: 50%;
        border:1px solid #ccc;
        
      }
    }
.masking{
  z-index: 999;
  position: absolute;
  top:4rem;
  bottom: 0;
  left: 0;
  right: 0;
  background-color:black;
  opacity: .3;
}
</style>


