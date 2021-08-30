//preluare canvas si context principal
var canvas = document.getElementById("mainCanvas");
var context = canvas.getContext("2d");
//preluare canvas si context secundar(temporar)
var canvasTemp = document.getElementById("tempCanvas");
var contextTemp = canvasTemp.getContext("2d");
//preluare coordonate (colt left-top, width, height) in variabila myDrawing
var myDrawing = canvas.getBoundingClientRect();

//calcularea coordonatelor actuale ale mouse-ului in canvas 
function getMouseCoord(event) {
    mouseX = event.clientX - myDrawing.left;
    mouseY = event.clientY - myDrawing.top;
  }

//desenare peste canvas-ul principal a canvas-ului secundar(temporar)
function updateMainCanvas () {
    context.drawImage(canvasTemp, 0, 0);
    contextTemp.clearRect(0, 0, canvasTemp.width, canvasTemp.height);
}

//am construit cate un obiect(model) pentru fiecare tip de tool pentru desenare
//pen, rectangle, line, circle, ellipse
var modelPen={ 
    mouseX: 0,
    mouseY: 0,
    //varabila bool pt a retine cand se face desenarea
    drawing: false,
    //pozitionarea la apasarea mouse-ului pentru inceperea desenului
    drawMouseDown: function(event){
        getMouseCoord(event);
        this.drawing = true;
        contextTemp.beginPath();
        contextTemp.moveTo(mouseX, mouseY);
    },
	//uneste continuu noile coordonate ale mouse-ului
    drawMouseMove: function(event){
        getMouseCoord(event);
        if(this.drawing){
          contextTemp.lineTo(mouseX, mouseY);
          contextTemp.stroke();
        }
    },
    //modificarea variabilei bool si actualizarea canvas-ului principal
    drawMouseUp: function(){
        this.drawing=false;
        updateMainCanvas();
    }
}

var modelRectangle = {
    //coordonatele de inceput si finale ale mouse-ului
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
    //varabila bool pt a retine cand se face desenarea
    drawingRect: false,
    //pozitionarea la apasarea mouse-ului pentru inceperea desenului
    drawRectMouseDown: function(event){
        this.startX = event.clientX - myDrawing.left;
        this.startY = event.clientY - myDrawing.top;
        this.drawingRect=true;
    },
    //desenare cu preview pt rectangle
    drawRectMouseMove: function(event){
        getMouseCoord(event);
        if(this.drawingRect){
            contextTemp.clearRect(0, 0, canvasTemp.width, canvasTemp.height);
            contextTemp.beginPath();
            //calcul latime si lungime prin diferenta dintre coordonatele actuale ale mouse-ului si cele de la care s-a pornit
            var rectWidth=mouseX-this.startX;
            var rectHeight=mouseY-this.startY;
            //desenare rectangle
            contextTemp.rect(this.startX, this.startY, rectWidth, rectHeight);
            contextTemp.stroke();
        }        
    },
    //modificarea variabilei bool si actualizarea canvas-ului principal
    drawRectMouseUp: function(){
        this.drawingRect=false;
        updateMainCanvas();
    }
}

var modelLine ={
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
    //varabila bool pt a retine cand se face desenarea
    drawingLine: false,
    //pozitionarea la apasarea mouse-ului pentru inceperea desenului
    drawLineMouseDown: function(event){
        this.startX=event.clientX - myDrawing.left;
        this.startY=event.clientY - myDrawing.top;
        this.drawingLine=true;
    },
    //desenare cu preview pt linie
    drawLineMouseMove: function(event){
        getMouseCoord(event);
        if(this.drawingLine){
            contextTemp.clearRect(0,0,canvasTemp.width, canvasTemp.height);
            contextTemp.beginPath();
            contextTemp.moveTo(this.startX, this.startY);
            contextTemp.lineTo(mouseX, mouseY);
            contextTemp.stroke();
            contextTemp.closePath();
        }
    },
    //modificarea variabilei bool si actualizarea canvas-ului principal
    drawLineMouseUp: function(){
        this.drawingLine=false;
        updateMainCanvas();
    }
}

var modelCircle={
    startX: 0,
    startY: 0,
    R: 0,
    //varabila bool pt a retine cand se face desenarea
    drawingCircle: false,
	//functie pt a calcula raza cercului
    getRadius: function (X1, Y1, X2, Y2) {
        return Math.sqrt(Math.pow(X1 - X2, 2) + Math.pow(Y1 - Y2, 2));
    },
    //pozitionarea la apasarea mouse-ului pentru inceperea desenului
    drawCircleMouseDown: function(event){
        this.startX = event.clientX - myDrawing.left;
        this.startY = event.clientY - myDrawing.top;
        this.drawingCircle = true;
    },
    //desenare cu preview pt cerc
    drawCircleMouseMove: function(event){
        getMouseCoord(event);
        this.R = modelCircle.getRadius(this.startX, this.startY, mouseX, mouseY);
        if(this.drawingCircle){
            contextTemp.clearRect(0, 0, canvasTemp.width, canvasTemp.height);
            contextTemp.beginPath();
            contextTemp.arc(this.startX, this.startY, this.R, 0, 2 * Math.PI);
            contextTemp.stroke();
        }
    },
    //modificarea variabilei bool si actualizarea canvas-ului principal
    drawCircleMouseUp: function() {
        this.drawingCircle = false;
        updateMainCanvas();
    }
}

var modelEllipse={
    //coordonatele de pornire ale mouse-ului, coordonatele centrului elipsei, si cele de scalare
    startX: 0,
    startY: 0,
    centerX: 0,
    centerY: 0,
    scaleX: 0,
    scaleY: 0,  
    //varabila bool pt a retine cand se face desenarea
    drawingEllipse: false, 
    //pozitionarea la apasarea mouse-ului pentru inceperea desenului
    drawEllipseMouseDown: function(event){
        this.startX = event.clientX - myDrawing.left;
        this.startY = event.clientY - myDrawing.top;
        this.drawingEllipse = true;
    },
    //desenare cu preview pt elipsa
    drawEllipseMouseMove: function(event){
        getMouseCoord(event);
        if(this.drawingEllipse){ 
            if(this.drawingEllipse){
                contextTemp.clearRect(0, 0, canvasTemp.width, canvasTemp.height);
                contextTemp.beginPath();
                //dimensiunea de scalare
                this.scaleX = (Math.max(this.startX,mouseX)-Math.min(this.startX,mouseX))/2.0;
                this.scaleY = (Math.max(this.startY,mouseY)-Math.min(this.startY,mouseY))/2.0;
                console.log(this.scaleX + " " + this.scaleY);
                //salvarea gradului de scalare
                contextTemp.save();
                contextTemp.scale(this.scaleX,this.scaleY);
                //recalcularea coordonatelor de centru ale elipsei
                this.centerX = (this.startX/this.scaleX)+1;
                this.centerY = (this.startY/this.scaleY)+1;
                //desenare elipsa  
                contextTemp.arc(this.centerX, this.centerY, 1, 0, 2 * Math.PI);
                console.log(this.centerX + " " + this.centerY);
                contextTemp.restore(); //resetarea gradului de scalare
                contextTemp.stroke();
            }
        }
    },
    //modificarea variabilei bool si actualizarea canvas-ului principal
    drawEllipseMouseUp: function() {
        this.drawingEllipse = false;
        updateMainCanvas();
    }
} 

//atasare evenimente pe fiecare buton aferent tool-ului si stergerea evenimentelor atasate anterior
document.getElementById("btnPen").onclick=function(){
    canvasTemp.removeEventListener("mousedown", modelLine.drawLineMouseDown);
    canvasTemp.removeEventListener("mousedown", modelRectangle.drawRectMouseDown);
    canvasTemp.removeEventListener("mousedown", modelCircle.drawCircleMouseDown);
    canvasTemp.removeEventListener("mousedown", modelEllipse.drawEllipseMouseDown);

    canvasTemp.addEventListener("mousedown", modelPen.drawMouseDown);
    canvasTemp.addEventListener("mousemove", modelPen.drawMouseMove);
    canvasTemp.addEventListener("mouseup", modelPen.drawMouseUp);
}  
  
document.getElementById("btnRect").onclick=function(){
    canvasTemp.removeEventListener("mousedown", modelPen.drawMouseDown);
    canvasTemp.removeEventListener("mousedown", modelLine.drawLineMouseDown);
    canvasTemp.removeEventListener("mousedown", modelCircle.drawCircleMouseDown);
    canvasTemp.removeEventListener("mousedown", modelEllipse.drawEllipseMouseDown);   

    canvasTemp.addEventListener("mousedown", modelRectangle.drawRectMouseDown);
    canvasTemp.addEventListener("mousemove", modelRectangle.drawRectMouseMove);
    canvasTemp.addEventListener("mouseup", modelRectangle.drawRectMouseUp);
} 

document.getElementById("btnLine").onclick=function(){
    canvasTemp.removeEventListener("mousedown", modelPen.drawMouseDown);
    canvasTemp.removeEventListener("mousedown", modelCircle.drawCircleMouseDown);
    canvasTemp.removeEventListener("mousedown", modelRectangle.drawRectMouseDown);
    canvasTemp.removeEventListener("mousedown", modelEllipse.drawEllipseMouseDown);   

    canvasTemp.addEventListener("mousedown", modelLine.drawLineMouseDown);
    canvasTemp.addEventListener("mousemove", modelLine.drawLineMouseMove);
    canvasTemp.addEventListener("mouseup", modelLine.drawLineMouseUp);
}
  
document.getElementById("btnCircle").onclick=function(){
    canvasTemp.removeEventListener("mousedown", modelPen.drawMouseDown);
    canvasTemp.removeEventListener("mousedown", modelLine.drawLineMouseDown);
    canvasTemp.removeEventListener("mousedown", modelRectangle.drawRectMouseDown);
    canvasTemp.removeEventListener("mousedown", modelEllipse.drawEllipseMouseDown);  

    canvasTemp.addEventListener("mousedown", modelCircle.drawCircleMouseDown);
    canvasTemp.addEventListener("mousemove",modelCircle.drawCircleMouseMove);
    canvasTemp.addEventListener("mouseup", modelCircle.drawCircleMouseUp);
}

document.getElementById("btnEllipse").onclick=function(){
    canvasTemp.removeEventListener("mousedown", modelPen.drawMouseDown);
    canvasTemp.removeEventListener("mousedown", modelLine.drawLineMouseDown);
    canvasTemp.removeEventListener("mousedown", modelRectangle.drawRectMouseDown);
    canvasTemp.removeEventListener("mousedown", modelCircle.drawCircleMouseDown); 

    canvasTemp.addEventListener("mousedown", modelEllipse.drawEllipseMouseDown);
    canvasTemp.addEventListener("mousemove",modelEllipse.drawEllipseMouseMove);
    canvasTemp.addEventListener("mouseup", modelEllipse.drawEllipseMouseUp);
}

//salvare imagine si atasare functie pe buton la click
function saveImage(){
    const imagine = document.createElement("a");
    document.body.appendChild(imagine);
    //preluare data din canvas in imagine
    imagine.href=canvas.toDataURL();
	//salvare cu numele image.png
    imagine.download = "image.png";
    imagine.click(); 
} 

document.getElementById("btnSave").onclick=saveImage;
	    
//preluare in variabila backgroundColors a butoanelor (primului) din clasa colorsButtons
var backgroundColors = document.getElementsByClassName('colorsButtons')[0];

//schimbare culoare in functie de butonul pe care se face click
function updatebackgroundColors(event){
    context.fillStyle=event.target.value;
    context.fillRect(0,0,canvas.width, canvas.height);
}

backgroundColors.addEventListener("click", updatebackgroundColors);

//schimbare dimensiune a brush-ului pe baza controlului input
function changeBrushSize(){
    size =document.getElementById("brushSize").value;
    contextTemp.lineWidth=size;
}

//actualizare dimensiune brush
document.getElementById("brushSize").onchange=changeBrushSize;    

//schimbare culoare a brush-ului
function changeColorsBrush (event) {
    contextTemp.strokeStyle = event.target.value;
}

//actualizare culoare brush, avand valoare implicita negru
function startStrokeColorShape(){
    strokeColor = document.getElementById("strokeColorShape");
    strokeColor.value = "#000000";
    strokeColor.addEventListener("input", changeColorsBrush);
    strokeColor.select();
}

startStrokeColorShape();