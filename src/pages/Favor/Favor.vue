<template>
  <div class="favor">
    <HeadCart HeadTitle='商品收藏' back='true'>
      <span class="compile" slot="x">编辑</span>
    </HeadCart>
    <div class="main">
      <ul>
        <li>
          <img src="http://dummyimage.com/94x94/f279c8">
          <div>
            <h5>你好</h5>
            <span>12g</span>
            <span style="color:red">￥10</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import HeadCart from '../../components/Head/HeadCart'
export default {
  components:{
    HeadCart
  }
}
</script>

<style lang="less" scoped>
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
    position: relative;
    padding:.5rem 0 .5rem 1.4rem;
    background-color: white;
    border:1px solid #e0e0e0;
    div{
      font-size: 1.2rem;
      position: absolute;
      padding-left: 1rem;
      left: 9rem;
      right: 0;
      top:0;
      bottom: 0;
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
</style>


