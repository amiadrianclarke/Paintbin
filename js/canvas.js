//This script is based on Willam Malone's HTML Canvas Javascript Drawing App @ williammalone.com/articles/create-html5-canvas-javascript-drawing-app/#
//William's code was made available under the permissive Apache License: http://www.apache.org/licenses/LICENSE-2.0.html
//Our (modifications of his) code are NOT available under a permissive license, and are under copyright to Paintbin (C) 2012

canvasWidth = 850;
canvasHeight = 500;

curTool = 'marker';

curColor = '#000000';
curSize = 3;

clickColor = new Array(); //stores user's colors
clickSize = new Array();

$(document).ready(function() {
    //We dynamically add the canvas, so as to shield IE's virgin eyes 
    var canvasDiv = document.getElementById('canvasDiv');
    canvas = document.createElement('canvas');
    canvas.setAttribute('width', canvasWidth);
    canvas.setAttribute('height', canvasHeight);
    canvas.setAttribute('id', 'canvas');
    canvasDiv.appendChild(canvas);
    if(typeof G_vmlCanvasManager != 'undefined') 
    {
        canvas = G_vmlCanvasManager.initElement(canvas);
    }
    
    context = canvas.getContext("2d"); //grab the 2nd canvas context


    //Mouse Down Event: When the user clicks on canvas we record the position in an array via the addClick function. We set the boolean paint to true (we will see why in a sec). Finally we update the canvas with the function redraw.
    $('#canvas').mousedown(function(e){
        paint = true;
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        redraw();
    });
    
    //Mouse Move Event: Just like moving the tip of a marker on a sheet of paper, we want to draw on the canvas when our user is pressing down. The boolean paint will let us know if the virtual marker is pressing down on the paper or not. If paint is true, then we record the value. Then redraw.

    $('#canvas').mousemove(function(e){
        if (paint)
        {
            addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
            redraw();
        }
    });

    //Mouse Up Event: Marker is off the paper; paint boolean will remember!
    $('#canvas').mouseup(function(e){
        paint = false;
    });

    //Mouse Leave Event: If the marker goes off the paper, then forget you!
    $('#canvas').mouseleave(function(e){
        paint = false;
    });
    
    //Color picker..
    $('#colorSelector').ColorPicker({
        color: '#000000',
        onShow: function (colpkr) {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: function (colpkr) {
            $(colpkr).fadeOut(500);
            return false;
        },
        onChange: function (hsb, hex, rgb) {
            if (curTool == 'marker')
            {
                curColor = '#' + hex;
            }
            $('#colorSelector div').css('backgroundColor', '#' + hex);
        }
    });

    $('#pencilButton').click(function(){
    	curTool = 'marker';
        curColor = $("#colorSelector div").css('backgroundColor'); 
        
    });
/*
    $('#penButton').click(function(){
        curSize = 10;
    });
*/
    //Eraser and marker tools..
    $('#marker').click(function(){
        if (curTool != 'marker')
        {
            curTool = 'marker';
            curColor = $('#colorSelector div').css('backgroundColor');
            $("#marker").prop('disabled', true);
            $("#eraser").prop('disabled', false);
        }
    });
    
    $('#eraserButton').click(function(){
        if (curTool != 'eraser')
        {
            curTool = 'eraser';
            curColor = '#ffffff';
            $("#marker").prop('disabled', false);
            $("#eraser").prop('disabled', true);
        }
    });


    $('#trashButton').click(function(){
    	var r=confirm("Are you sure you want to clear your canvas?");
    	if (r==true)
  		{
	        clickX = Array();
	        clickY = Array();
	        clickDrag = Array();
	        clickColor = Array();
	        clickSize = Array();
	        clearCanvas();
  		}
    });

    $('#save_canvas').click(function(){
        //our submit method is derived from http://www.html5rocks.com/en/tutorials/canvas/integrating/
        data = document.getElementById('canvas').toDataURL('image/png');
        $('#png_data').val(data);
        $('#paintForm').submit();
    });
    
    $('#download_canvas').click(function(){
        data = document.getElementById('canvas').toDataURL();

        document.location.href = data.replace("image/png", "image/octet-stream");
    });
    
});

//Here is the addClick function that will save the click position:
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

function addClick(x, y, dragging)
{
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    clickColor.push(curColor);
    clickSize.push(curSize);
}

//The redraw function is where the magic happens. Each time the function is called the canvas is cleared and everything is redrawn. We could be more efficient and redraw only certain aspects that have been changed, but let's keep it simple.

//We set a few stroke properties for the color, shape, and width. Then for every time we recorded as a marker on paper we are going to draw a line.

function redraw()
{
    clearCanvas();

    context.lineJoin = "round";
                    
    for(var i=0; i < clickX.length; i++)
    {       
        context.beginPath();
        if(clickDrag[i] && i)
        {
            context.moveTo(clickX[i-1], clickY[i-1]);
        }
        else
        {
            context.moveTo(clickX[i]-1, clickY[i]);
        }
        context.lineTo(clickX[i], clickY[i]);
        context.closePath();
        context.strokeStyle = clickColor[i]; //Currently selected color
        context.lineWidth = clickSize[i]; //Currently selected size
        context.stroke();
    }
}

//Clear the canvas...
function clearCanvas()
{
    context.fillStyle = '#ffffff'; // Work around for Chrome
    context.fillRect(0, 0, canvasWidth, canvasHeight); // Fill in the canvas with white
    canvas.width = canvas.width; // clears the canvas
}
