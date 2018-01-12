<template>
  <ul class="tab">
      <router-link class="home" tag="li" to="/"><span></span>首页</router-link>
      <router-link class="market" tag="li" to="/market"><span></span>闪送超市</router-link>
      <router-link ref="cartMove" class="cart" tag="li" to="/cart"><span></span>购物车</router-link>
      <router-link class="my" tag="li" to="/my"><span></span>我的</router-link>
      <span :class="{'active':activeBol}" class ="iocn" v-show="(nums !== 0)">{{nums}}</span>
  </ul>
</template>

<script>
export default {
    //在dom创建完成时获取标签的位置
  mounted(){
      let location = this.$refs.cartMove.$el.getBoundingClientRect()
      //存储到VUEX中
      this.$store.commit("SAVE_LOCATION",location)
  },
  computed:{
      nums(){
          return this.$store.getters.nums
      }
  },
  data(){
    return{
        //用来监听数量的变化，来添加对应的动画
        activeBol :false
    }
  },
  watch:{
      nums(){
        this.activeBol = true
        setTimeout(()=>{
            this.activeBol = false
        },300)
      }
  }
  
}
</script>


<style lang="less" scoped>
    .tab{
        position: fixed;
        height: 4.8rem;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        background-color: #F5F5F5;
        li{
            flex:1;
            color:#777;
            span{
                display: block;
                width: 100%;
                height: 60%;
                background-position: center 5px;
                background-repeat: no-repeat;
                background-size: auto 2rem;
            }
        }
    }
    .home > span{
        background: url("./images/home.png");
    }
    .market > span{
        background: url("./images/current.png");
    }
    .cart > span{
        background: url("./images/cart.png");
    }
    .my > span{
        background: url("./images/mine.png");
    }
    @keyframes move{
    0%{
        -webkit-background-size: auto .6rem;
        background-size: auto .6rem;
        }
    20%{
        -webkit-background-size: auto 2.2rem;
        background-size: auto 2.2rem;
        }
    40%{
        -webkit-background-size: auto 1.8rem;
        background-size: auto 1.8rem;
        }
    60%{
        -webkit-background-size: auto 2.06rem;
        background-size: auto 2.06rem;
        }
    80%{
        -webkit-background-size: auto 1.94rem;
        background-size: auto 1.94rem;
        }
    100%{
        -webkit-background-size: auto 2rem;
        background-size: auto 2rem;
        }
    }
    ul>li.home.router-link-exact-active>span{
        background-image: url("./images/home-active.png");
    }
    ul>li.market.router-link-exact-active>span{
        background-image: url("./images/current-active.png");
    }
    ul>li.cart.router-link-exact-active>span{
        background-image: url("./images/cart-active.png");
    }
    ul>li.my.router-link-exact-active>span{
        background-image: url("./images/mine-active.png");
    }
    ul>li.router-link-exact-active>span{
        animation: move 1s;
    }
    .iocn{
    position: absolute;
    top: .2rem;
    right: 9rem;
    width: 1.8rem;
    height: 1.8rem;
    line-height: 1.8rem;
    font-size: 1rem;
    background-color: #ff4400;
    border-radius: 50%;
    color:white;
    transform: scale(1);
    transition: all 0.3s cubic-bezier(0.28,-0.42, 0.37, 1.55);
    }
    .iocn.active{
        transform: scale(1.2);
    }
</style>


