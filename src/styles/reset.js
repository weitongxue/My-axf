window.onload = window.onresize = function (){
    let dw = document.documentElement.clientWidth
    let htmlPx =  dw /320 * 10
    document.documentElement.style.fontSize = htmlPx + "px"
}