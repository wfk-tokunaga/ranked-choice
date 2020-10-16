function drawTriangle() {
    var canvas = document.getElementById("tutorial");

    if (canvas.getContext) {
        console.log("Drawing Triangle!");
        //Drawing code goes here.
        var ctx = canvas.getContext("2d");

        ctx.beginPath();
        ctx.moveTo(75, 50);
        ctx.lineTo(100, 75);
        ctx.lineTo(100, 25);
        ctx.fill();

    } else {
        console.log("I'm sorry I can't display this drawing :(");
    }
}

function drawRectangles() {
    var canvas = document.getElementById("tutorial");

    if (canvas.getContext) {
        console.log("Drawing Rectangles!");
        //Drawing code goes here.
        var ctx = canvas.getContext("2d");

        ctx.fillStyle = 'rgb(200,0,0)';
        ctx.fillRect(10, 10, 50, 50);

        ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
        ctx.fillRect(30, 30, 50, 50);

        ctx.fillRect(25, 25, 100, 100);//, 100, 20, 20);
        ctx.clearRect(45, 45, 60, 60);//,80, 40, 40);
        ctx.strokeRect(50, 50, 50, 50);
    } else {
        console.log("I'm sorry I can't display this drawing :(");
    }
}

function drawArcs() {
    var canvas = document.getElementById("tutorial");
    if (canvas.getContext) {
        console.log("Drawing Arcs!");

        var ctx = canvas.getContext("2d");

        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                ctx.beginPath();
                var x = 25 + j * 50;
                var y = 25 + i * 50;
                var radius = 20;
                var startAngle = 0;
                var endAngle = Math.PI + (Math.PI * j) / 2;
                var anticlockwise = i % 2 !== 0;

                ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);

                if (i > 1) {
                    ctx.fill();
                } else {
                    ctx.stroke();
                }
            }
        }

    } else {
        console.log("I'm sorry I can't display this drawing :(");
    }    
}

function drawCurves() {
    var canvas = document.getElementById('tutorial');
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
  
      // Quadratric curves example
      ctx.beginPath();
      ctx.moveTo(75, 25);
      ctx.quadraticCurveTo(25, 25, 25, 62.5);
      ctx.quadraticCurveTo(25, 100, 50, 100);
      ctx.quadraticCurveTo(50, 120, 30, 125);
      ctx.quadraticCurveTo(60, 120, 65, 100);
      ctx.quadraticCurveTo(125, 100, 125, 62.5);
      ctx.quadraticCurveTo(125, 25, 75, 25);
      ctx.stroke();
    }
  }

function drawParallelLines() {
    let drawName = "Parallel Lines";
    var canvas = document.getElementById("tutorial");

    if (canvas.getContext) {
        console.log("Drawing Lines!");

        var ctx = canvas.getContext("2d");

        ctx.beginPath();
        ctx.moveTo(25, 25);
        ctx.lineTo(25, 200);
        ctx.moveTo(50, 25);
        ctx.lineTo(50, 200);
        ctx.stroke();


    } else {
        console.log("I'm sorry I can't display this drawing :(");
    }
}

function clearCanvas() {
    console.log("Clearing!");
    var canvas = document.getElementById("tutorial");

    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);//,80, 40, 40);
    } else {
        console.log("I'm sorry I can't display this drawing :(");
    }
}