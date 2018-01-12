<template>
  <div class="select-site">
    <HeadCart back="true">
      <input v-model="search" slot="x" type="search" class="title-form" placeholder="请输入地址" maxlength="10" @input="inputSearch">
    </HeadCart>
    <div class="main">
      <!--百度地图容器-->
      <div style="width:100%;height:21rem;border:#ccc solid 1px;font-size:12px" id="map"></div>
      <!-- 候选地址列表 -->
      <div class="pois-list">
        <ul>
          <li class="spline-bottom" v-for="(item,index) in results" :key="item.uid" @click="changeSite(item)">
            <p class="pois-item-name">{{item.name}}</p>
            <p class="theme-font-gray">{{item.address}}</p>
          </li>
        </ul>
      </div>
      <div class="sug-list" v-show="resultsLists.length > 0">
        <ul>
          <li class="spline-bottom" v-for="item in resultsLists" :key="item.street_id" @click="changeSite(item)">
            <p class="pois-item-name">{{item.name}}</p>
            <p class="theme-font-gray">{{item.address}}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
//引入一个防止多次点击的函数
import _ from 'underscore'
import http from 'axios'
import api from '@/api'
import HeadCart from '@/components/Head/HeadCart'
import jsonp from 'jsonp'
let ak = 'U4U4eFK4t6A0sa0rZtGnHBvtuILXdfHT'
export default {
  activated(){
    //一进来初始化搜索页
    this.search = ''
    this.resultsLists = ''
    
    this.siteId = this.$route.params.id
    let that = this
    //进入页面首先判断时候选择了城市
    if(this.selectCity === ''){
      this.$msg("提示","请选择城市")
      .then(action =>{
        this.$router.push("/add_site")
      })
    }else{
      if(this.selectSite === ''){
        //没有选择地区就用默认的地区
        for(let i = 0 ; i < this.citys.length ; i++){
          if(this.citys[i].city === this.selectCity){
            this.site = this.citys[i].site
            this.X = this.citys[i].cityX
            this.Y = this.citys[i].cityY
          }
        }
         //初始化地图
          initBMap();
        //初始化候选地图列表
          initMapList();
      }else{
        //有地址
        this.site = this.selectSite,
        this.X = this.cityX,
        this.Y = this.cityY,
         //初始化地图
          initBMap();
        //初始化候选地图列表
          initMapList();
      }
    }
    //初始化候选地图列表
    function initMapList(){
      let BMapApi = 
      `http://api.map.baidu.com/place/v2/search?query=${that.site}&region=${that.selectCity}&output=json&ak=${ak}`
      jsonp(BMapApi,(err,data)=>{
        if(!err){
          that.results = data.results
        }
      })
    }
    //创建和初始化地图函数：
    function initBMap(){
      function initMap(){
        createMap();//创建地图
        setMapEvent();//设置地图事件
        addMapControl();//向地图添加控件
        addMapOverlay();//向地图添加覆盖物
      }
      function createMap(){ 
        //这个map对应上面容器的id
        map = new BMap.Map("map"); 
        map.centerAndZoom(new BMap.Point(that.X,that.Y),14);
      }
      function setMapEvent(){
        map.enableScrollWheelZoom();
        map.enableKeyboard();
        map.enableDragging();
        map.enableDoubleClickZoom()
      }
      function addClickHandler(target,window){
        target.addEventListener("click",function(){
          target.openInfoWindow(window);
        });
      }
      function addMapOverlay(){
        var markers = [
          {content:"",title:that.site,imageOffset: {width:0,height:3},position:{lat:that.Y,lng:that.X}}
        ];
        for(var index = 0; index < markers.length; index++ ){
          var point = new BMap.Point(markers[index].position.lng,markers[index].position.lat);
          var marker = new BMap.Marker(point,{icon:new BMap.Icon("http://api.map.baidu.com/lbsapi/createmap/images/icon.png",new BMap.Size(20,25),{
            imageOffset: new BMap.Size(markers[index].imageOffset.width,markers[index].imageOffset.height)
          })});
          var label = new BMap.Label(markers[index].title,{offset: new BMap.Size(25,5)});
          var opts = {
            width: 200,
            title: markers[index].title,
            enableMessage: false
          };
          var infoWindow = new BMap.InfoWindow(markers[index].content,opts);
          // marker.setLabel(label);
          addClickHandler(marker,infoWindow);
          map.addOverlay(marker);
        };
      }
        //向地图添加控件
      function addMapControl(){
        var navControl = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:3});
        map.addControl(navControl);
        }
          var map;
          initMap()
      }
    },
  components:{
    HeadCart 
  },
  methods:{
    //切换所选的城市，并保存在vuex中
    changeSite(site){
      this.$store.commit("CHANGE_SITE",site)
      this.$router.go(-1)
    },
    //控制点击的频率
    inputSearch: _.debounce(function(e){
      this.search = e.target.value
       let searchApi = 
      `http://api.map.baidu.com/place/v2/search?query=${this.search}&region=${this.selectCity}&output=json&ak=${ak}`
       jsonp(searchApi,(err,data)=>{
        if(!err){
          this.resultsLists = data.results
        }
      })
    },300)
  },
  data(){
    return {
      site:'',
      X:0,
      Y:0,
      //地址列表
      results:[],
      //搜索的地址列表
      resultsLists:[],
      //搜索字节
      search:'',
      //参数
      siteId:''
    }
  },
  computed:{
    //获取选择的城市
    selectCity(){
      return this.$store.state.selectCity
    },
    //获取选择的地区
    selectSite(){
      return this.$store.state.selectSite
    },
    //获取城市列表
    citys(){
      return this.$store.state.citys
    },
    //获取坐标
    cityX(){
      return this.$store.state.cityX
    },
    cityY(){
      return this.$store.state.cityY
    }
  }
}
</script>

<style lang="less" scoped>
.title-form{
  border: 1px solid #e0e0e0;
  border-radius: .3rem;
  height: 2.6rem;
  line-height: 2.6rem;
  padding-left: 2.4rem;
  background: url('./images/search.png') .6rem center no-repeat;
  -webkit-background-size: 1.3rem;
  background-size: 1.3rem;
  text-align: left;
}
.pois-list{
  position: absolute;
  top: 21rem;
  bottom: 0;
  left: 0;
  right: 0;
  padding-left: 1.5rem;
  background-color: #fff;
  overflow-y: scroll;
  li{
    border-bottom: 1px solid #e0e0e0;
    text-align: left;
    cursor: pointer;
    padding: .5rem 0;
    font-size: 1.4rem;
    .pois-item-name{
      line-height: 3rem; 
    }
    &:first-child{
        .pois-item-name{
          color:#f40;
          padding-left: 1.6rem;
          background: url("./images/pois.png") left center no-repeat;
          -webkit-background-size: auto 60%;
          background-size: auto 60%;
        }
      }
  }
}
.sug-list{
  text-align: left;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding-left: 1.5rem;
  background-color: #fff;
  overflow-y: scroll;
  li{
    cursor: pointer;
    padding: .5rem 0;
    font-size: 1.4rem;
    .pois-item-name{
      line-height: 3rem; 
    }
  }
}
</style>


