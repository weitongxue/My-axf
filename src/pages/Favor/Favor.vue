<template>
  <div class="favor">
    <HeadCart HeadTitle='商品收藏' back='true'>
      <span class="compile" slot="x" @click="changeBol">{{bol ? '完成':'编辑'}}</span>
    </HeadCart>
    <div class="main">
      <ul>
        <li v-for="(item,index) in favorList" :key="index">
          <span class="check" v-show="bol" @click.stop="changeCheckBol(item)" :class="{'active':item.checkBol}"></span>
          <img v-lazy="item.product_img">
          <div>
            <h5>{{item.product_name}}</h5>
            <span>{{item.product_store_nums}}g</span>
            <span style="color:red">￥{{item.product_price}}</span>
          </div>
        </li>
      </ul>
      <!-- 全选和删除 -->
      <div class="footer" v-show="bol">
        <span class="allSelect" @click="changeAllBol" :class="{'active':checkedBol}">全选</span>
        <span class="deleteBtn">删除</span>
      </div>
    </div>
  </div>
</template>

<script>
import HeadCart from '../../components/Head/HeadCart'
export default {
  data(){
    return {
      //该用户的收藏列表
      userFavor :[],
      //判断编辑还是保存
      bol:false,
      //判断全选状态
      checkAllBol:false
    }
  },
   computed:{
    //拿到收藏列表
    favorList(){
      return this.$store.state.favorList
    },
    users(){
      return this.$store.state.users
    },
     //判断全选按钮的状态(true表示全选)
    checkedBol(){
      // 假设都是勾选的
      let checkedBol
      for (let i = 0; i < this.favorList.length; i++) {
        if (!this.favorList[i].checkBol) {
          checkedBol = false
        }else{
          checkedBol = true
        }
      }
      return checkedBol
    }
   },
  methods:{
    changeBol(){
      this.bol = !this.bol
    },
    //切换选中的状态
    changeCheckBol(item){
      for(let i = 0 ; i < this.favorList.length ; i++){
        if(this.favorList[i].product_id === item.product_id){
          this.favorList[i].checkBol = !(this.favorList[i].checkBol)
          //更改该商品的选中状态
          this.$store.dispatch("change_check_bol",this.favorList[i])
          .then(res =>{
            this.$msg("提示",res.msg)
          })
        }
      }
    },
    //切换全选
    changeAllBol(){
       if(this.checkedBol){
        //表示已经全选,点击后更改商品选中状态为false
        this.$store.dispatch("change_all_false")
      }else{
        //表示没有全选,点击后更改商品选中状态为true
        this.$store.dispatch("change_all_true")
      }
    }
  },
  components:{
    HeadCart
  },
}
</script>

<style lang="less" scoped>
@import url('../../styles/var.less');
.main{
  bottom: 0;
  text-align: left;
}
.compile{
  width: 6rem;
  height: 4.4rem;
  position: absolute;
  top: 0;
  right: 0;
  color:#777;
}
ul{
  li{
    padding:.5rem 0 .5rem 1.4rem;
    background-color: white;
    border-top:1px solid #e0e0e0;
    overflow: hidden;
    .check{
      float: left;
      margin-right: 1rem;
      width: 3.4rem;
      height: 5rem;
      background:url('./images/checkbox.png') center center no-repeat;
      background-size: 2rem;
      margin-top: 1.5rem;
    }
    .check.active{
      background:url('./images/checkbox-selectd.png') center center no-repeat;
      background-size: 2rem;
    }
    img{
      float: left;
    }
    div{
      width: 15rem;
      font-size: 1.2rem;
      padding-left: 1rem;
      float: left;
      h5{
        width: 100%;
        margin:18px 0 ;
        color: black;
      }
      span{
        width: 100%;
        display: inline-block;
        margin-bottom: 5px;
      }
    }
  }
}
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 5rem;
  line-height: 5rem;
  border-top: 1px solid #e0e0e0;
  background-color: #ffffff;
  font-size: 1.4rem;
  .allSelect {
    display: inline-block;
    padding-left: 4.4rem;
    background: url('./images/checkbox.png') 1.4rem center no-repeat;
    background-size: 1.8rem 1.8rem;
  }
  .allSelect.active{
    background: url('./images/checkbox-selectd.png') 1.4rem center no-repeat;
    background-size: 1.8rem 1.8rem;
  }
  .deleteBtn {
    display: inline-block;
    background-color:@color-background;
    width: 8rem;
    line-height: 3.7rem;
    margin-right: 1.2rem;
    text-align: center;
    border-radius: 0.5rem;
    position: absolute;
    top: 0.7rem;
    right: 1rem;
  }
}

</style>


