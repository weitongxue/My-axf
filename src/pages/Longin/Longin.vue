<template>
  <div class="longin">
    <HeadCart HeadTitle='验证手机' back='true'/>
    <div class="main">
        <div class="pic-wrap" :class="{'pic-hide':bol === false}">
            <p class="pic-word">为了方便您及时查询订单信息，鲜锋侠需要你的手机号作为查询账号</p>
        </div> 
        <div class="phone">
            <input v-model="phone" type="tel" name="telnum" placeholder="手机号码" @focus="sure" @blur="noSure">
        </div>
        <div class="sub" @click="subPhone">确定</div> 
    </div>
  </div>
</template>
<script>
import HeadCart from '../../components/Head/HeadCart'
export default {
    data(){
        return{
            //控制显示隐藏
            bol:"true",
            phone:''
        }
    },
    components:{
        HeadCart
    },
    methods:{
        sure(){
            this.bol = false
        },
        noSure(){
            setTimeout(()=>{
                this.bol = true
            },1000)
        },
        //确定按钮
        subPhone(){
            let re = /^1[3578]\d{9}$/g
            let phone = this.phone
            if(re.test(phone)){
                //通过,创建一个对象，把用户电话传到数据库里，
                //用于判断是否是已经存在的用户(get请求需要传一个对象)
                let obj = {
                    phone:phone
                }
                this.$store.dispatch('submit',obj)
                    .then(res => {
                        this.$msg('提示', res.msg)
                    })
                    //不管是登录还是注册成功，否跳转到首页
                    this.$router.push("/")
            }else {
               this.$msg("提示","手机号输入格式错误") 
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../styles/var.less");
.main{
    bottom: 0;
}
.pic-wrap{
    width: 100%;
    height: 6.9rem;
    background:@color-background url("./images/pic.png") 1rem 1rem no-repeat;
    background-size: 11rem;
    position: relative;
    transition: height .4s;
    overflow: hidden;
    .pic-word{
        width: 55%;
        position: absolute;
        right: 0;
        top: 1.7rem;
        font-size: 1.2rem;
        color:black;
    }
}
.phone{
    text-align: left;
    width: 90%;
    padding: 1.5rem;
    background: white;
    input{
        outline: none;
        border: none;
        font-size: 1.4rem;
    }
}
.sub{
    height: 4rem;
    font-size: 1.6rem;
    background: @color-background;
    border-radius: .5rem;
    line-height: 4rem;
    margin: 2rem .6rem;
}
.pic-hide{
  height: 0px !important;
}
</style>

