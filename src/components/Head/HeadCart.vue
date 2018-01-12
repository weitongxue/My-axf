<template>
  <div class="headCart">
    <span class="iocn" v-if="back == 'true'" @click="goback()"></span>
    <div class="content">
        {{HeadTitle}}
        <slot name="x"></slot>
    </div>
  </div>
</template>

<script>
export default {
   props:["HeadTitle","back"],
   methods:{
     goback () {
       this.$router.go(-1)
     }
   }
}
</script>

<style lang="less" scoped>
.headCart{
  width:100%;
  height: 4.5rem;
  background-color:#F9FAFD;
  position: fixed;
  top: 0;
  .content{
    width:100%;
    height: 100%;
    line-height: 4.5rem;
    font-size: 1.4rem;
    color: black;
    position: relative;
  }
  .iocn{
    z-index: 2;
    position: absolute;
    top:0;
    left:0;
    width: 6rem;
    height: 4.4rem;
    background: url("./images/back.png") 0 center no-repeat;
    background-size: auto 2.5rem;
  }
}

  
</style>


