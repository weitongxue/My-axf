<template>
  <div class="wrap">
      <router-link tag="div" to='/site' class="title">{{users.id > 0?users.selectSite.site:'没有定位'}}</router-link>
      <div class="search">搜索</div>
  </div>
</template>

<script>
import http from 'axios'
import api from '@/api'
export default {
  created(){
    if(!this.users.id>0){
      this.$msg('提示','未登录，请登录')
      this.$router.push('/longin')
     }
  },
  computed:{
    users(){
      return this.$store.state.users
    }
  }
  
}
</script>

<style lang="less" scoped>
@import url("../../styles/var.less");
@import url("../../styles/mixin.less");
.wrap{
  position: fixed;
  top:0;
  left: 0;
  right: 0;
  background-color: @color-background;
  height: 4.5rem;
  overflow: hidden;
  .title{
    width: 174px;
    height: 100%;
    float: left;
    margin-left: 8rem;
    line-height: 4.5rem;
    font-size: 1.4rem;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
     &:after{
      content: "▼";
    }
  }
  .search{
    margin-right: 8px;
    text-align: right;
    width: 72px;
    height: 100%;
    float:right;
    font-size: 1.2rem;
    line-height: 7rem;
    background:url("./images/serach.png") 4rem 0.6rem no-repeat;
    background-size: 2rem;
    letter-spacing: .5rem;
  }
}

</style>

