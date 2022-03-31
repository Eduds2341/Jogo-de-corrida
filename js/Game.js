class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("")
    this.leaderBoardTitle = createElement("h2")
    this.leader1 = createElement("h2")
    this.leader2 = createElement("h2")
    this.playerMoving = false
    this.leftKeyActive = false
    this.blast = false
  }
  getState(){
    var getStateRef = database.ref("gameState")
    getStateRef.on("value", function(data){
      gameState = data.val();
    })
  }
  updateState(state){
    database.ref("/").update({
      gameState: state
    })
  }
  start() {
    form = new Form();
    form.display();
    player = new Player();
    playerCount = player.getPlayerCount();
    car1 = createSprite(width/2-50,height-100)
    car1.addImage("car1",carImg1)
    car1.addImage("blast",blastImg)
    car1.scale=0.07
    car2 = createSprite(width/2+100,height-100)
    car2.addImage("car2",carImg2)
    car2.addImage("blast",blastImg)
    car2.scale=0.07
    cars=[car1,car2]
    fuel = new Group();
    Coins = new Group();

    obstacles = new Group();

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obs2 },
      { x: width / 2 - 150, y: height - 1300, image: obs1 },
      { x: width / 2 + 250, y: height - 1800, image: obs1 },
      { x: width / 2 - 180, y: height - 2300, image: obs2 },
      { x: width / 2, y: height - 2800, image: obs2 },
      { x: width / 2 - 180, y: height - 3300, image: obs1 },
      { x: width / 2 + 180, y: height - 3300, image: obs2 },
      { x: width / 2 + 250, y: height - 3800, image: obs2 },
      { x: width / 2 - 150, y: height - 4300, image: obs1 },
      { x: width / 2 + 250, y: height - 4800, image: obs2 },
      { x: width / 2, y: height - 5300, image: obs1 },
      { x: width / 2 - 180, y: height - 5500, image: obs2 }
    ];


    this.addSprites(fuel,4,fuelImg,0.02);
    this.addSprites(Coins,18,coinsImg,0.09);
    this.addSprites(obstacles,obstaclesPositions.length,obs1,0.04,obstaclesPositions)
  }
  addSprites(spriteGroup,numberOfSprites,spriteImg,scale,positions=[])
  {
    for (let i = 0; i < numberOfSprites; i++) {
      var x,y 
      if (positions.length>0) {
        x=positions[i].x;
        y=positions[i].y;
        spriteImg=positions[i].image;

      } else {
        x = random(width/2 + 150,width/2 - 150);
        y = random(-height*4.5,height-400);
      }
      var sprite = createSprite(x,y);
      sprite.addImage(spriteImg);
      sprite.scale=scale;
      spriteGroup.add(sprite);

    }
  }
  handleElements(){
    form.hide()
    form.titleImg.position(40,50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("reiniciar jogo")
    this.resetTitle.position(width/2 + 200,40)
    this.resetTitle.class("resetText")
    
    this.resetButton.position(width/2 + 230,100)
    this.resetButton.class("resetButton")

    this.leaderBoardTitle.html("Placar");
    this.leaderBoardTitle.position(width/3 - 60,40)
    this.leaderBoardTitle.class("resetText")

    this.leader1.position(width/3 - 50,80);
    this.leader1.class("leadersText");
    
    this.leader2.position(width/3 - 50,130);
    this.leader2.class("leadersText");
    
  }
  play(){
    this.handleElements()
    this.handleResetButton()
    Player.getPlayerInfo()
    player.getCarsAtTheEnd()
    if (allPlayers!==undefined) {
      image(track,0,-height*5,width,height*6)
      this.showLeaderBoard()
      this.showLife()
      this.showFuelBar()

      var index=0
      for (var plr  in allPlayers) {
       index++
       var x = allPlayers[plr].positionX;
       var y = height-allPlayers[plr].positionY;
       var currentlife = allPlayers[plr].life
       if (currentlife<=0) {
         cars[index-1].changeImage("blast")
         cars[index-1].scale = 0.3
       }
       cars[index-1].position.x = x
       cars[index-1].position.y = y
       
       if (index==player.index) {
         fill ("red")
         ellipse(x,y,60,60)
          this.handleFuel(index)
          this.handlePowerCoins(index)
          this.handleObstaclesCollision(index)
          this.handleCollisionCars(index)
          if (player.life<=0) {
            this.blast = true
            this.playerMoving = false
          }
         //camera.position.x=cars[index-1].position.x;
         camera.position.y=cars[index-1].position.y
       }
      }
      this.handlePlayerControls()
      const finishLine = height*6-100
      if (player.positionY>finishLine){
        gameState = 2
        player.rank++
        Player.updateCarsAtEnd(player.rank)
        player.update()
        this.showRank()
      }
      if (this.playerMoving) {
        player.positionY+=5
        player.update()
      }
      drawSprites()
    }
  }
  handlePlayerControls()
  {
    if (!this.blast) {


      if (keyIsDown(UP_ARROW)) {
        player.positionY += 10
        player.update()
        this.playerMoving = true
      }
      if (keyIsDown(LEFT_ARROW)) {
        player.positionX -= 5
        this.leftKeyActive = true
        player.update()
      }
      if (keyIsDown(RIGHT_ARROW)) {
        player.positionX += 5
        this.leftKeyActive = false
        player.update()
      }
    } 
  }
  showLeaderBoard()
  {
    var leader1,leader2
    var players = Object.values(allPlayers)
    if ((players[0].rank==0&&players[1].rank==0)||players[0].rank==1) {
      leader1 = players[0].rank +"&emsp;"+players[0].name +"&emsp;"+players[0].score
      leader2 = players[1].rank +"&emsp;"+players[1].name +"&emsp;"+players[1].score
      
    }
    if (players[1].rank==1) {
      leader2 = players[0].rank +"&emsp;"+players[0].name +"&emsp;"+players[0].score
      leader1 = players[1].rank +"&emsp;"+players[1].name +"&emsp;"+players[1].score
    }
    this.leader1.html(leader1)
    this.leader2.html(leader2)
  }
  handleResetButton()
  {
    this.resetButton.mousePressed(()=>{
      database.ref("/").set({
        gameState:0,
        playerCount:0,
        carsAtEnd:0,
        players:{}

      })
      window.location.reload()

    })
  }
  handleFuel(index)
  {
    cars[index-1].overlap(fuel,function(collector,collected){
      player.fuel=185
      collected.remove()
    })
    if (player.fuel>0&&this.playerMoving) {
      player.fuel-=0.3
    }
    if (player.fuel<=0) {
      gameState=2
      this.gameOver()
    }
  }
  handlePowerCoins(index)
  {
    cars[index-1].overlap(Coins,function(collector,collected){
      player.score+=21
      player.update()
      collected.remove()
    })
  }
  showRank()
  {
    swal({
      title: `Incrível!${"\n"}Rank${"\n"}${player.rank}`,
      text: "Você alcançou a linha de chegada com sucesso!",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    })
  }
  gameOver() {
    swal({
      title: `Fim de Jogo`,
      text: "Puutz você perdeu a corrida :( ",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Obrigado por jogar"
    });
  }
  showLife()
  {
    push()
    image(lifeImg,width/2-130,height-player.positionY-250,20,20)
    fill ("white")
    rect(width/2-100,height-player.positionY-250,185,20)
    fill ("red")
    rect(width/2-100,height-player.positionY-250,player.life,20)
    pop()
  }
  showFuelBar()
  {
    push()
    image(fuelImg,width/2-130,height-player.positionY-200,20,20)
    fill ("white")
    rect(width/2-100,height-player.positionY-200,185,20)
    fill ("yellow")
    rect(width/2-100,height-player.positionY-200,player.fuel,20)
    pop()
  }
  handleObstaclesCollision(index)
  {
    if (cars[index-1].collide(obstacles)) {
      if (this.leftKeyActive) {
        player.positionX+=100
      }
      else{
        player.positionX-=100
      }
      if (player.life>0) {
        player.life-=185/4
      }
      player.update()
    }
  }
  handleCollisionCars(index)
  {
    if (index == 1) {
      if (cars[index-1].collide(cars[1])) {
        if (this.leftKeyActive) {
          player.positionX+=100
        }
        else{
          player.positionX-=100
        }
        if (player.life>0) {
          player.life-=185/4
        }
        player.update()
      }
    }
    if (index == 2) {
      if (cars[index-1].collide(cars[0])) {
        if (this.leftKeyActive) {
          player.positionX+=100
        }
        else{
          player.positionX-=100
        }
        if (player.life>0) {
          player.life-=185/4
        }
        player.update()
      }
    }
  }
  end()
  {
    console.log("gameOver")
  }
}
