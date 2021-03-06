console.log("Script.JS WORKING!");

(function() {

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var canvasDraw = $(canvas);
    var rstbutn = $('#resetsign');
    var hiddeninput = $("#hiddeninput");


    var canvasx = $(canvas).offset().left;
    var canvasy = $(canvas).offset().top;
    var mousedown = false;
    let positionOne;
    let positionTwo;
    let signatureImage;

    canvasDraw.on("mousedown", function(e) {
        mousedown = true;
        positionOne = [e.pageX - canvasx, e.pageY - canvasy];
    });

    $(canvas).on("touchstart", function(e) {
        mousedown = true;
        positionOne = [
            e.originalEvent.touches[0].pageX - canvasx,
            e.originalEvent.touches[0].pageY - canvasy
        ];
    });

    canvasDraw.on("mouseup", function() {
        mousedown = false;
        signatureImage = canvas.toDataURL();
        hiddeninput.val(signatureImage);
    });

    $(canvas).on("touchend", function() {
        mousedown = false;
        signatureImage = canvas.toDataURL();
        $(hiddeninput).val(signatureImage);
    });

    canvasDraw.on("mousemove", function(e) {
        positionTwo = [e.pageX - canvasx, e.pageY - canvasy];
        if (mousedown) {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(positionOne[0], positionOne[1]);
            ctx.lineTo(positionTwo[0], positionTwo[1]);
            ctx.stroke();
            positionOne = positionTwo;
        }
    });

    $(canvas).on("touchmove", function(e) {
        e.preventDefault();
        positionTwo = [
            e.originalEvent.touches[0].pageX - canvasx,
            e.originalEvent.touches[0].pageY - canvasy
        ];
        if (mousedown) {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(positionOne[0], positionOne[1]);
            ctx.lineTo(positionTwo[0], positionTwo[1]);
            ctx.stroke();
            positionOne = positionTwo;
        }
    });

    $(rstbutn).on("click", function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    });
})();
