import http from 'axios'
import api from '@/api'
export default {
  //验证longin页面的提交信息
  submit({commit},obj){
    return http.get(api.host + '/users?phone=' + obj.phone)
     .then(res => {
      //监听返回是数据结果,如果有返回值，就是存在，如果没有就是需要注册
      //get请求返回的是一个数组，post返回的是一个新的对象
      if (res.data.length > 0){
         // 提取该用户的地址列表
         http.get(api.host + '/users/' + res.data[0].id + '/sites')
         .then(res => {
           commit('SAVE_SITES', res.data)
         })
        //需要拿到该用户对应的购物车数据
        http.get(api.host + '/users/' + res.data[0].id + '/carts')
        .then(res => {
          //在本地数据库中保存该用户的购物车数据
          commit('SAVE_CARTS', res.data)
        })
        //拿到用户的收藏列表
        http.get(api.host + '/users/' + res.data[0].id + '/favorList')
        .then(res => {
          //在本地数据库中保存该用户的收藏数据
          commit('SAVE_FAVOR_LIST', res.data)
        })
        //保存到本地vuex中(登录成功后的状态)
        commit("SUB_MIT",res.data[0])
        return {"msg":"登录成功"}
      }else{
         // 注册
        // 追加一个selectSite(所选地址)的属性
        obj.selectSite = {}
        //注册，需要把用户的信息保存在本地和服务器中
        // return {"msg":"用户不存在"}
        return http.post(api.host + '/users',obj)
          .then(res => {
            if(res.data.id > 0){
              //保存到本地vuex中
              commit("SUB_MIT",res.data)
              return {"msg":"注册成功"}
            }else {
              return {"msg":"注册失败"}
            }
          })
      }
    })
  },
  //添加商品
  addProduct(store,item){
     /*
  先要验证商品在本地（和数据库中）是否存在，不存在就是添加，存在就是数量加加
   */
  //拿到本地用户和购物车数据
    let user = store.state.users
    let carts = store.state.carts
    //假设不存在
    let cartBol = true
    for(let i = 0 ; i < carts.length ; i++){
      //商品在购物车中存在，改变数量
      if(carts[i].product_id === item.id){
        cartBol = false
        let cartArr = Object.assign({}, carts[i])
        cartArr.num++
        //更新数据库中的数量
        return http.patch(api.host + '/carts/' + cartArr.id,{
          num : cartArr.num
        })
        .then(res => {
          if(res.data.id>0){
            //同步更新本地数据
            store.commit("UP_NUM",res.data.id)
            return {"msg":"更新数量成功"}
          }else{
            return {"msg":"更新数量失败"}
          }
        })
      }
    }
    //商品不存在
    if(cartBol){
      // {
      //   商品在购物中表的 id,
      //   商品的id product_id,
      //   用户id user_id,
      //   商品的数量,
      //   商品的图片,
      //   商品的名称,
      //   商品的价格,
      //   是否选择
      // }
      let productObj = {
        product_id :item.id,
        userId : user.id,
        num : 1,
        product_img : item.img,
        product_name : item.name,
        product_price : item.price,
        checked: true,
      }
      //添加到数据库里
      return http.post(api.host + '/carts',productObj)
      .then(res =>{
        if(res.data.id > 0){
          //添加到本地购物车中
          store.commit("ADD_PRODUCT",res.data)
          return {"msg":"添加成功"}
        }else{
          return {"msg":"添加失败"}
        }
        
      })
    }
  },
  //减少商品
  subProduct(store,item){
    //拿到本地购物车数据
    let carts = store.state.carts
    for(let i = 0 ; i < carts.length ; i++){
      //找到要操作的商品在购物车中的ID
      if(carts[i].product_id == item.id){
        let proId = carts[i].id
        //大于1就减减，否则就是删除
        let cartArr = Object.assign({}, carts[i])
        if(item.num > 1){
          cartArr.num--
          //更新数据库中的num
          return http.patch(api.host + '/carts/' + proId,{
            num : cartArr.num
          })
          .then(res => {
            if(res.data.id>0){
              //更新本地数据库里的数据
              store.commit("SUB_PRODUCT",res.data.id)
              return {"msg":"减少数量成功"}
            }else{
              return {"msg":"减少数量失败"}
            }
          })
        }else{
            //删除（数据库里的数据）
            return http.delete(api.host + '/carts/' + proId)
            .then(res =>{
              //删除本地数据库中的数据
              store.commit("DEL_PRODUCT",proId)
              return {"msg" :"删除商品成功"}
            })
        }
      }
    }
  },
  //在购物车页面添加商品
  addCart(store,item){
    let carts = store.state.carts
    for(let i = 0 ; i < carts.length ; i++){
      if(carts[i].product_id == item.product_id){
        let cartArr = Object.assign({}, carts[i])
        cartArr.num++
        //更新数据库
        return http.patch(api.host + '/carts/' + cartArr.id,{
          num : cartArr.num
        })
        .then(res => {
          if(res.data.id>0){
            //同步更新本地数据
            store.commit("UP_NUM",res.data.id)
            return {"msg":"更新成功"}
          }else{
            return {"msg":"更新失败"}
          }
        })
      }
    }
  },
  //在购物车页面减少商品
  subCart(store,item){
    let carts = store.state.carts
    for(let i = 0 ; i < carts.length ; i++){
      if(carts[i].product_id == item.product_id){
        //获取该商品在购物车中的id，为删除做准备
        let proId = carts[i].id
        let cartArr = Object.assign({}, carts[i])
        if(cartArr.num > 1){
          cartArr.num--
          //更新数据库
          return http.patch(api.host + '/carts/' + cartArr.id,{
            num :cartArr.num 
          })
          .then(res =>{
            if(res.data.id>0){
              //同步更新本地数据
              store.commit("SUB_PRODUCT",res.data.id)
              return {"msg":"减少商品成功"}
            }else{
              return {"msg":"减少商品失败"}
            }
          })
        }else{
           //删除（数据库里的数据）
           return http.delete(api.host + '/carts/' + proId)
           .then(res =>{
             //删除本地数据库中的数据
             store.commit("DEL_PRODUCT",proId)
             return { "msg": "删除商品成功"}
           })
        }
      }
    }
  },
  //购物车页面改变商品的勾选状态
  changebol(store,item){
    return http.patch(api.host + '/carts/' + item.id,{
      checked : ! item.checked
    })
    .then(res =>{
      if(res.data.id>0){
        //同时更新本地数据
        store.commit("CHANGE_BOL",item)
        return {"msg":"切换状态成功"}
      }else{
        return {"msg":"切换状态失败"}
      }
    })
  },
  
  //更改商品的选中状态为true
  checkedTrue(store){
    //更改数据库里的数据
    let carts = store.state.carts
    for(let i = 0 ; i < carts.length ; i++){
      http.patch(api.host + '/carts/' + carts[i].id,{
        checked : true
      })
    }
    //同步更新本地数据
    store.commit("CHECKED_TRUE")
  },
  //更改商品的选中状态为false
  checkedFalse(store){
     //更改数据库里的数据
     let carts = store.state.carts
     for(let i = 0 ; i < carts.length ; i++){
       http.patch(api.host + '/carts/' + carts[i].id,{
         checked : false
       })
     }
    //同步更新本地数据
    store.commit("CHECKED_FALSE")
  },
  //保存用户的地址信息
  save_site(store,data){
    //保存到数据库里
   return http.post(api.host + '/sites',data)
    .then(res =>{
      if(res.data.id>0){
        //更新用户当前所选的地址（当前所选择的地址就等于新添加的）
        http.patch(api.host + '/users/' + store.state.users.id,{
          selectSite : res.data
        })
        .then(res =>{
          //更新本地user
          store.commit('SAVE_USER',res.data)
        })
        //保存到vuex中
        store.commit('SAVE_SITE', res.data)
        return {'msg':'添加成功'}
      }else{
        return {'msg':'添加失败'}
      }
    })
  },
  //切换用户当前所选的地址
  changeSelectSite(store,item){
    //更新数据库数据
    http.patch(api.host + '/users/' + store.state.users.id,{
      selectSite : item
    })
    .then(res =>{
      if(res.data.id>0){
        //同步更新本地数据(更新user)
        store.commit("SAVE_USER",res.data)
      }
    })
  },
  //修改用户地址信息
  updateSite(store,updateObj){
    if (Number(updateObj.id) === Number(store.state.users.selectSite.id)) {
      // 也需要更新用户当前所选择的地址信息
      store.dispatch('changeSelectSite', updateObj)
    }
    //修改数据库里的数据
    return http.put(api.host + '/sites/' + updateObj.id ,updateObj)
    .then(res => {
      if (res.data.id > 0) {
        // 更新本地地址信息
        store.commit('UPDATA_SITE', res.data)
        return {'msg': '更新地址信息成功'}
      } else {
        return {'msg': '更新地址信息失败'}
      }
    })
  },
  //删除地址
  delectSite(store,siteObj){
    return http.delete(api.host + '/sites/' + siteObj.id, siteObj)
    .then(res =>{
      if(!res.data.id >0){
        //同步删除本地地址
        store.commit("DEL_SITE",siteObj)
        return {"msg":"删除地址成功"}
      } else {
        return {"msg":"删除地址失败"}
      }
    })
  },
  //添加到收藏列表
  save_favor(store,data){
    let favorObj = {
      /**
       * 用户的id
       * 商品id
       * 商品图片
       * 商品名称
       * 商品规格
       * 商品价格
       * 收藏的状态/
       * 是否被选中(默认没有)
       * check:false
       */
      userId : store.state.users.id,
      product_id : data.id,
      product_img : data.img,
      product_name : data.name,
      product_price:data.price,
      product_store_nums:data.store_nums,
      favor:data.favor,
      checkBol:false
    }
    return http.post(api.host + '/favorList', favorObj)
    .then(res =>{
      if(res.data.id>0){
        //添加到本地收藏列表中
        store.commit("SAVE_FAVOR",res.data)
        return {'msg':'添加收藏成功'}
      }else{
        return {'msg':'添加收藏失败'}
      }
    })
  },
  //删除收藏
  del_favor(store,data){
    let favorList = store.state.favorList
    //拿到该商品在收藏列表中的id
    let favorId 
    for(let i = 0 ; i < favorList.length ; i++){
      if(favorList[i].product_id == data.id)
      favorId = favorList[i].id
    }
    return http.delete(api.host + '/favorList/' + favorId, data)
    .then(res =>{
      if(!res.data.id>0){
        //同步删除本地的收藏
        store.commit("DEL_FAVOR",data)
        return {"msg":"删除收藏成功"}
      }else{
        return {"msg":"删除收藏失败"}
      }
    })
  },
  //切换选中的状态
  change_check_bol(store,data){
    return http.patch(api.host + '/favorList/' + data.id,{
      checkBol :data.checkBol
    })
    .then(res =>{ 
      if(res.data.id>0){
        //同步更新本地状态
        store.commit("CHANGE_CHECK_BOL",res.data)
        return {"msg":'切换状态成功'}
      }else{
        return {"msg":'切换状态失败'}
      }
    })
  },
  //全选
  change_all_true(store){
    let favorList = store.state.favorList
    for(let i = 0 ; i < favorList.length ; i++){
    //更改数据里商品的选中状态为true
      http.patch(api.host + '/favorList/' + favorList[i].id ,{
        checkBol : true
      })
      .then(res=>{
          //同步本地数据
        store.commit("CHANGE_ALL_TRUE")
        return {"msg":"全选成功"}
      })
    }
  },
  //全不选
  change_all_false(store){
    let favorList = store.state.favorList
    for(let i = 0 ; i < favorList.length ; i++){
      http.patch(api.host + '/favorList/'+ favorList[i].id,{
        checkBol : false
      })
      .then(res=>{
        //保存到本地
         store.commit("CHANGE_ALL_FALSE",data)
          return {"msg":"取消全选成功"}
        })
    }
  },

}