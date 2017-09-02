//禁止广告
$("#ad_3v").hide();
// 获得所需变量
var mainDiv=document.getElementById('maindiv');
var scoreDiv=document.getElementById('scorediv');
var suspendDiv=document.getElementById('suspenddiv');
var endDiv=document.getElementById('enddiv');
var planscore=document.getElementById('planscore');
var scorelabel=document.getElementById('label');

var scores=0;

//创建飞机类
//dietime的变量意义不明确
//score代表飞机本身携带的分数，比如敌机，当被消灭时，可以将其加给当前用户的游戏分数
function plane(hp,X,Y,sizeX,sizeY,score,dietime,speed,boomimage,imagesrc) {
    //属性
    this.planehp=hp;
    this.planeX=X;
    this.planeY=Y;
    this.planesizeX=sizeX;
    this.planesizeY=sizeY;
    this.planescore=score;
    //飞机销毁时间
    this.planedietime=dietime;
    this.planespeed=speed;
    this.planeboomimage=boomimage;
    //存活状态
    this.planeisdie=false;
    //用于控制飞机通过多少次才能销毁，当planedietimes和planedietime相等时，飞机销毁
    this.planedietimes=0;
    this.imagenode=null;
    // 引用函数
    // 移动
    this.planemove=function () {
        if(scores<=50000)
        {
            this.imagenode.style.top=this.imagenode.offsetTop+this.planespeed+'px';
        }
        else if(scores>50000 && scores<=100000)
        {
            this.imagenode.style.top=this.imagenode.offsetTop+this.planespeed+1+'px';
        }
        else if(scores>100000 && scores<=150000)
        {
            this.imagenode.style.top=this.imagenode.offsetTop+this.planespeed+2+'px';
        }
        else if(scores>150000 && scores<=200000)
        {
            this.imagenode.style.top=this.imagenode.offsetTop+this.planespeed+3+'px';
        }
        else if(scores>200000 && scores<=300000)
        {
            this.imagenode.style.top=this.imagenode.offsetTop+this.planespeed+4+'px';
        }
        else
        {
            this.imagenode.style.top=this.imagenode.offsetTop+this.planespeed+5+'px';
        }
    }
    //初始化
    this.init=function () {
        this.imagenode=document.createElement('img');
        this.imagenode.style.left=this.planeX+'px';
        this.imagenode.style.top=this.planeY+'px';
        this.imagenode.src=imagesrc;
        mainDiv.appendChild(this.imagenode);
    }
    this.init();
}

//创建子弹类
function bullet(X,Y,sizeX,sizeY,imagesrc) {
    this.bulletX=X;
    this.bulletY=Y;
    this.bulletimage=null;
    //用于后来改变敌机血量
    this.bulletattach=1;
    this.bulletsizeX=sizeX;
    this.bulletsizeY=sizeY;

    // 移动行为
    this.buletmove=function () {
        this.bulletimage.style.top=this.bulletimage.offsetTop-20+'px';
    }

    //初始化
    this.init=function () {
        this.bulletimage=document.createElement('img');
        this.bulletimage.style.left=this.bulletX+'px';
        this.bulletimage.style.top=this.bulletY+'px';
        this.bulletimage.src=imagesrc;
        mainDiv.appendChild(this.bulletimage);
    }
    this.init();
}

//创建单行子弹类
function oddbullet(X,Y) {
    bullet.call(this,X,Y,6,14,'images/bullet1.png');
}

//创建多行子弹
/*function severalbullet() {

}*/

//创建本机类
function ourplan(X,Y) {
    var imagesrc='images/my.gif';
    plane.call(this,1,X,Y,66,80,0,660,0,'images/bz.gif',imagesrc);
    this.imagenode.setAttribute('id','ourplane');
}
//创建本机实例对象
var selfplan=new ourplan(120,485);
//初始化隐藏飞机
selfplan.imagenode.display='none';

//移动事件
var ourplane=document.getElementById('ourplane');
//本机跟随鼠标移动事件
var move=function () {
    var oevent=window.event || arguments[0];
    // var event_ele=oevent.srcElement || oevent.target;
    var selfplaneX=oevent.clientX-500;
    var selfplaneY=oevent.clientY;
    ourplane.style.left=selfplaneX-selfplan.planesizeX/2+'px';
    ourplane.style.top=selfplaneY-selfplan.planesizeY/2+'px';
}
var bodyobj=document.getElementsByTagName("body")[0];
//判断出界
var range=function () {
    var oevent=window.event || arguments[0];
    var bodyobjX=oevent.clientX;
    var bodyobjY=oevent.clientY;
    //合法范围  水平方向(505-815)  垂直方向(0-568)
    if(bodyobjX<520 || bodyobjX>800 ||bodyobjY<15 || bodyobjY>553)
    {
       //出界，解绑移动事件
        if(document.removeEventListener)
        {
            mainDiv.removeEventListener('mousemove',move,true);
        }
        else if(document.detachEvent)
        {
            mainDiv.detachEvent('mousemove',move,true);
        }
    }
    else{
        //鼠标移动范围合法，添加移动事件
        if(document.addEventListener)
        {
            mainDiv.addEventListener('mousemove',move,true);
        }
        else if(document.attachEvent)
        {
            mainDiv.attachEvent('mousemove',move,true);
        }
    }
}

//暂停事件
var number=0;
var suspend=function () {
    if(number==0)
    {
        suspendDiv.style.display='block';
        //解绑事件
        if(document.removeEventListener)
        {
            mainDiv.removeEventListener('mousemove',move,true);
            bodyobj.removeEventListener('mousemove',range,true);
        }
        else if(document.detachEvent)
        {
            mainDiv.detachEvent('mousemove',move,true);
            bodyobj.detachEvent('mousemove',range,true);
        }
        clearInterval(set);
        number=1;
    }
    else{
        suspendDiv.style.display='none';
        //绑定事件
        if(document.addEventListener)
        {
            mainDiv.addEventListener('mousemove',move,true);
            bodyobj.addEventListener('mousemove',range,true);
        }
        else if(document.attachEvent)
        {
            mainDiv.attachEvent('mousemove',move,true);
            bodyobj.attachEvent('mousemove',range,true);
        }
        set=setInterval(start,20);
        number=0;
    }
}

//游戏结束后点击继续按钮事件
//回到主页
function back() {
    location.reload(true);
}

    //为本机添加事件
    if(document.addEventListener)
    {
        mainDiv.addEventListener('mousemove',move,true);
        bodyobj.addEventListener('mousemove',range,true);
        selfplan.imagenode.addEventListener('click',suspend,true);
        //为暂停界面的继续按钮添加暂停事件
        suspendDiv.getElementsByTagName('button')[0].addEventListener('click',suspend,true);
        suspendDiv.getElementsByTagName('button')[1].addEventListener('click',back,true);
        suspendDiv.getElementsByTagName('button')[2].addEventListener('click',back,true);
    }
    else if(document.attachEvent)
    {
        mainDiv.attachEvent('mousemove',move,true);
        bodyobj.attachEvent('mousemove',range,true);
        selfplan.imagenode.attachEvent('click',suspend,true);
        //为暂停界面的继续按钮添加暂停事件
        suspendDiv.getElementsByTagName('button')[0].attachEvent('click',suspend,true);
        suspendDiv.getElementsByTagName('button')[1].attachEvent('click',back,true);
        suspendDiv.getElementsByTagName('button')[2].attachEvent('click',back,true);
    }


//创建敌机类
function enemy(hp,a,b,sizeX,sizeY,score,dietime,speed,boomimage,imagesrc) {
    plane.call(this,hp,random(a,b),-100,sizeX,sizeY,score,dietime,speed,boomimage,imagesrc);
}
//产生随机数
function random(min,max) {
    return Math.floor(min+Math.random()*(max-min));
}
//创建敌机数组
var enemys=[];


//子弹对象数组
var bullets=[];
var mark=0;
var mark1=0;
var backgroundPositionY=0;

//开始函数
function start() {
    mainDiv.style.backgroundPositionY=backgroundPositionY+'px';
    backgroundPositionY+=0.5;
    if(backgroundPositionY==568)
    {
        backgroundPositionY=0;
    }
    mark++;
    //创建敌机
    if(mark==20)
    {
        mark1++;
        //中等大小飞机
        if(mark1%5==0)
        {
            enemys.push(new enemy(6,25,274,46,60,5000,360,random(1,3),'images/zz.gif','images/enemy3_fly_1.png'));
        }
        // 大型飞机
        if(mark1==20)
        {
            enemys.push(new enemy(12,57,210,110,164,3000,540,1,'images/dd.gif','images/enemy2_fly_1.png'));
            mark1=0;
        }
        //小型飞机
        else{
            enemys.push(new enemy(1,9,286,34,24,1000,360,random(1,4),'images/xx.gif','images/enemy1_fly_1.png'));
        }
        mark=0;
    }
    //移动敌机
    var enemyslen=enemys.length;
    for(var i=0;i<enemyslen;i++)
    {
        //如果敌机依然存活，移动
        if(enemys[i].planeisdie!=true)
        {
            enemys[i].planemove();
        }
        //如果敌机超出范围，删除敌机
        if(enemys[i].imagenode.offsetTop>568)
        {
            mainDiv.removeChild(enemys[i].imagenode);
            enemys.splice(i,1);
            enemyslen--;
        }
        //当敌机死亡标记为true时，经过一段时间后清除敌机
        if(enemys[i].planeisdie==true)
        {
            enemys[i].planedietimes+=20;
            if(enemys[i].planedietimes==enemys[i].planedietime)
            {
                mainDiv.removeChild(enemys[i].imagenode);
                enemys.splice(i,1);
                enemyslen--;
            }
        }
    }

    //创建子弹
    if(mark%5==0)
    {
    bullets.push(new oddbullet(parseInt(selfplan.imagenode.style.left)+31,parseInt(selfplan.imagenode.style.top)-10));
    }

    //移动子弹
    var bulletslen=bullets.length;
    for(var i=0;i<bulletslen;i++)
    {
        bullets[i].buletmove();
        //如果子弹超出范围，销毁子弹
        if(bullets[i].bulletimage.offsetTop<0)
        {
            mainDiv.removeChild(bullets[i].bulletimage);
            bullets.splice(i,1);
            bulletslen--;
        }
    }

    //碰撞判断
    for(var j=0;j<bulletslen;j++)
    {
        for(var k=0;k<enemyslen;k++)
        {
            //判断碰撞本方飞机
            if(enemys[k].planeisdie==false)
            {
                // 本机碰撞敌机
                if(enemys[k].imagenode.offsetLeft+enemys[k].planesizeX>=selfplan.imagenode.offsetLeft && enemys[k].imagenode.offsetLeft<selfplan.imagenode.offsetLeft+selfplan.planesizeX)
                {
                    if(enemys[k].imagenode.offsetTop+enemys[k].planesizeY>=selfplan.imagenode.offsetTop+40 && enemys[k].imagenode.offsetTop<selfplan.imagenode.offsetTop-20+selfplan.planesizeY)
                    {
                        //碰撞本机，游戏结束，统计分数
                        selfplan.imagenode.src='images/bz.gif';
                        endDiv.style.display='block';
                        planscore.innerHTML=scores;
                       //解绑事件
                        if(document.removeEventListener)
                        {
                            mainDiv.removeEventListener('mousemove',move,true);
                            bodyobj.removeEventListener('mousemove',range,true);
                        }
                        else if(document.detachEvent)
                        {
                            mainDiv.detachEvent('mousemove',move,true);
                            bodyobj.detachEvent('mousemove',range,true);
                        }
                        clearInterval(set);
                    }
                }
                // 子弹和敌机的碰撞
                if(bullets[j].bulletimage.offsetLeft+bullets[j].bulletsizeX>=enemys[k].imagenode.offsetLeft && bullets[j].bulletimage.offsetLeft<=enemys[k].imagenode.offsetLeft+enemys[k].planesizeX)
                {
                    if(bullets[j].bulletimage.offsetTop+bullets[j].bulletsizeX>=enemys[k].imagenode.offsetTop && bullets[j].bulletimage.offsetTop<=enemys[k].imagenode.offsetTop+enemys[k].planesizeX)
                    {
                        //敌机血量减少
                        enemys[k].planehp=enemys[k].planehp-bullets[j].bulletattach;
                        //如果敌机血量为0，敌机图片切换为爆炸图片，死亡标记为true,计分
                        if(enemys[k].planehp==0)
                        {
                            scores=scores+enemys[k].planescore;
                            scorelabel.innerHTML=scores;
                            enemys[k].imagenode.src=enemys[k].planeboomimage;
                            enemys[k].planeisdie=true;
                        }
                        //删除子弹
                        mainDiv.removeChild(bullets[j].bulletimage);
                        bullets.splice(i,1);
                        bulletslen--;
                        break;
                    }
                }
            }
        }
    }
}

//开始游戏按钮点击事件
var set;
function begin() {
    startdiv.style.display='none';
    mainDiv.style.display='block';
    selfplan.imagenode.style.display='block';
    scoreDiv.style.display='block';
    set=setInterval(start,20);
}
