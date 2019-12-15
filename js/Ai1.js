const squaresize = 30;//每格的边长
const squareamount = 25;//每行（列）的格子数
var cvsize = squaresize * squareamount;
document.getElementById("canvas").width = cvsize;
document.getElementById("canvas").height = cvsize;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var cvleft;
var cvtop;
var mouseon = 0;
var ifplacebp = 0;
var ifplaceep = 0;

var bgx, bgy, endx, endy;


function drawRect() {

    for (var i = 0; i <= cvsize; i += squaresize) {     //绘制线框
        ctx.strokeStyle = "#808080";
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(cvsize, i);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, cvsize);
        ctx.closePath();
        ctx.stroke();
    }
    var canvasBox = canvas.getBoundingClientRect(); //获取canvas元素的边界框

    cvleft = canvasBox.left;
    cvtop = canvasBox.top;
}

var map = new Array();         //先声明一维 
for (var i = 0; i <= squareamount; i++) {          //一维长度为20
    map[i] = new Array();    //在声明二维 
    for (var j = 0; j <= squareamount; j++) {      //二维长度为20
        map[i][j] = -1;
    }
}

var placething = -1;//0为开始点 1为结束点 2为障碍点

function placebp() {
    if (!ifplacebp) {
        placething = 0;
    } else {
        alert("您已经放置过开始点了！")
    }
}
function placeep() {
    if (!ifplaceep) {
        placething = 1;
    } else {
        alert("您已经放置过结束点了！")
    }
}
function placeos() {
    placething = 2;

}

canvas.addEventListener('mousemove', function (e) {
    var x = parseInt((e.clientX - cvleft - 0) / squaresize);//计算鼠标点击的区域，换算成格子坐标
    var y = parseInt((e.clientY - cvtop - 0) / squaresize);
    if (mouseon == 1) {
        if (placething == 2) {
            if (map[x][y] == -1) {
                ctx.fillStyle = "orange";
                ctx.fillRect(x * squaresize + 2, y * squaresize + 2, squaresize - 4, squaresize - 4);
                map[x][y] = 2;
            }
        }

    }


});

canvas.addEventListener('click', function (e) {

    var x = parseInt((e.clientX - cvleft - 0) / squaresize);//计算鼠标点击的区域，换算成格子坐标
    var y = parseInt((e.clientY - cvtop - 0) / squaresize);

    if (placething == 0) {
        if (map[x][y] == -1) {
            bgx = x;
            bgy = y;
            ctx.fillStyle = "#94E73B";
            ctx.fillRect(x * squaresize + 2, y * squaresize + 2, squaresize - 4, squaresize - 4);
            map[x][y] = 0;
            ifplacebp = 1;
            placething = -1;
        }



    } else if (placething == 1) {

        if (map[x][y] == -1) {
            endx = x;
            endy = y;
            ctx.fillStyle = "#FF4F4F";
            ctx.fillRect(x * squaresize + 2, y * squaresize + 2, squaresize - 4, squaresize - 4);
            map[x][y] = 1;
            ifplaceep = 1;
            placething = -1;
        }


    } else if (placething == 2) {
        if (map[x][y] == -1) {
            ctx.fillStyle = "orange";
            ctx.fillRect(x * squaresize + 2, y * squaresize + 2, squaresize - 4, squaresize - 4);
            map[x][y] = 2;
        }
    }
});

canvas.addEventListener('mousedown', function (e) {
    mouseon = 1;
});

canvas.addEventListener('mouseup', function (e) {
    mouseon = 0;
});

canvas.addEventListener('mouseout', function (e) {
    mouseon = 0;
});

function search_astar() {
    var x = searchRoad(map, bgx, bgy, endx, endy);
    drawpath(x);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function drawpath(pathroad) {
    document.getElementById("Astar_ing").style.display = 'block';
    ctx.strokeStyle = "#28B4EE";
    len = pathroad.length;
    for (var i = 0; i < len - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(squaresize / 2 + squaresize * pathroad[i].x, squaresize / 2 + squaresize * pathroad[i].y);
        ctx.lineTo(squaresize / 2 + squaresize * pathroad[i + 1].x, squaresize / 2 + squaresize * pathroad[i + 1].y);
        ctx.closePath();
        ctx.stroke();
        await sleep(50)
    }
    document.getElementById("Astar_ing").style.display = 'none';
}
