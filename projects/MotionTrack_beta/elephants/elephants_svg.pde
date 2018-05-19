/* @pjs preload="elephants_trajs.svg, ../icons/plus_button.jpg, ../icons/minus_button.jpg"; */ //*********************************************
PShape trajs;
ScaleBar scale;
ZoomButtons plus, minus;
float zoom_factor = 1.0;
float scale_zoom = 1.0;
float imgW;
float ingH;
float lineWeight = 1.00;

//panning variables
float centerX;
float centerY;
float oldCenterX;
float oldCenterY;
int panToX;
int panToY;
int panFromX;
int panFromY;
int delx=0;
int dely=0;

boolean active = false;
boolean locked = false;

String mover = "Elephants";  //*********************************************
PFont f;

//runs once on startup to initialize variables and objects
void setup() 
{
  size(700, 500);
  frameRate(20);
  f = createFont("Helveticaneue",18,true);
  centerX = width/2;
  centerY = height/2;
  oldCenterX = centerX;
  oldCenterY = centerY;
  
  plus_icon = loadImage("../icons/plus_button.jpg");
  minus_icon = loadImage("../icons/minus_button.jpg"); 
  plus = new ZoomButtons(plus_icon, width-40, 40, 30);
  minus = new ZoomButtons(minus_icon, width-40, 40+30, 30);  
 
  trajs = loadShape("elephants_trajs.svg");  //*********************************************
  trajs.disableStyle();
  imgW = trajs.width;
  imgH = trajs.height;
  
  //initialize scale bar supplying pixels/meter convertion factor, here it is 6896551 pixels/meter from 0.145 microns/pixel imaging condition
  scale = new ScaleBar(0.002);  //*********************************************
  

}

//function that repeats and draws elements to the canvas
void draw() 
{
  background(255);
  
  //draw the trajectories centerX, centerY, imgW and imgH are updated in mouse functions
  shapeMode(CENTER);
  strokeJoin(ROUND);
  strokeWeight(lineWeight);
  stroke(#EF25B2,170);
  noFill();
  shape(trajs,centerX,centerY,imgW,imgH);
  
  textFont(f,16);
  fill(100);
  textAlign(BASELINE);
  text(mover,10,20);
  
  if(plus.mouseOver(mouseX,mouseY)){plus.alpha = 255;}
  if(minus.mouseOver(mouseX,mouseY)){minus.alpha = 255;}
  plus.display();
  minus.display();
  plus.alpha = 128;
  minus.alpha = 128;
  
  //draw scale bar, scale may be rescaled in mouseScool()
  scale.drawscale();
  
}

//scale bar object
class ScaleBar{
   float convertion_factor;
   float PixelMeterConvertion;
   float length_meters;
   float scale_meters;
   float scale_pixels;
   int scale_magnitude;
  
   //constructor
   ScaleBar(float _convertion_factor){
     convertion_factor = _convertion_factor;
     PixelMeterConvertion = convertion_factor;
     length_meters = width/10/PixelMeterConvertion;
     scale_magnitude = round(log10(length_meters));
     scale_meters = pow(10,scale_magnitude);
     scale_pixels = scale_meters*PixelMeterConvertion; 
   } 
   
   void rescale(){
     PixelMeterConvertion = convertion_factor*(scale_zoom);
     length_meters = width/10/PixelMeterConvertion;
     scale_magnitude = round(log10(length_meters));
     scale_meters = pow(10,scale_magnitude);
     scale_pixels = scale_meters*PixelMeterConvertion; 
   }
   
   void drawscale(){
     stroke(200);
     strokeWeight(3);
     line(10,30,10+scale_pixels,30);
     
     textFont(f,16);
     fill(200);
     if(scale_magnitude<0){
     text(nf(scale_meters,1,abs(scale_magnitude))+"  meters",10,50);
     }
     else{
     text(nf(scale_meters,scale_magnitude+1,0)+"  meters",10,50);
     }
   }
}

class ZoomButtons{
   int pos_x, pos_y, size;
   int alpha;
   PShape button_icon;
   
    ZoomButtons(PShape _button_icon, int _pos_x, int _pos_y, int _size){
      pos_x = _pos_x;
      pos_y = _pos_y;
      size = _size;
      alpha = 128;
      button_icon = _button_icon;
    }

    void display(){
      imageMode(CENTER);
      rectMode(CENTER);
      stroke(200);
      strokeWeight(1);
      noFill();
      tint(255, alpha);
      image(button_icon,pos_x,pos_y);
      rect(pos_x,pos_y, size, size);
    }
    
    void mouseOver(int xo, int yo) { return xo<pos_x+size/2 && xo>pos_x-size/2 && yo<pos_y+size/2 && yo>pos_y-size/2; }
}

void mousePressed()
{
  if(active){
    cursor(MOVE);
    locked = true;
    panFromX = mouseX;
    panFromY = mouseY;
    
    if(plus.mouseOver(mouseX,mouseY)){
      //zoom in;
      zoom_factor = 1 + 0.1;
      scale_zoom *= 1 + 0.1;
      scale.rescale();
      imgW = imgW*zoom_factor;
      imgH = imgH*zoom_factor;
      lineWeight = lineWeight/zoom_factor;
    }
    if(minus.mouseOver(mouseX,mouseY)){
      //zoom out;
      //zoom_factor used for trajectories and scale_factor used for scale bar
      zoom_factor = 1 - 0.1;
      scale_zoom *= 1 - 0.1;
      scale.rescale();
      imgW = imgW*zoom_factor;
      imgH = imgH*zoom_factor;
      lineWeight = lineWeight/zoom_factor;
    }
    
  }
  
}

void mouseDragged() {
  if(locked) {
    
    oldCenterX = centerX;
    oldCenterY = centerY;
    
    panToX = mouseX;
    panToY = mouseY;
    delx = panToX - panFromX; 
    dely = panToY - panFromY;
    centerX = centerX + delx;
    centerY = centerY + dely;
    panFromX = panToX;
    panFromY = panToY; 
  
    }
}

void mouseReleased() {
  cursor(ARROW);
  locked = false;
}

void mouseScrolled()
{
  if(active)
  {
   if(mouseScroll > 0)
   {
       //zoom out;
       //zoom_factor used for trajectories and scale_factor used for scale bar
       zoom_factor = 1 - mouseScroll*0.01;
       scale_zoom *= 1 - mouseScroll*0.01;

   }
   else
   {
      //zoom in;
      zoom_factor = 1 - mouseScroll*0.01;
      scale_zoom *= 1 - mouseScroll*0.01;
      
   }
   //make a new scale with new zoom_factor
   scale.rescale();  //*********************************************
   //zoom the trajectories with 'zoom_factor' possibly updated by mouse events
   imgW = imgW*zoom_factor;
   imgH = imgH*zoom_factor;
   
   lineWeight = lineWeight/zoom_factor;
   
   oldCenterX = centerX;
   oldCenterY = centerY;
   centerX = centerX + (mouseScroll*0.01 * (mouseX - oldCenterX));
   centerY = centerY + (mouseScroll*0.01 * (mouseY - oldCenterY));
   
   
  }
}

void mouseOver(){
   active = true; 
}

void mouseOut(){
   active = false; 
}

float log10(float x){
  return (log(x) / log(10));
}
