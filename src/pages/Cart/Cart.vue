<template>
  <div class="cart">
      <HeadCart HeadTitle='购物车' back='false'/>
      <div class="main">
        <!-- 蒙版 -->
        <div class="notic-wrap" v-show ="(carts.length === 0)">
          <div class="notic-img">
          </div>
          <p>亲，购物车空空的耶~</p>
          <router-link to="/" tag="p">去逛逛</router-link>
        </div>
        <!-- 用户信息 -->
        <table class="user-news" v-show ="(carts.length > 0)">
          <tr>
            <th>
              收<span class="text-hidden">h</span>货<span class="text-hidden">h</span>人
            </th>
            <td>{{users.selectSite.lianxiren}} {{users.selectSite.sex === 0 ? '先生': '女士'}}</td>
            <router-link tag="td" to='/site' rowspan="3" class="amend">修改</router-link>
          </tr>
          <tr>
            <th>电<span class="text-hidden">隐藏</span>话</th>
            <td>{{users.selectSite.phone}}</td>
          </tr>
          <tr>
            <th>收货地址</th>
            <td>{{users.selectSite.city}} {{users.selectSite.site}} {{users.selectSite.xiangxi}}</td>
          </tr>
        </table>
        <!-- 用户信息下面的内容 -->
        <div class="cart-group-wrap" width="100%" v-show ="(carts.length > 0)">
          <!-- 闪送超市 -->
          <div class="cart-market-wrap">
            闪送超市
          </div>
          <span class="cart-addBtn">凑单专区</span>
          <p class="qisong">￥0起送，22:00前满￥30免运费，22:00后满￥50main运费</p>
          <!-- 收货时间 -->
          <p class="cart-recive-time">收货时间&nbsp;&nbsp;
            <span class="yuding">&nbsp;&nbsp;可预订</span>
            <select class="cart-receive-select">
              <span></span>              
              <optgroup label="今天">
                <option value="30分钟送达">30分钟送达</option>
                <option value="15:00-16:00">15:00-16:00</option>
                <option value="16:00-17:00">16:00-17:00</option>
                <option value="17:00-18:00">17:00-18:00</option>
                <option value="18:00-19:00">18:00-19:00</option>
              </optgroup>
              <optgroup label="明天">
                <option value="09:00-10:00">09:00-10:00</option>
                <option value="10:00-11:00">10:00-11:00</option>
                <option value="11:00-12:00">11:00-12:00</option>
                <option value="12:00-13:00">12:00-13:00</option>
              </optgroup>
              <optgroup label="后天">
                <option value="09:00-10:00">09:00-10:00</option>
                <option value="10:00-11:00">10:00-11:00</option>
                <option value="11:00-12:00">11:00-12:00</option>
                <option value="12:00-13:00">明天 12:00-13:00</option>
              </optgroup>
            </select>
          </p>
          <!-- 收货备注 -->
          <div class="cart-receive-remark">
            <span>收货备注&nbsp;&nbsp;</span>
            <input class="remark-input" type="text" maxlength="100" placeholder="可输入100字以内特殊要求内容">
          </div>
        </div>
        <!-- 购物车中的商品列表 -->
        <table class="group-item-wrap" v-show ="(carts.length > 0)">
          <router-link tag="tr" :to="'/detail/' + item.product_id" class="group-item" v-for="(item,index) in carts" :key="item.id" v-if="item.num>0">
            <td @click.stop="changeBol(item)" class="group-item-checkbox" :class="{'active':item.checked}">&nbsp;</td>
            <td class="group-item-img">
              <img v-lazy="item.product_img">
            </td>
            <td class="group-item-detail">
              <div>{{item.product_name}}</div>
              <div class="product-specifics-wrap">
                <div class="product-specifics">
                  <span>￥{{item.product_price}}</span>
                </div>
                <div class="btn-wrap">
                  <span @click.stop="subProduct(item)">-</span>
                  <span>{{item.num}}</span>
                  <span @click.stop="addProduct(item)">+</span>
                </div>
              </div>
            </td>
          </router-link>
        </table>
        <!-- 总价 -->
        <div class="footer" v-show ="(carts.length > 0)">
          <span @click="changeBolAll" class="checked" :class="{'active': checkedBol}">全选</span>
          共：<span class="total">￥{{total}}</span>
          <span class="sec" :class="{'active':checkedBol}">选好了</span>
        </div>
      </div>
  </div>
</template>
<script>
import HeadCart from '@/components/Head/HeadCart'
export default {
  activated(){
    if(!(this.users.id>0)){
      this.bol = true
      this.$msg("提示","未登录，请先登录")
      this.$router.push('/longin')
    }
  },
  data(){
    return {
      //控制购物车页面是蒙版
      bol:false,
    }
  },
  components:{
    HeadCart
  },
  computed:{
    //地址列表
    sites(){
      return this.$store.state.sites
    },
    users(){
      return this.$store.state.users
    },
    carts(){
      return this.$store.state.carts
    },
    //总价
    total () {
      return this.$store.getters.total
    },
    //判断全选按钮的状态(true表示全选)
    checkedBol(){
      // 假设都是勾选的
      let checkedBol
      for (let i = 0; i < this.carts.length; i++) {
        if (!this.carts[i].checked) {
          checkedBol = false
        }else{
          checkedBol = true
        }
      }
      return checkedBol
    }
    
  },
  methods:{
    //添加商品
    addProduct(item){
      this.$store.dispatch("addCart",item)
        .then(res =>{
          this.$msg("提示","添加数量成功")
          //保持本地数据与原始数据一致（因为每次改变是只是后台数据，页面渲染的是原始商品数据）
          this.$store.commit("RESET_CARTS",item)
      })
    },
    //减少商品
    subProduct(item){
        // 如果subCart内部是删除的操作的话，product也会删除掉，所以需要克隆一下以备份,
        //第二是因为不能直接修改product的num,product是vuex的state。修改需要走mutations.
      let cloneProduct = Object.assign({}, item)
      this.$store.dispatch("subCart",item)
      .then(res =>{
        cloneProduct.num--
        //保持本地数据与原始数据一致
        this.$store.commit("RESET_CARTS",cloneProduct)
        this.$msg("提示",res.msg)
      })
    },
    //切换商品的选择状态
    changeBol(item){
      this.$store.dispatch("changebol",item)
      .then(res => {
        this.$msg("提示",res.msg)
      })
    },
    //切换全选状态
    changeBolAll(){
      if(this.checkedBol){
        //表示已经全选,点击后更改商品选中状态为false
        this.$store.dispatch("checkedFalse")
      }else{
        //表示没有全选,点击后更改商品选中状态为true
        this.$store.dispatch("checkedTrue")
      }
    }
  }
  
}
</script>

<style lang="less" scoped>
@import url('../../styles/var.less');
.notic-wrap{
  text-align: center;
  margin-top: 20%;
  padding: 2rem 0;
  .notic-img{
    width: 8rem;
    height: 8rem;
    background: url("images/dingwei.png") 0 0 no-repeat;
    background-size: 8rem;
    margin-left: 38%;
  }
   p{
      margin:2rem 0;
      font-size: 1.4rem;
      color:#999;
    }
    p:nth-child(3){
      width: 11rem;
      height: 3rem;
      border:1px solid #ccc;
      border-radius: .5rem;
      margin-left: 33%;
      line-height: 3rem;
    }
}
.main{
  text-align: left;
}
table.user-news {
  width: 100%;
  font-size: 1.4rem;
  background-image: url('images/cart-bg.png'),url('images/cart-bg.png');
  background-position: left top,left bottom;
  background-size: auto 0.3rem;
  background-color: #ffffff;
  background-repeat: repeat-x;
  margin-bottom: 1rem;
  
  th{
    padding: .7rem 1rem .7rem 1rem;
    text-align: left;
  }
  td{
    padding: 0.7rem 0;
  }
  .amend {
    width: 17%;
    background: url('images/cart-more.png') right center no-repeat;
    background-size: 2rem;
  }
}
.cart-group-wrap{
  background-color: #fff;
  position: relative;
  .cart-market-wrap{
    font-size: 1.2rem;
    height: 3.5rem;
    line-height: 3rem;
    padding-left: 1.4rem;
    color: #999999;
    &::before {
      content: '';
      display: inline-block;
      width: 0.4rem;
      height: 1.2rem;
      background-color: #ffd600; 
      margin-right: 0.3rem;
      border-radius: 0.2rem;
      vertical-align: -0.2rem;
    }
  }
  p.qisong{
      color:#999;
      padding-left: 1.3rem;
      height: 2.2rem;
      line-height: 2rem;
  }
  .cart-addBtn{
    position: absolute;
    right: 1.4rem;
    top: 0.5rem;
    font-size: 1.2rem;
    width: 7rem;
    height: 2.4rem;
    line-height: 2.4rem;
    border-radius: 1.2rem;
    border:1px solid #f40;
    color: #f40;
    text-align: center;
  }
  p.cart-recive-time{
    position: relative;
    border: 1px solid white;
    box-sizing: border-box;
    border-top-color: lightgray;
    border-bottom-color: lightgray;
    height: 5rem;
    line-height: 4.8rem;
    font-size: 1.4rem;
    padding: 0 1.3rem; 
    background: url('images/cart-more.png') right center no-repeat;
    background-size: 2rem;
    overflow: hidden;
    .yuding{
      float: right;
      padding-right: 1.4rem;
    }
    .cart-receive-select{
      position: absolute;
      top: 0;
      bottom: 0;
      border: 0;
      font-size: 1.4rem;
      outline: none;
      background-color: transparent;
      color: #f40;
      appearance:none;
      -moz-appearance:none;
      -webkit-appearance:none;
      optgroup{
        color: #000000;
      }
    }
  }
  div.cart-receive-remark{
    height: 5rem;
    line-height: 5rem;
    font-size: 1.4rem;
    padding-left: 1.3rem;
    padding-right: 1.8rem;
    .remark-input{
      height: 3.2rem;
      line-height: 3.2rem;
      border:0;
      outline: none;
      font-size: 1.4rem;
      padding-left: 1rem;
      border: 1px solid lightgray;
      border-radius: 0.6rem;
      width: 72%
    }
  }
}
// 商品列表
table.group-item-wrap{
  width:100%;
  background-color: #fff;
  .group-item{
    width: 100%;
    border-top: 1px solid lightgray;
    border-bottom: 1px solid lightgray;
    .group-item-checkbox{
      background: url("./images/checkbox.png") center center no-repeat;
      -webkit-background-size: 1.8rem 1.8rem;
      background-size: 1.8rem 1.8rem;
      width: 5rem;
    }
    .group-item-checkbox.active{
      background-image: url("./images/checkbox-selectd.png");
    }
    .group-item-img{
      width: 5rem;
      img{
        width: 100%;
      }
    }
    .product-operates{
      text-align: right;
    }
    .group-item-detail{
      font-size: 1.3rem;
    }
    .group-item-detail>div{
      height: 4rem;
      line-height: 4rem;
      padding-left: 1rem;
    }
  }
}
.text-hidden{
  visibility: hidden;
}
.product-specifics-wrap{
  position: relative;
}
.btn-wrap{
  position: absolute;
  right: 0;
  bottom: 0rem;
  width: 9rem;
  height:5rem;
  line-height: 6rem;
  span:nth-child(2n+1){
    display: inline-block;
    width: 2.5rem;
    height: 2.5rem;
    line-height: 2.2rem;
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

//总价栏
.footer{
  position: relative;
  width:100%;
  height: 5rem;
  background-color: white;
  font-size: 1.4rem;
  span{
    height: 100%;
    line-height: 5rem;
  }
  .checked{
    padding-left: 2.5rem;
    display: inline-block;
    width: 6rem;
    background:url('./images/checkbox.png') .2rem center no-repeat;
    background-size: 1.8rem 1.8rem;
    margin-left: 1.4rem;
  }
  .checked.active{
     background:url('./images/checkbox-selectd.png') .2rem center no-repeat;
    background-size: 1.8rem 1.8rem;
  }
  .total{
    color:#f40;
  }
  .sec{
    text-align: center;
    width: 10rem;
    position: absolute;
    top: 0;
    right: 0;
    background-color: #808080;
  }
  .sec.active{
     background-color: @color-background;
  }
}

</style>


