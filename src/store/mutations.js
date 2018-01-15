export default{
    //存储所有商品信息
    GET_PRODUCTS(state,data){
        state.products = data
    },
    //存储分类对应的商品信息
    SAME_PRODUCT(state,data){
        state.categories = data
    },
    //存储登录页面的用户信息
    SUB_MIT(state,data){
        state.users = data
    },
    //储存该用户的购物车数据
    SAVE_CARTS(state,data){
        state.carts = data
        //更新原始num
        let categories = state.categories
        for (let i = 0; i < categories.length; i++) {
            let products = categories[i].product
            for (let j = 0; j < products.length; j++) {
              for (let z = 0; z < data.length; z++) {
                if (products[j].id === data[z].product_id) {
                products[j].num = data[z].num
                break
              }
            } 
          }
        }
    },
    //添加商品
    ADD_PRODUCT(state,data){
        state.carts.push(data)
    },
    //更新商品数量
    UP_NUM(state,data){
        for(let i = 0 ; i < state.carts.length ; i++){
            if(state.carts[i].id === data){
                state.carts[i].num++
                break
            }
        }
    },
    //减少商品
    SUB_PRODUCT(state,data){
        for(let i = 0 ; i < state.carts.length ; i++){
            if(state.carts[i].id === data){
                state.carts[i].num--
                break
            }
        }
    },
    //删除商品
    DEL_PRODUCT(state,id){
        for (let i = 0; i < state.carts.length; i++) {
            if (state.carts[i].id === id) {
              state.carts.splice(i, 1)
              break
            }
        }
    },
    //重置购物车里的数据
    RESET_CARTS(state,data){
        let categories = state.categories
        label:
        for(let i = 0 ; i< categories.length ; i++){
            let product = categories[i].product
            for(let j = 0 ; j < product.length ; j++){
                if(product[j].id == data.product_id){
                    product[j].num = data.num
                    break label
                }
            }
        }
    },
    //更新购物车商品的选中状态
    CHANGE_BOL(state,item){
        let index  = state.carts.indexOf(item)
        state.carts[index].checked = !state.carts[index].checked
    },
    //全选选中后更新所有商品的选中
    CHECKED_TRUE(state){
        let carts = state.carts
        for(let i = 0 ; i < carts.length ; i++){
          carts[i].checked = true
        }
    },
    CHECKED_FALSE(state){
        let carts = state.carts
        for(let i = 0 ; i < carts.length; i++){
          carts[i].checked = false
        }
    },
    //保存城市列表
    GET_CITYS(state,data){
        state.citys = data
    },
    //保存用户的地址信息
    SAVE_SITES(state,data){
        state.sites= data
    },
    //更新所选的城市
    SAVE_SELECT_CITY(state,data){
        state.selectCity = data
    },
    //重置地区，默认为空
    SAVE__SELECT_SITE(state,data){
        state.selectSite = data
    },
    //切换所选择的地址
    CHANGE_SITE(state,data){
        state.selectSite = data.name
        state.cityX = data.location.lng
        state.cityY = data.location.lat
    },
    //保存新建的地址信息
    SAVE_SITE(state,data){
        state.sites.push(data)
    },
    //更新本地用户所选地址
    SAVE_USER(state,data){
        state.users = data
    },
    UPDATA_SITE(state,data){
       for(let i = 0 ; i < state.sites.length ; i++){
           if((data.id-0) === (state.sites[i].id-0)){
            state.sites[i] = data
           }
       }
    },
    //删除地址
    DEL_SITE(state,siteObj){
       let index = state.sites.indexOf(siteObj)
       state.sites.splice(index,1)
    },
    //存储购物车图标的位置
    SAVE_LOCATION(state,location){
        state.location = location
    },
    //保存收藏列表
    SAVE_FAVOR_LIST(state,data){
        state.favorList = data
    },
    //添加的收藏
    SAVE_FAVOR(state,data){
        state.favorList.push(data)
    },
    //删除收藏
    DEL_FAVOR(state,data){
      let favorList = state.favorList
      for(let i = 0 ; i < favorList.length ; i++){
          if(favorList[i].product_id == data.id){
            favorList.splice(i,1)
            i--
          }
        break
      }
    },
    //初始化商品的收藏状态
    SAVE_FAVORS(state,data){
        //拿到所有商品
        let categories = state.categories
        label:
        for(let i = 0 ; i< categories.length ; i++){
            let product = categories[i].product
            for(let j = 0 ; j < product.length ; j++){
                if(product[j].id == data.product_id){
                    product[j].favor = data.favor
                    break label
                }
            }
        }
    },
    //切换收藏商品的选中状态
    CHANGE_CHECK_BOL(state,data){
        let favorList = state.favorList
        for(let i = 0 ; i < favorList.length ; i++){
            if(favorList[i].product_id == data.product_id){
                favorList[i].checkBol = data.checkBol
            }
        }
    },
    //全选
    CHANGE_ALL_TRUE(state){
        let favorList = state.favorList
        for(let i = 0 ; i < favorList.length ; i++){
          favorList[i].checked = true
        }
    },
     //全不选
     CHANGE_ALL_FALSE(state){
        let favorList = state.favorList
        for(let i = 0 ; i < favorList.length ; i++){
          favorList[i].checked = false
        }
    },
   
}