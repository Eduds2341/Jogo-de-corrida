var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player,game;
var playerCount = 0;
var gameState = 0;
var carImg1
var carImg2
var track
var car1,car2,cars=[]
var allPlayers

var fuel,fuelImg
var Coins,coinsImg

var obs1,obs2,obstacles

var lifeImg

var blastImg

function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  carImg1=loadImage("./assets/car1.png");
  carImg2=loadImage("./assets/car2.png");
  track=loadImage("./assets/PISTA.png");
  obs1=loadImage("./assets/obstacle1.png");
  obs2=loadImage("./assets/obstacle2.png");
  lifeImg=loadImage("./assets/life.png");
  blastImg = loadImage9("./assets/blast.png")
  

  fuelImg=loadImage("./assets/fuel.png");
  coinsImg=loadImage("./assets/goldCoin.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();

}

function draw() {
  background(backgroundImage);
  if (playerCount==2) {
    game.updateState(1)
  }
  if (gameState==1) {
    game.play()
  }
  if (gameState==2) {
    game.end()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
