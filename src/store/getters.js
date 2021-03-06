export default {
  //总价
  total (state) {
    let result = 0
    let carts = state.carts
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].checked) {
        result += (carts[i].num * carts[i].product_price)
      }
    }
    return result
  },
  //总数
  nums (state){
    let num = 0
    let carts = state.carts
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].checked) {
        num += carts[i].num 
      }
    }
    return num
  }
}