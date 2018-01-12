<template>
  <div class="site">
    <HeadCart back="true" HeadTitle ='选择地址'/>
    <div class="main">
      <div class="location">
        定位到当前位置
      </div>
      <!-- 蒙版 -->
      <div class="notic-wrap" v-show="!(sites.length >0)">
        <div class="notic-img">
        </div>
        <p>你还没有地址哦~</p>
      </div>
      <!-- 地址详情 -->
      <ul class="address-lists">
        <li class="address-list" v-for="(item,index) in sites" :key="index" @click.capture="changeSelectSite(item)">
          <div class="address-text" :class="{'active':item.id == users.selectSite.id}">
            <p>{{item.lianxiren}}&nbsp;&nbsp;&nbsp;{{item.phone}}</p>
            <p>{{item.city}}  {{item.site}}</p>
          </div>
          <div class="edit" @click.stop="upAmend(item)"></div>
        </li>
      </ul>
      <div class="footer">
        <router-link tag="div" to='/add_site' class="newSite">+ 新增地址</router-link>
      </div>
    </div>
  </div>
</template>
<script>
import HeadCart from '../../components/Head/HeadCart'
let selectSiteBol = false
export default {
    //导航守卫
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    if (from.path === '/') {
      //如果是从地图页面返回，则为true
       selectSiteBol = true
     }else{
       selectSiteBol = false
     }
     next()
    },
  created(){
    if(!this.users.id>0){
      this.$msg('提示','未登录，请登录')
      this.$router.push('/longin')
    }
  },
  components:{
    HeadCart 
  },
  computed:{
    sites(){
      return this.$store.state.sites
    },
    users(){
      return this.$store.state.users
    }
  },
  methods:{
    //切换选择的地址
    changeSelectSite(item){
      this.$store.dispatch("changeSelectSite",item)
      if(selectSiteBol){
        this.$router.push('/')
      }else{
        this.$router.push('/cart')
      }
    },
    //跳转到修改页
    upAmend(item){
      this.$router.push('/amend_site/' + item.id)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../styles/var.less');
.site{
  width: 100%;
}
.main{
  top:4.3rem;
}
.location{
  height: 4.5rem;
  line-height: 4.5rem;
  font-size: 1.4rem;
  color:#333;
  border-top: 1px solid #ECECEE;
  background:white url('./images/seo.png') 8rem center no-repeat;
  background-size: 2rem;
}
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
}
.footer{
  height: 5rem;
  line-height: 5rem;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  .newSite{
    margin: .6rem 20%;
    height: 3.7rem;
    line-height: 3.7rem;
    background:@color-background;
    border-radius: .5rem;
    color:#000;
    font-size: 1.4rem;
  }
}
ul.address-lists {
  z-index: 10;
  position: absolute;
  top: 4.4rem;
  width: 100%;
  margin: 1rem 0;
  background-color: #fff;
  .address-list {
    height: 8rem;
    font-size: 1.4rem;
    border-bottom: 1px solid lightgray; 
    position: relative;
    .address-text {
      text-align:left;
      position: absolute;
      top: 0.5rem;
      bottom: 0.5rem;
      left: 0;
      right: 8rem;
      line-height: 2.8rem;
      padding-top: 0.7rem;
      padding-left: 1rem;
      border-left: 0.5rem solid transparent;
      p{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      p:nth-child(2) {
        color:#999999;
      }
    }
    .address-text.active {
      border-left: 0.5rem solid #ffd600;
    }
    .edit {
      z-index: 10;
      position: absolute;
      width: 8rem;
      height: 5.2rem;
      top: 1.5rem;
      right: 0;
      background: url('./images/edit.png') center center no-repeat;
      background-size: 2.2rem;
      border-left: 1px solid lightgray;
    }
  }
}

</style>


