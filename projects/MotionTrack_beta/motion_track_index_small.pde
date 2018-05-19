/* @pjs preload="icons/lengthscale.jpg, icons/timescale.jpg, icons/speedlines.png, icons/frogs_icon_big.jpg, icons/nanoparticle_icon_big.jpg, icons/osprey_icon_big.jpg, icons/plate_icon_big.png, icons/sheep_dog_icon_big.jpg, icons/elephants_icon_big.jpg, icons/bouys_icon_big.jpg, icons/quinoa_icon_big.jpg, icons/human_kitchen_icon_big.jpg"; */
PFont f;  //*******************
xAxis x_axis;
yAxis y_axis;
Icons [] icons;
ScaleIcons scale_icons;
boolean ScaleIconSwitch = false;
SpeedLines speed_lines;
boolean SpeedLinesSwitch = false;


//**************************** SETUP *************************************
void setup()
{
  int frame_w = 700;
  int frame_h = 600;
  size(frame_w,frame_h);
  frameRate(10);
  f = createFont("Helveticaneue",18,true);

 
  int x_min = -1;
  int x_max = 8;
  int y_min = -7;
  int y_max = 6;
  x_axis = new xAxis("Seconds",x_min,x_max,11);
  y_axis = new yAxis("Meters",y_min,y_max,15);
  int x_range = x_max - x_min;
  int y_range = y_max - y_min;
 
  icons = new Icons[9];  //******************
  int[] axislimits = {x_min, x_max+1, y_min, y_max+1};
  
  scale_icons = new ScaleIcons;
    
  speed_lines = new SpeedLines;
  
  PImage frogs_big;  //*******************
  frogs_big = loadImage("icons/frogs_icon_big.jpg");
  icons[0] = new Icons("Frogs",6.8,3,axislimits,20,"frogs/frogs_index.html", frogs_big);
  
  PImage nanoparticle_big;
  nanoparticle_big = loadImage("icons/nanoparticle_icon_big.jpg");
  icons[1] = new Icons("Nanoparticles",0,-6,axislimits,20,"nanoparticles/nanoparticles_index.html",nanoparticle_big);
  
  PImage osprey_big;
  osprey_big = loadImage("icons/osprey_icon_big.jpg");
  icons[2] = new Icons("Osprey",6.7,6,axislimits,20,"osprey/osprey_index.html",osprey_big);
  
  PImage plate_big;
  plate_big = loadImage("icons/plate_icon_big.png");
  icons[3] = new Icons("Earth Surface",8.5,-2,axislimits,20,"plate/plate_index.html",plate_big);
  
  PImage sheep_dog_big;
  sheep_dog_big = loadImage("icons/sheep_dog_icon_big.jpg");
  icons[4] = new Icons("Sheep Dogs",7,4,axislimits,20,"sheep_dogs/sheep_dogs_index.html",sheep_dog_big);
  
  PImage elephants_big;
  elephants_big = loadImage("icons/elephants_icon_big.jpg");
  icons[5] = new Icons("Elephants",7.8,5,axislimits,20,"elephants/elephants_index.html",elephants_big);
  
  PImage bouys_big;
  bouys_big = loadImage("icons/bouys_icon_big.jpg");
  icons[6] = new Icons("Ocean Bouys",7.3,6,axislimits,20,"bouys/bouys_index.html",bouys_big);
  
  PImage quinoa_big;
  quinoa_big = loadImage("icons/quinoa_icon_big.jpg");
  icons[7] = new Icons("Floating Quinoa",1,-1,axislimits,20,"quinoa/quinoa_index.html",quinoa_big);
  
  PImage human_kitchen_big;
  human_kitchen_big = loadImage("icons/human_kitchen_icon_big.jpg");
  icons[8] = new Icons("Kitchen Feet",2,0,axislimits,20,"human_kitchen/human_kitchen_index.html",human_kitchen_big);


}

//**************************** MAIN LOOP *************************************
void draw()
{
  background(255);
  textFont(f,16);
  cursor(ARROW);
  
  x_axis.draw();
  x_axis.label();
  y_axis.draw();
  y_axis.label();
  
  tint(255,255);
  icons[0].display();  //*******************
  icons[1].display();
  icons[2].display();
  icons[3].display();
  icons[4].display();
  icons[5].display();
  icons[6].display();
  icons[7].display();
  icons[8].display();

  
  if(ScaleIconSwitch){
    scale_icons.display(25);
  }
  else{
    scale_icons.display(-25);
  }
  
  if(SpeedLinesSwitch){
    speed_lines.display(25);
  }
  else{
    speed_lines.display(-25);
  }
  
  tint(255,255);
  for(Object o: icons)
  {
    Icons I = (Icons) o;
    if(I.mouseOver(mouseX,mouseY))
    {
      cursor(HAND);
      I.popup();
    }
  }
}

//**************************** SCALE ICONS *************************************
class ScaleIcons{
  int alpha = 0;
  PImage time;
  
  ScaleIcons(){
    time = loadImage("icons/timescale.jpg");
    length = loadImage("icons/lengthscale.jpg");
  }
  
  void display(int _increment){
    alpha = alpha + _increment;
    if(alpha > 255) {alpha = 255;}
    if(alpha < 0) {alpha = 0;}
    tint(255,alpha);
    imageMode(CORNER);
    image(length,1,1);
    image(time,1,height-58);
  }
  
}

//**************************** SPEED LINES *************************************
class SpeedLines{
  int alpha = 0;
  PImage speedlines;
  
  SpeedLines(){
    speedlines = loadImage("icons/speedlines.png");
  }
  
  void display(int _increment){
    alpha = alpha + _increment;
    if(alpha > 255) {alpha = 255;}
    if(alpha < 0) {alpha = 0;}
    tint(255,alpha);
    imageMode(CORNER);
    image(speedlines,60,30);
  }
  
}

//**************************** X AXIS *************************************
class xAxis{
  String units;
  int ulimit, llimit, numticks;
  int [] labels;
  float [] label_pos;

  xAxis(String _units, int _llimit, int _ulimit, int _numticks){
    units = _units;
    llimit = _llimit;
    ulimit = _ulimit;
    numticks = _numticks;
    labels = new int[numticks];
    for(int i=0; i<numticks; i++){labels[i] = llimit+i;}
    label_pos = new float[numticks];
    for(int i=0; i<numticks; i++){label_pos[i] = 70 + i*((width-20-70)/(numticks-1));} 
  } 
  
  void draw(){
     stroke(200);
     strokeWeight(3);
     line(70,height-60,width-20,height-60);
     
     textFont(f,18);
     fill(150);
     textAlign(RIGHT,BASELINE);
     text(units,(width-90)/2+100,height-15);
  }
  
  void label(){
     textFont(f,14);
     fill(150);
     textAlign(RIGHT,TOP);
     for(int i=0; i<numticks; i+=2){
       textFont(f,14); fill(150); textAlign(RIGHT,TOP);
       text("10", label_pos[i], height-50);
       textFont(f,11); fill(150); textAlign(RIGHT,TOP);
       text(nf(labels[i],0), label_pos[i]+10, height-55);
     } 
  }
  
}

//**************************** Y AXIS *************************************
class yAxis{
  String units;
  int ulimit, llimit, numticks;
  int [] labels;
  float [] label_pos;

  yAxis(String _units, int _llimit, int _ulimit, int _numticks){
    units = _units;
    llimit = _llimit;
    ulimit = _ulimit;
    numticks = _numticks;
    labels = new int[numticks];
    for(int i=0; i<numticks; i++){labels[i] = llimit+i;}
    label_pos = new float[numticks];
    for(int i=0; i<numticks; i++){label_pos[i] = 30 + i*((height-70-30)/(numticks-1));}   
  } 
  
  void draw(){
     stroke(200);
     strokeWeight(3);
     line(60,30,60,height-70);
     
     textFont(f,18);
     fill(150);
     textAlign(CENTER);
     rotate(-PI/2);
     text(units,-((height-100)/2+20),20);
     rotate(PI/2);
     
  }
  
  void label(){
     textFont(f,14);
     fill(150);
     textAlign(RIGHT,TOP);
     for(int i=0; i<numticks; i+=2){
       textFont(f,14); fill(150); textAlign(RIGHT,TOP);
       text("10", 45, label_pos[i]);
       textFont(f,11); fill(150); textAlign(RIGHT,TOP);
       text(nf(labels[labels.length()-1-i],0), 55, label_pos[i]-5);
     }
  } 
  
}

//**************************** ICONS *************************************
class Icons{
  int pos_x, pos_y, size;
  String url="", label="";
  PShape icon_big;
  
  Icons(String _label, int _pos_x, int _pos_y, int[] _limits, int _size, String _url, PShape _icon_big){
    label = _label;
    axislimits = _limits;
    
    pos_x = (_pos_x-axislimits[0])/(axislimits[1]-axislimits[0])*(width-70-20)+70;  //convert from log(meters) to pixels
    pos_y = height - ((_pos_y-axislimits[2])/(axislimits[3]-axislimits[2])*(height-70-30)+70);
    
    size = _size;
    url = _url;
    icon_big = _icon_big;  
  }
  
  void display(){
    imageMode(CENTER);
    image(icon_big,pos_x,pos_y,50,50);  
  }
  
  void popup(){
    imageMode(CENTER);
    image(icon_big,pos_x,pos_y);
    textFont(f,14);
    fill(0);
    textAlign(LEFT,TOP);
    text(label, pos_x-35, pos_y-35);  
  }
  
   void mouseOver(int xo, int yo) { return xo<pos_x+size/2 && xo>pos_x-size/2 && yo<pos_y+size/2 && yo>pos_y-size/2; }

}

void mousePressed()
{
  for(Object o: icons)
  {
    Icons I = (Icons) o;
    if(I.mouseOver(mouseX,mouseY))
    {
      link(I.url);
    }
  }
}

void showScalesSwitch(){ ScaleIconSwitch = !ScaleIconSwitch; }

void showSpeedLines(){ SpeedLinesSwitch = !SpeedLinesSwitch; }
  


