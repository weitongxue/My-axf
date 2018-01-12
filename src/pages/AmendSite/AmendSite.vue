<template>
  <div class="add-site">
    <HeadCart back='true' HeadTitle='修改地址'/>
    <span class="save" slot="x" @click="updateSite">保存</span>
    <div class="main">
      <form action="#" class="menu">
        <table class="message">
          <tr>
            <th>联系人</th>
            <td><input type="text" placeholder="收货人姓名" v-model="lianxiren"></td>
          </tr>
          <tr>
            <th></th>
            <td class="sex">
              <span  @click="sex=0" :class="{'active':sex === 0}">男</span>
              <span  @click="sex=1" :class="{'active':sex === 1}">女</span>
            </td>
          </tr>
          <tr>
            <th>手机号码</th>
            <td><input type="text" placeholder="鲜锋侠联系你的电话" v-model="phone"></td>
          </tr>
          <tr>
            <th>所在城市</th>
            <td>
              <select :value="selectCity" @change="siteChange">
                <option value=''>请选择城市</option>
                <option v-for="(item,index) in citys" :key="index" :value="item.city">{{item.city}}</option>
              </select>
            </td>
          </tr>
          <router-link tag="tr" to='/select_site'>
            <th>所在地区</th>
            <td><input @click.prevent="selectSites" v-model="selectSite" class="sites" type="text" placeholder="请选择您的住宅小区或大厦"></td>
          </router-link>
          <tr>
            <th>详细地址</th>
            <td><input type="text" placeholder="请输入楼号门牌号等详细信息" v-model="xiangxi"></td>
          </tr>
        </table>
      </form>
      <!-- 删除地址 -->
      <div class="delSite" @click="delectSite">
        删除地址
      </div>
    </div>
  </div>
</template>

<script>
import HeadCart from '../../components/Head/HeadCart'
import http  from 'axios'
import api from '@/api'
//用于判断是否从地图页面返回
let selectSiteBol = false
export default {
  //导航守卫
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    if (from.path === '/select_site') {
      //如果是从地图页面返回，则为true
       selectSiteBol = true
     }else{
       selectSiteBol = false
     }
     next()
    },
  created(){
    //一进来就要获取数据库里的城市列表信息
    http.get(api.host + '/citys')
    .then(res =>{
      //同步保存到本地数据库里
      this.$store.commit("GET_CITYS",res.data)
    })
  },
  activated(){
    //获取该用户的地址
    this.siteId = this.$route.params.id
    for(let i = 0 ; i < this.sites.length ; i++){
      if(this.sites[i].id === (this.siteId-0) ){
        this.lianxiren =  this.sites[i].lianxiren
        this.phone = this.sites[i].phone
        this.sex = this.sites[i].sex
        this.xiangxi = this.sites[i].sex
        //更改选择的城市
        this.$store.commit("SAVE_SELECT_CITY",this.sites[i].city)
        this.citys.city = this.sites[i].city
        //更改选择的地址
        if(!selectSiteBol){
          this.$store.commit("CHANGE_SITE",{
          name : this.sites[i].site,
          location: {
            lng: this.sites[i].x,
            lat: this.sites[i].y
            }
          })
        }
      }
    }
    
  },
  components:{
    HeadCart
  },
  data(){
    return {
      lianxiren:'',
      phone:'',
      sex:'',
      xiangxi :'',
      //参数
      siteId:''
    }
  },
  computed:{
    //拿到用户表
    users(){
      return this.$store.state.users
    },
    //拿到城市列表
    citys(){
      return this.$store.state.citys
    },
    //选择的城市
    selectCity(){
      return this.$store.state.selectCity
    },
    //所有的地址
    sites(){
      return this.$store.state.sites
    },
    //选择的地址
    selectSite(){
      return this.$store.state.selectSite
    }
  },
  methods:{
    //更新所选的城市和地区
    siteChange(){
      console.log(event.target.value)
      this.$store.commit("SAVE_SELECT_CITY",event.target.value)
      //重置地区，为空就是选择默认的地区
      this.$store.commit("SAVE__SELECT_SITE",'')
    },
     //更新用户的地址
    updateSite(){
      if(this.lianxiren !== '' && this.phone !== '' 
      && this.xiangxi !== '' && this.selectCity !== ''
      && this.selectSite !== '' ){
        //创建用户地址信息，并保存到地址表里
        let updateObj = {
          userId: this.users.id,
          lianxiren : this.lianxiren,
          sex : this.sex,
          phone : this.phone,
          city : this.selectCity,
          site : this.selectSite,
          x : this.cityX,
          y : this.cityY,
          //该对象的id
          id: this.siteId
        }
        //把对象存储到本地和服务器中
        this.$store.dispatch("updateSite",updateObj)
        .then(res =>{
           this.$msg('提示', res.msg)
        })
        .then(action =>{
          //添加成功，跳转到地址列表页
          this.$router.push('/site')
        })
        }else{
        this.$msg('提示', '内容不能为空')
        }
    },
    selectSites () {
      // 判断是否选择了城市
      if (this.city !== '') {
        // 跳转到地图页(选择位置)(百度地图页)
        this.$router.push('/select_site')
      } else {
        this.$msg('提示', '请先选择城市')
      }
    },
    //删除地址
    delectSite(){
      //删除数据库里的地址
      let site = this.sites
      for(let i = 0 ; i < site.length ; i++){
            if(site[i].id === this.siteId-0){
              this.$store.dispatch("delectSite",site[i])
              .then(res => {
                return this.$msg('提示',res.msg)
                })
              .then(action =>{
                this.$router.push('/site')
              })
            }
        }
    }
  }
}
</script>

<style lang="less" scoped>
.save{
  position:fixed;
  top:0;
  right: .6rem;
  color:#777;
  width: 6rem;
  height: 4.4rem;
  line-height: 4.4rem;
  font-size: 1.4rem;
}
.main{
  bottom: 0;
}
.menu{
  width: 100%;
  background-color: white;
  .message{
    width: 100%;
    font-size: 1.4rem;
    tr{
      border-top: 1px solid #e0e0e0;
      th{
        padding: 1rem 0 1rem 1.5rem;
      }
      td{
        input{
          font-size: 1.4rem;
          width: 100%;
          border:none;
          outline: none;
          margin-left: 0;
        };
        select{
          width: 100%;
          outline: none;
          -webkit-appearance:none;
          font-size: 100%;
          border: 0;
          background: url('./images/cart-more.png') right center no-repeat;
          background-size: 2rem;
        } ;
        .sites{
          background: url('./images/cart-more.png') right center no-repeat;
          background-size: 2rem;
        }
      }
    }
  }
}
.sex{
  padding: 1rem 0 1rem 0;
  text-align: left;
  span{
    padding: 0 2rem;
    background: url('./images/checkbox.png') 0 0 no-repeat;
    background-size: 1.5rem;
  }
   span.active{
    padding: 0 2rem;
    background: url('./images/checkbox-selectd.png') 0 0 no-repeat;
    background-size: 1.5rem;
  }
}
.delSite{
  background-color: white;
  width: 100%;
  height: 4.5rem;
  line-height: 4.5rem;
  margin: 1rem 0;
  font-size: 1.4rem;
}
</style>


