// Fungsi-fungsi yang akan digunakan untuk 

var cnv;

function gambar_titik(imageData,x,y,r,g,b){
    var index;
    index = 4 * (Math.ceil(x) + (Math.ceil(y) * cnv.width));

    imageData.data[index] = r; // Red
    imageData.data[index+1] = g; // Green
    imageData.data[index+2] = b; // Blue
    imageData.data[index+3] = 255; // Alfa
}
function dda_line(imageData,x1,y1,x2,y2,r,g,b){
    var dx = x2-x1;
    var dy = y2-y1;

    if(Math.abs(dx)>Math.abs(dy)){
        if(x2>x1){
            var y = y1;
            for(var x=x1;x<x2;x++){
                y = y+(dy/Math.abs(dx));
                gambar_titik(imageData,x,y,r,g,b);
            }
        } else {
            var y = y1;
            for(var x=x1;x>x2;x--){
                y = y+(dy/Math.abs(dx));
                gambar_titik(imageData,x,y,r,g,b);
            }
        }
    }else{
       if(y2>y1){
            var x = x1;
            for(var y=y1;y<y2;y++){
                x = x+(dx/Math.abs(dy));
                gambar_titik(imageData,x,y,r,g,b);
            }
        } else {
            var x = x1;
            for(var y=y1;y>y2;y--){
                x = x+(dx/Math.abs(dy));
                gambar_titik(imageData,x,y,r,g,b);
            }
        } 
    }
}


function lingkaranPolar(imageData,xc,yc,radius,r,g,b){
    for(var theta=0; theta<Math.PI*6; theta+=0.005){
        var x = xc + (radius * Math.cos(theta));
        var y = yc + (radius * Math.sin(theta));
        gambar_titik(imageData,x,y,r,g,b);
    }
}


function polygon(imageData,point_array,r,g,b){
    for( var i = 0;i<point_array.length-1;i++){
        var x1 = point_array[i].x;
        var y1 = point_array[i].y;
        var x2 = point_array[i+1].x;
        var y2 = point_array[i+1].y;

        dda_line(imageData,x1,y1,x2,y2,r,g,b)
    }

    var x1 = point_array[point_array.length-1].x;
    var y1 = point_array[point_array.length-1].y;
    var x2 = point_array[0].x;
    var y2 = point_array[0].y;
    dda_line(imageData,x1,y1,x2,y2,r,g,b)
}

function translasi(titik_lama,jarak){
    var x_baru = titik_lama.x + jarak.x;
    var y_baru = titik_lama.y + jarak.y;

    return{x : x_baru,y : y_baru}
}

function floodFillStack(imageData, cnv, x, y, toFlood, color) {
    var index = 4 * (Math.ceil(x) + (Math.ceil(y) * cnv.width));

    var r1 = imageData.data[index];
    var g1 = imageData.data[index + 1];
    var b1 = imageData.data[index + 2];

    var Stack = [];
    Stack.push({ x: x, y: y });

    while (Stack.length > 0) {
        var points = Stack.pop();
        var indexs = 4 * (points.x + (points.y * cnv.width));
        var r1 = imageData.data[indexs];
        var g1 = imageData.data[indexs + 1];
        var b1 = imageData.data[indexs + 2];

        if ((toFlood.r == r1 && toFlood.g == g1 && toFlood.b == b1)) {
            imageData.data[indexs] = color.r;
            imageData.data[indexs + 1] = color.g;
            imageData.data[indexs + 2] = color.b;
            imageData.data[indexs + 3] = 255;

            Stack.push({ x: points.x + 1, y: points.y });
            Stack.push({ x: points.x, y: points.y + 1 });
            Stack.push({ x: points.x - 1, y: points.y });
            Stack.push({ x: points.x, y: points.y - 1 });

        }

    }
}

cnv = document.getElementById("myCanvas");
var ctx = cnv.getContext("2d");
var imageData = ctx.getImageData(0, 0, cnv.width, cnv.height);

//Logic reference

var ball = { x: 400, y: 300, radius: 7, dx: 2, dy: -2 };

function drawBall(imageData, ball) {
    lingkaranPolar(imageData, ball.x, ball.y, ball.radius, 0, 0, 255);
    var toFlood = { r: 0, g: 0, b: 0 };
    var color = { r: 0, g: 0, b: 255 };
    floodFillStack(imageData, cnv, ball.x, ball.y, toFlood, color);
}


function draw(ball) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall(imageData, ball);

  if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx = -ball.dx;
  }
  if (ball.y + ball.dy > canvas.height - ball.radius || ball.y + ball.dy < ball.radius) {
    ball.dy = -ball.dy;
  }

  ball.x += ball.dx;
  ball.y += ball.dy;
}

// function startGame(){
//     setInterval(draw, 10);  
// }

function gameLoop() {
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    imageData = ctx.getImageData(0, 0, cnv.width, cnv.height);

    draw(ball);
    drawBall(imageData, ball);

    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(gameLoop);
}

gameLoop();
