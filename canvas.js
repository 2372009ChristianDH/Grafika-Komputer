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






