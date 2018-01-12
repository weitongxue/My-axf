//引入样式文件
require('./toast.less')
var Toast = {}
Toast.install = function (Vue, options) {
  Vue.prototype.$toast = (obj) => {
    // 1、创建构造器，定义好提示信息的模板
      let toastTpl = Vue.extend({
        //render渲染函数     
        render:function(createElement){
          return createElement('img',{
            //创建属性
            attrs:{
              src:obj.src
            },
            //创建行间样式
            style:{
              width:obj.width + 'px',
              height:obj.height + 'px',
              left:obj.start.left + 'px',
              top:obj.start.top + 'px'
            },
            //class标签
            "class":"cartoon_active"
          })
        }
      });

      // 2、创建实例，挂载到文档以后的地方
      let tpl = new toastTpl().$mount().$el; 

      //间隔100s开始动画
      setTimeout(()=>{
        tpl.style.left = obj.end.left + 'px'
        tpl.style.top = obj.end.top + 'px'
        tpl.style.transform = 'scale(0.1) rotate(180deg)'
        tpl.style.opacity = 0
      },100)
      
      // 3、把创建的实例添加到body中
      document.body.appendChild(tpl);
      
      // 4、延迟2.5秒后移除该提示
      setTimeout(function () {     
          document.body.removeChild(tpl);
      }, 900)
  }
}
module.exports = Toast;