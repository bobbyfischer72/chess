$(document).ready(function()
{

        var context;
        var x=100;
        var y=200;
        var dx=0.1;
        var dy=0.5;
        var p=[0,0];
        var v=[0,0];
        var img = new Image(50,50);

        context= greece.getContext('2d');
           //img.src = "{{=URL('/welcome/static/images/clippers.png')}}";
        img.src="/welcome/static/images/clippers.png";
        setInterval(draw,10);

        function draw()
    {
        if (dragimage) {
            x=p[0];
            y=p[1];
        }
        context.clearRect(0,0, 600,600);
        context.drawImage(img,x-75,y-75,150,150);
        //Boundary Logic
        if( x<75 || x>525) dx=-dx;
        if( y<75 || y>525) dy=-dy;
        x+=dx;
        y+=dy;
        dy+=0.01;
    }

        function getcoords(e)
    {
        var x;
        var y;
        if (e.pageX || e.pageY) {
          x = e.pageX;
          y = e.pageY;
        }
        else {
          x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
          y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        x -= greece.offsetLeft;
        y -= greece.offsetTop;
        v=[x-p[0], y-p[1]];
        //console.log (v);
        p=[x,y];
    }


    var dragimage=false;
    $("#greece").mousedown(function(e) {
     getcoords(e);
     if (p[0]>x-75 && p[0]<x+75 && p[1]>y-75 && p[1]<y+75) {
    dragimage=true;
     }
    }).mousemove(function(e) {
     getcoords(e);
    }).mouseup(function(e) {
    // getcoords(e);
     if (dragimage) {
     dx=v[0];
     console.log (v);
     dy=v[1];
     }
     dragimage=false;
    });
$("#erase").click(function(e) {
    // Clear canvas
  ctx.clearRect(0, 0, 600, 600);
    });
});