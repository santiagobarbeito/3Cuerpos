let system;
var fuerza_gravedad=1/10;
var colorgeneral=0;
let dr, dg, db;
let distnaciaMaxima;

let carrier; // este es el oscilador que escucharemos, la portadora
let modulator; // este oscilador modulará la frecuencia de la portadora
let reverb;
let analyzer; // lo usaremos para visualizar la forma de onda

// la frecuencia de la portadora antes de ser modulada
let carrierBaseFreq = 165;

// rangos mínimo y máximo para la modulante
let modMaxFreq = 112;
let modMinFreq = 0;
let modMaxDepth = 300;
let modMinDepth = -300;

function setup() {
  let cnv=createCanvas(windowWidth, windowHeight);
  system = new ParticleSystem(createVector(width / 2, height/2));
  system.addParticle(false);
  system.addParticle(false);
  system.addParticle(false);
  system.addParticle(true);
  distanciaMaxima=dist(width,height, width/2, height/2);
  
  // audio
  carrier = new p5.Oscillator('sine');
  carrier.amp(0.25); // definir la amplitud
  carrier.freq(carrierBaseFreq); // definir la frecuencia
  carrier.start(); // empezar a oscilar

  // prueba a cambiar el tipo a 'square', 'sine' or 'triangle'
  modulator1 = new p5.Oscillator('sine');
  modulator1.start();
   modulator2 = new p5.Oscillator('sine');
  modulator2.start();
   modulator3 = new p5.Oscillator('sine');
  modulator3.start();

  // suma la salida de la modulante para modular la frecuencia de la portadora
  modulator1.disconnect();
  carrier.freq(modulator1);
  modulator2.disconnect();
  carrier.freq(modulator2);
  modulator3.disconnect();
  carrier.freq(modulator3);
  //inicia la reverb
  reverb=new p5.Reverb();
  reverb.process(carrier, 6, 0.2);
  reverb.amp(1);
  //inicia el delay
  //delay = new p5.Delay();
  //delay.process(carrier, 0.12, 0.7, 2300);
  //delay.setType('pingPong'); // un tipo de efecto stereo

}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
function draw() {
  background(0,0,0);
  system.run();
  let modFreq = map((system.particles[0].radio-0.04*height)/(0.1*height-0.04*height), 1, 0, carrierBaseFreq*1.5, carrierBaseFreq*2.5);
  modulator1.freq(modFreq);

  let modDepth = map(dr, 0, 1, modMinDepth, modMaxDepth);
  modulator1.amp(modDepth);
  
  modFreq = map((system.particles[1].radio-0.04*height)/(0.1*height-0.04*height), 1, 0, carrierBaseFreq/1.5, carrierBaseFreq/2.5);
  modulator2.freq(modFreq);

  modDepth = map(dg, 0, 1, modMinDepth, modMaxDepth);
  modulator2.amp(modDepth);
  
  modFreq = map((system.particles[2].radio-0.04*height)/(0.1*height-0.04*height), 1, 0, carrierBaseFreq*2.5, carrierBaseFreq*3.5);
  modulator3.freq(modFreq);

  modDepth = map(db, 0, 1, modMinDepth, modMaxDepth);
  modulator3.amp(modDepth);

}
// Una clase simple de partícula (Particle)
let Particle = function(isCenter) {
  this.centro=(isCenter==false);
  if (this.centro==true){
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(random(-1,1),random(-1,1));
    this.position = createVector(random(0,1)*width, random(0,1)*height);
    this.lifespan = 3000;
    this.radio = random (0.04*height,0.1*height);
    this.color = colorgeneral;
    colorgeneral=colorgeneral+1;
    this.nuevoradio = this.radio;
    this.creciendo = 0;
  }
  else{
    this.velocity=(createVector(0,0));
    this.acceleration=(createVector(0,0));
    this.position = createVector(width/2, height/2);
    this.radio=0.25*height;
    this.color = 3;
    colorgeneral=0;
  }
}

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// Método para refrescar posición
Particle.prototype.update = function(){
  this.velocity.add(this.acceleration);
  if(this.position.x < 0 || this.position.x > width){
    this.velocity.x*=1;    
  }
  if(this.position.y < 0 || this.position.y > height){
    this.velocity.y*=1;
  }
  this.position.add(this.velocity);
  this.lifespan -= 2
  if (this.lifespan<=0){
    this.lifespan=300;
  };
};

// Método para mostrar en lienzo
Particle.prototype.display = function() {
  stroke(200);
  strokeWeight(2);
  if(this.color==0){
    stroke(0,0,0,0);
    fill(255,0,0,200);
  }
  if(this.color==1){
    stroke(0,0,0,0);
    fill(0,255,0,200);
  }
  if(this.color==2){
    stroke(0,0,0,0);
    fill(0,0,255,200);
  }
  if (this.color==3){
    
    fill ((1-dr)*(system.particles[0].radio/(0.1*height))*255,(1-dg)*(system.particles[1].radio/(0.1*height))*255,(1-db)*(system.particles[2].radio/(0.1*height))*255,155);
    stroke (0,0,0,0);
  }
  ellipse(this.position.x, this.position.y, this.radio, this.radio);
  if (this.centro==true){
    if (this.creciendo==0){
      if (this.radio>=this.nuevoradio){
        this.nuevoradio=random (0.04*height,0.1*height);
        if (this.nuevoradio>this.radio){
          this.creciendo=0;
        }
        if (this.nuevoradio<=this.radio){
          this.creciendo=1;
        }
        if (this.nuevoradio==this.radio){
          this.nuevoradio=random (0.04*height,0.1*height);
        }
      }
      if (this.radio<this.nuevoradio){
        this.radio=this.radio+0.001*this.radio;
      }
    }
    if (this.creciendo==1){
      if (this.radio<=this.nuevoradio){
        this.nuevoradio=random (0.04*height,0.1*height);
        if (this.nuevoradio>this.radio){
          this.creciendo=0;
        }
        if (this.nuevoradio<this.radio){
          this.creciendo=1;
        }
        if (this.nuevoradio==this.radio){
          this.nuevoradio=random (0.04*height,0.1*height);
        }
      }
      if (this.radio>this.nuevoradio){
        this.radio=this.radio-0.001*this.radio;
      }
    }
  }
};

let ParticleSystem = function(position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function(isCenter) {
  this.particles.push(new Particle(isCenter));
};

ParticleSystem.prototype.dropParticle = function() {
  this.particles.pop();
};

ParticleSystem.prototype.run = function() {
  for (let i = this.particles.length-1; i >= 0; i--) {
    let p1 = this.particles[i];
    p1.acceleration=createVector(0,0);
    for (let j = this.particles.length-1; j >= 0; j--) {
      let p2=this.particles[j];
      if (p1.centro==true){
   if(p1.color==0){
    dr = dist(p1.position.x, p1.position.y, this.particles[3].position.x,this.particles[3].position.x)/distanciaMaxima;
    stroke(255,0,0,p1.radio/(0.1*height)*255);
  }
  if(p1.color==1){
    dg = dist(p1.position.x, p1.position.y, this.particles[3].position.x,this.particles[3].position.x)/distanciaMaxima;
    stroke(0,255,0,p1.radio/(0.1*height)*255);
  }
  if(p1.color==2){
    db = dist(p1.position.x, p1.position.y, this.particles[3].position.x,this.particles[3].position.x)/distanciaMaxima;
    stroke(0,0,255,p1.radio/(0.1*height)*255);
  }
  if (p1.color==3){
    stroke(0,0,0,0);
  }
     // line(p1.position.x, p1.position.y, p2.position.x,p2.position.y);
p1.acceleration.add(createVector(fuerza_gravedad*(p2.radio*p1.radio/250)*
(p2.position.x-p1.position.x)/((p2.position.x-p1.position.x)**2+(p2.position.y-p1.position.y)**2), fuerza_gravedad*(p2.radio*p1.radio/250)*(p2.position.y-p1.position.y)/((p2.position.x-p1.position.x)**2+(p2.position.y-p1.position.y)**2)));
      }
    }
      if (p1.centro==false){
        p1.position=createVector(width/2,height/2);
      }
    p1.run();
  }
};

function mousePressed() {
  system.dropParticle();
   system.dropParticle();
   system.dropParticle();
  system.dropParticle();
  system.addParticle(false);
  system.addParticle(false);
  system.addParticle(false);
  system.addParticle(true);
}

// función de ayuda para prender y apagar el sonido
function toggleAudio(cnv) {
  cnv.mouseOver(function() {
    carrier.amp(1.0, 0.01);
  });
  cnv.touchStarted(function() {
    carrier.amp(1.0, 0.01);
  });
  cnv.mouseOut(function() {
    carrier.amp(0.0, 1.0);
  });
}