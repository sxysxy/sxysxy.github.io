var chess_map = new Array(15);
for(var i = 0; i < 15; i++) {
    chess_map[i] = new Array(15);
}

var gaming = null;  //游戏进行中的标记
var player = 0;     //当前玩家 0红方 1蓝方
var player_name = new Array("红方", "蓝方");
var player_color = new Array("#FF0000", "#0000FF");

//获得画布对象
function get_canvas() {
    return document.getElementById("myCanvas");
}

//获得绘制的上下文
function get_draw_context() {
    var elem = get_canvas();
    if(elem && elem.getContext) 
        return elem.getContext('2d');
}

//设置界面上的提示信息的内容
function set_status_text(_text) {
    document.getElementById("status_bar").innerHTML = ""+_text;
}

//判断胜负。如果判定分出胜负，则会停止游戏，提示获胜信息
function judge_win_loss() {
    set_status_text("判定中...");
    gaming = false;

    var flag = false;
    //check vertical
    for(var i = 0; i < 15; i++) {
        for(var j = 0; j <= 10; j++) {
            var t = true;
            for(var k = 0; k < 5; k++) {
                if(chess_map[i][j+k] != player) {
                    t = false;
                    break;
                }
            }
            if(t) {
                var context = get_draw_context();
                context.moveTo(i*40+20, j*40+20);
                context.lineTo(i*40+20, (j+4)*40+20);
                context.stroke();
                context.beginPath();
                context.closePath();
                flag = true;
                break;
            }
        }
        if(flag) break;
    }

    //check horizen
    if(!flag) {
    for(var j = 0; j < 15; j++) {
        for(var i = 0; i <= 10; i++) {
            var t = true;
            for(var k = 0; k < 5; k++) {
                if(chess_map[i+k][j] != player) {
                    t = false;
                    break;
                }
            }
            if(t) {
                var context = get_draw_context();
                context.moveTo(i*40+20, j*40+20);
                context.lineTo((i+4)*40+20, j*40+20);
                context.stroke();
                context.beginPath();
                context.closePath();
                flag = true;
                break;
            }
        }
        if(flag) break;
    }
    }

    //check italic 45°
    if(!flag) {
    for(var i = 4; i < 15; i++) {
        for(var j = 0; j <= 10; j++) {
            var t = true;
            for(var k = 0; k < 5; k++) {
                if(chess_map[i-k][j+k] != player) {
                    t = false;
                    break;
                }
            }
            if(t) {
                var context = get_draw_context();
                context.moveTo(i*40+20, j*40+20);
                context.lineTo((i-4)*40+20, (j+4)*40+20);
                context.stroke();
                context.beginPath();
                context.closePath();
                flag = true;
                break;
            }
        }
        if(flag) break;
    }
    }

    //check italic -45°
    if(!flag) {
    for(var i = 0; i <= 10; i++) {
        for(var j = 0; j <= 10; j++) {
            var t = true;
            for(var k = 0; k < 5; k++) {
                if(chess_map[i+k][j+k] != player) {
                    t = false;
                    break;
                }
            }
            if(t) {
                var context = get_draw_context();
                context.moveTo(i*40+20, j*40+20);
                context.lineTo((i+4)*40+20, (j+4)*40+20);
                context.stroke();
                context.beginPath();
                context.closePath();
                flag = true;
                break;
            }
        }
        if(flag) break;
    }
    }


    if(flag) {
        alert("恭喜"+player_name[player]+"获胜");
        set_status_text(player_name[player]+"获胜，按restart可以再来一局");
    }else {
        gaming = true;
    }
}

function draw_background() {
    var context = get_draw_context();
    if(context) {
        //清空画布
        context.clearRect(0, 0, 600, 600);

        context.lineWidth = 3;
        
        //画线
        //horizen line
        for(var i = 1; i < 15; i++) {
            context.moveTo(0, 40*i)
            context.lineTo(600, 40*i);
        }

        //verticel line
        for(var i = 1; i < 15; i++) {
            context.moveTo(40*i, 0);
            context.lineTo(40*i, 600);
        }
        context.stroke();
    }
}

function draw_chess(_r, _c, _color) {
    //求得格子(_r, _c)的中心的坐标（因为要画圆形的棋子，这里求得(x,y)为圆心坐标
    x = _r * 40 + 20;
    y = _c * 40 + 20;
    var context = get_draw_context();
    if(context) {
        context.fillStyle = _color;
        context.beginPath();
        context.arc(x, y, 20, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();  //画一个圆
        context.lineWidth = 3;
        context.stroke(); //补上黑色的外边界线
        context.beginPath();
        context.closePath();
    }
}

//这个函数在用户鼠标在canvas的区域内点击了的时候会被调用执行
function update(event) {
    if(gaming) { //如果在游戏中
        var canvas = get_canvas();
        var bbox = canvas.getBoundingClientRect(); //获得整个canvas边界的矩形

        //得到鼠标点击位置相对于canvas的坐标(x,y)
        x = event.clientX - bbox.left * (canvas.width / bbox.width);
        y = event.clientY - bbox.top * (canvas.height / bbox.height);

        //换算成格子的坐标
        r = Math.floor(x / 40);
        c = Math.floor(y / 40);

        //restrict range限定范围
        if(r < 0) r = 0;
        if(r > 14)r = 14;
        if(c < 0) c = 0;
        if(c > 14)c = 14;
        console.log("clicked:(" + r + "," + c + ")\n");
        if(chess_map[r][c] == -1) {  //如果这里本没有旗子
            draw_chess(r, c, player_color[player]);  //绘制棋子
            chess_map[r][c] = player;   
            judge_win_loss();           //判断胜负
            player = 1 - player;        //换手
        }
        if(gaming)set_status_text("当前"+player_name[player]+"执手");
    }
}

//这个函数在点击了页面上的restart按钮时会执行
function restart() {
    console.log("game started\n"); //console.log <-> printf
    for(var i = 0; i < 15; i++) {
        for(var j = 0; j < 15; j++) {
            chess_map[i][j] = -1;
        }
    }
    player = 0; //红方先手
    gaming = true;
    draw_background();
    set_status_text("当前"+player_name[player]+"执手");
}