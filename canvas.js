var cnv = document.getElementById("gameCanvas");
var ctx = cnv.getContext("2d");

function gambar_titik(imageData, x, y, r, g, b) {
    var index = 4 * (Math.ceil(x) + (Math.ceil(y) * cnv.width));
    imageData.data[index] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = 255;
}

function dda_line(imageData, x1, y1, x2, y2, r, g, b) {
    var dx = x2 - x1;
    var dy = y2 - y1;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (x2 > x1) {
            var y = y1;
            for (var x = x1; x < x2; x++) {
                y = y + (dy / Math.abs(dx));
                gambar_titik(imageData, x, y, r, g, b);
            }
        } else {
            var y = y1;
            for (var x = x1; x > x2; x--) {
                y = y + (dy / Math.abs(dx));
                gambar_titik(imageData, x, y, r, g, b);
            }
        }
    } else {
        if (y2 > y1) {
            var x = x1;
            for (var y = y1; y < y2; y++) {
                x = x + (dx / Math.abs(dy));
                gambar_titik(imageData, x, y, r, g, b);
            }
        } else {
            var x = x1;
            for (var y = y1; y > y2; y--) {
                x = x + (dx / Math.abs(dy));
                gambar_titik(imageData, x, y, r, g, b);
            }
        }
    }
}

function lingkaranPolar(imageData, xc, yc, radius, r, g, b) {
    for (var theta = 0; theta < Math.PI * 6; theta += 0.005) {
        var x = xc + (radius * Math.cos(theta));
        var y = yc + (radius * Math.sin(theta));
        gambar_titik(imageData, x, y, r, g, b);
    }
}

function polygon(imageData, point_array, r, g, b) {
    for (var i = 0; i < point_array.length - 1; i++) {
        var x1 = point_array[i].x;
        var y1 = point_array[i].y;
        var x2 = point_array[i + 1].x;
        var y2 = point_array[i + 1].y;
        dda_line(imageData, x1, y1, x2, y2, r, g, b);
    }
    var x1 = point_array[point_array.length - 1].x;
    var y1 = point_array[point_array.length - 1].y;
    var x2 = point_array[0].x;
    var y2 = point_array[0].y;
    dda_line(imageData, x1, y1, x2, y2, r, g, b);
}

function translasi(titik_lama, jarak) {
    var x_baru = titik_lama.x + jarak.x;
    var y_baru = titik_lama.y + jarak.y;
    return { x: x_baru, y: y_baru };
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

var imageData = ctx.getImageData(0, 0, cnv.width, cnv.height);
var ball = { x: 400, y: 300, radius: 7, dx: 2, dy: -2 };

function drawBall(imageData, ball) {
    lingkaranPolar(imageData, ball.x, ball.y, ball.radius, 0, 0, 255);
    var toFlood = { r: 0, g: 0, b: 0 };
    var color = { r: 0, g: 0, b: 255 };
    floodFillStack(imageData, cnv, ball.x, ball.y, toFlood, color);
}

function buatBalok(baris, kolom, lebar, tinggi, jarakX, jarakY, offsetX, offsetY) {
    var bricks = [];
    for (var r = 0; r < baris; r++) {
        bricks[r] = [];
        for (var c = 0; c < kolom; c++) {
            var x = (c * (lebar + jarakX)) + offsetX;
            var y = (r * (tinggi + jarakY)) + offsetY;
            bricks[r][c] = {
                x: x,
                y: y,
                width: lebar,
                height: tinggi,
                status: 1
            };
        }
    }
    return bricks;
}

function gambarBalok(imageData, brick, warna) {
    var point_array = [
        { x: brick.x, y: brick.y },
        { x: brick.x + brick.width, y: brick.y },
        { x: brick.x + brick.width, y: brick.y + brick.height },
        { x: brick.x, y: brick.y + brick.height }
    ];
    polygon(imageData, point_array, warna.r, warna.g, warna.b);
    var toFlood = { r: 0, g: 0, b: 0 };
    floodFillStack(imageData, cnv, brick.x + 2, brick.y + 2, toFlood, warna);
}

function gambarSemuaBalok(imageData, bricks, warna) {
    for (var r = 0; r < bricks.length; r++) {
        for (var c = 0; c < bricks[r].length; c++) {
            if (bricks[r][c].status == 1) {
                gambarBalok(imageData, bricks[r][c], warna);
            }
        }
    }
}

var bricks = buatBalok(5, 8, 80, 25, 10, 10, 40, 50);
var warnaBalok = { r: 255, g: 0, b: 0 };

function draw(ball) {
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    drawBall(imageData, ball);

    if (ball.x + ball.dx > cnv.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy > cnv.height - ball.radius || ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    }

    // code buat bola mantul ke paddel
    // cek tabrakan dengan paddle
    var paddleTop = centerY - 5;
    var paddleBottom = centerY + 5;
    var paddleLeft = centerX - 60;
    var paddleRight = centerX + 60;

    if (
        ball.y + ball.radius >= paddleTop &&    // bola menyentuh atas paddle
        ball.y + ball.radius <= paddleBottom && // masih dalam area paddle
        ball.x >= paddleLeft && ball.x <= paddleRight
    ) {
        ball.dy = -Math.abs(ball.dy); // pantulkan ke atas
        ball.y = paddleTop - ball.radius; // geser sedikit agar tidak tembus
    }


    ball.x += ball.dx;
    ball.y += ball.dy;
}


function gameLoop() {
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    imageData = ctx.getImageData(0, 0, cnv.width, cnv.height);

    gambarSemuaBalok(imageData, bricks, warnaBalok);

    draw(ball);
    drawBall(imageData, ball);

    point_array = [{ x: centerX - 60, y: centerY - 5 }, { x: centerX + 60, y: centerY - 5 }, { x: centerX + 60, y: centerY + 5 }, { x: centerX - 60, y: centerY + 5 }];
    polygon(imageData, point_array, 255, 255, 0);

    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(gameLoop);
}

gameLoop();


var centerX = cnv.width / 2;
var centerY = cnv.height / 1.1;

addEventListener('keydown', function (ev) {
    var step =15;
    var batasPadel = 60;

    if (ev.key == 'a' || ev.key == 'ArrowLeft') {   
        if (centerX - batasPadel - step >= 0) {
            centerX -= step;
        }
    }
    else if (ev.key == 'd' || ev.key == 'ArrowRight') {
        if (centerX + batasPadel + step <= cnv.width) {
            centerX += step;
        }
    }
});
