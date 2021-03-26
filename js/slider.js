// 创建canvas元素
var canvasDom = $("<canvas id='canvas'></canvas>");
$("body").append(canvasDom)
var canvas = canvasDom[0];
context = canvas.getContext("2d");
var images = [];
var alpha = 0,
maxAlpha = 100,
nowIndex = 0,
nextIndex = 1;
//定时器
var timerOne, timerAll;
//定义pageAnnos，获取配置文件
var pageAnnos = pageEditor;


//用来根据路径获取图片对象的方法
var imgLoad = function (url) {
  var img = new Image();
  img.onload = function () {
    img.onload = null;
  };  
  img.src = url;
  return img;
};  
//初始化images数组
var initImages =  function () {
  var img_1 = imgLoad("https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3363295869,2467511306&fm=26&gp=0.jpg");
  var img_2 = imgLoad("https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1089874897,1268118658&fm=26&gp=0.jpg");
  var img_3 = imgLoad("https://scpic.chinaz.net/files/pic/pic9/202101/apic30247.jpg");
  var img_4 = imgLoad("https://scpic.chinaz.net/files/pic/pic9/202101/apic30193.jpg");
  var img_5 = imgLoad("https://scpic.chinaz.net/files/pic/pic9/202101/bpic22251.jpg");
  var img_6 = imgLoad("https://scpic.chinaz.net/files/pic/pic9/202101/hpic3467.jpg");
  images = [img_1, img_2, img_3,img_4,img_5,img_6];
};  
//该方法是canvasInit文件里的初始话样式方法
initCanvas();
initImages();

//设置透明度和索引增加的函数
function addIndex() {
  alpha++;
  if (alpha > maxAlpha) {
    //当完成一张过渡，停一下
    clearInterval(timerOne);
    alpha = 0;
    nowIndex++;
    if (nowIndex >= images.length) {
      nowIndex = 0;
    }
    nextIndex++;
    if (nextIndex >= images.length) {
      nextIndex = 0;
    }
  }
}

//设置图片轮播的函数
function banner() {
  //定义图片对象
  var img = null;
  //定义下一张图片的透明度
  var alpha_2 = alpha / maxAlpha;
  //定义当前图片的透明度
  var alpha_1 = 1 - alpha_2;
  //清除画布
  context.clearRect(0, 0, canvas.width,  canvas.height);

  //当前图片的绘制  透明度alpha_1
  context.save();
  context.globalAlpha = alpha_1;
  img = images[nowIndex];
  //绘制矩形边框
  context.strokeStyle = "#fff";
  context.lineWidth = "4";
  context.strokeRect(0,0,canvas.width,canvas.height);
  context.drawImage(img,0,0,img.width,img.height,2,2,canvas.width-4, canvas.height-4);
  context.restore();

  //下一张图片的绘制 透明度 alpha_2
  context.save();
  context.globalAlpha = alpha_2;
  img = images[nextIndex];
  context.strokeStyle = "#fff";
  context.lineWidth = "4";
  context.strokeRect(0,0,canvas.width,canvas.height);
  context.drawImage(img, 0, 0,img.width,img.height,2,2 ,canvas.width-4, canvas.height-4);
  context.restore();
}

//自动播放的函数
function play(autoPlay) {
  if (autoPlay) {
    //设置自动轮播前先完成一次轮播，省去时间间隔
    timerOne = setInterval(function () {
      addIndex();
      banner();
    }, 20);
    //每隔duration时间间隔启动一次定时器。
    timerAll = setInterval(function () {
      clearInterval(timerOne);
      timerOne = setInterval(function () {
        addIndex();
        banner();
      }, 20);
      //根据pageAnnos对象的duration属性设置切换图片的时间间隔，需要加上图片轮播的时间两秒
    }, pageAnnos.duration * 1000 + 2000);
  } else {
    context.drawImage(images[nowIndex],0,0,images[nowIndex].width,images[nowIndex].height,0,0,canvas.width,canvas.height);
  }
}

window.onload = function () {
  //初始化canvas的位置宽高旋转阴影等熟悉
  initCanvas();
  //根据autoBool判断是否要自动播放
  play(this.pageAnnos.autoBool);
};
