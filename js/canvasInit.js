//定义pageAnnos，获取配置文件
var pageAnnos = pageEditor

//颜色转换函数  将16进制颜色值转换为rgba
function colorRgba(sHex, alpha = 1) {
  // 十六进制颜色值的正则表达式
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  /* 16进制颜色转为RGB格式 */
  let sColor = sHex.toLowerCase();
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      var sColorNew = "#";
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    //  处理六位的颜色值
    var sColorChange = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
    }
    // return sColorChange.join(',')
    // 或
    return "rgba(" + sColorChange.join(",") + "," + alpha + ")";
  } else {
    return sColor;
  }
}

/**
 * canvas的初始化函数，实现如下功能：
 *  1.根据配置文件获取canvas的位置和宽高
 *  2.同时设置canvas的旋转角度
 *  3.设置阴影的偏移量和模糊距离等相关属性
 */
function initCanvas() {
  //1.根据配置文件获取canvas的位置和宽高
  var location = pageAnnos.location;
  var x = location.x * location.pageWidth;
  var y = location.y * location.pageHeight;
  var width = location.width * location.pageWidth;
  var height = location.height * location.pageHeight;
  //2.获取canvas的旋转角度
  var rotation = location.rotation;
  //shadow表示阴影对象，设置阴影相关的属性
  var shadow = pageAnnos.shadow;

  //先将十进制颜色值转换成16进制颜色值
  var shadowColor = parseInt(shadow.shadowColor).toString(16);
  if (shadowColor < 10) {
    shadowColor = "#00" + shadowColor;
  } else if (10 < shadowColor < 100) {
    shadowColor = "#0" + shadowColor;
  } else {
    shadowColor = "#" + shadowColor;
  }
  //3.1 设置阴影的颜色和透明度为rgba
  var rgba = colorRgba(shadowColor, shadow.shadowAlpha);
  //3.2 设置阴影的模糊距离为blur
  var blur = shadow.shadowBlurX;
  //3.3 根据配置文件设置阴影的水平垂直偏移量
  var xshadow = 0,
    yshadow = 0;

  canvas.height = height;
  canvas.width = width;
  canvas.style.left = x + "px";
  canvas.style.top = y + "px";
  canvas.style.transform = `rotate(${rotation}deg)`; //定义旋转角度

  if (shadow.shadowAngle == 90) {
    yshadow = shadow.shadowDistance;
  } else if (shadow.shadowAngle == 180) {
    xshadow = -shadow.shadowDistance;
  } else if (shadow.shadowAngle == 270) {
    yshadow = -shadow.shadowDistance;
  } else {
    xshadow = shadow.shadowDistance;
  }
  //如果有阴影，则添加阴影属性
  if (shadow.hasDropShadow) {
    /*
      h-shadow	必需。水平阴影的位置。允许负值。	
      v-shadow	必需。垂直阴影的位置。允许负值。	
      blur	可选。模糊距离。	
      spread	可选。阴影的尺寸。	
      color	可选。阴影的颜色。请参阅 CSS 颜色值。	
      inset	可选。将外部阴影 (outset) 改为内部阴影。
    */
    //3.设置canvas的阴影属性
    canvas.style.boxShadow = `${xshadow}px ${yshadow}px ${blur}px  ${rgba}`;
  }

  //最后设置一下canvas的透明度
  canvas.style.opacity = pageAnnos.alpha;
}
