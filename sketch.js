var game = new Phaser.Game(800, 600, Phaser.AUTO, "gameContainer", {preload: preload, create: create, update: update});

var playerASCII = [64, 64, 64, 64];
var playerName = ["_", "_", "_", "_"];
var currentChar = 0;
var nameDone = false;
var player;
var lost = false;
var score = 0, hiscore = 0;
var kickedA = false, kickedB = false;
var stoppedA = true, stoppedB = true;
var pressedS = false, pressedK = false, newScreen = false;
var GRAVITY = 40, JUMP = 950;
var dir, speed;
var gameScreen = 1;
var donkeyA, donkeyB, ball;
var soundHit;
var imgInit, imgField, imgOL;
var textvs, textvs2, textvs3, texvs4, textvs5, textvs6;

WebFontConfig = {
    active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },
    google: {
      families: ['Press+Start+2P']
    }
};

function restart(){
  score = 0;
  textvs5.text = "";
  textvs6.text = "";
  ball.position.x = 400;
  speed = 200;
  var r = game.rnd.frac();
  if(r < 0.5){
    dir = -1;
  }else{
    dir = 1;
  }
  lost = false;
  stoppedA = false;
}

function overlapDonkeyA(){
  donkeyA.loadTexture("donkeyAk");
  soundHit.play();
  kickedA = true;
  speed = game.rnd.integerInRange(250, 700);
  dir = 1;
  score += Math.floor((Math.random() * 100) + 1);
}

function overlapDonkeyB(){
  donkeyB.loadTexture("donkeyBk");
  soundHit.play();
  kickedB = true;
  speed = game.rnd.integerInRange(250, 700);
  dir = -1;
  score += Math.floor((Math.random() * 100) + 1);
}

function createText(){
  imgInit = game.add.sprite(6, 7, "titlescreen");
  textvs = game.add.text(90, 440, "press S or K\nto start");
  textvs.font = "Press Start 2P";
  textvs.fontSize = 25;
  textvs.align = "center";
  textvs.fill = "#FFA397";
  textvs.stroke = "#DD5257";
  textvs.strokeThickness = 8;
  imgOL = game.add.sprite(0, 0, "screenOverlay");
  soundHit = game.add.audio("ballHit");
}

function preload() {
  game.load.crossOrigin = "Anonymous";
  game.load.image("titlescreen", "assets/titlescreen.png");
  game.load.image("field", "assets/field.png");
  game.load.image("screenOverlay", "assets/screenoverlay.png");
  game.load.image("ball", "assets/ball.png");
  game.load.image("donkeyA", "assets/donkeyA.png");
  game.load.image("donkeyB", "assets/donkeyB.png");
  game.load.image("donkeyAk", "assets/donkeyAk.png");
  game.load.image("donkeyBk", "assets/donkeyBk.png");
  game.load.audio("ballHit", ["assets/ballHit.mp3", "assets/ballHit.ogg"]);
  game.load.script("webfont", "//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js");
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = "#71F3FF";
}

function update () {
  switch(gameScreen){
    case 1:
      if (game.input.keyboard.isDown(Phaser.Keyboard.S) || game.input.keyboard.isDown(Phaser.Keyboard.K))
      {stoppedA = true;
        newScreen = true;
        pressedS = true;
        pressedK = true;
        gameScreen = 2;
      }
      break;
    case 2:
      if(newScreen){
        newScreen = false;
        textvs.destroy();
        imgInit.destroy();
        textvs = game.add.text(400, 140, "Enter player name:");
        textvs.anchor.setTo(0.5, 0.5);
        textvs.font = "Press Start 2P";
        textvs.fontSize = 25;
        textvs.align = "center";
        textvs.fill = "#FFA397";
        textvs.stroke = "#DD5257";
        textvs.strokeThickness = 8;
        textvs2 = game.add.text(400, 295, playerName[0] + " " + playerName[1] + " " + playerName[2] + " " + playerName[3]);
        textvs2.anchor.setTo(0.5, 0.5);
        textvs2.font = "Press Start 2P";
        textvs2.fontSize = 50;
        textvs2.align = "center";
        textvs2.fill = "#5FFFFD";
        textvs2.stroke = "#00B9B5";
        textvs2.strokeThickness = 8;
        textvs3 = game.add.text(400, 460,"press S to choose a letter\npress K to go to next letter");
        textvs3.anchor.setTo(0.5, 0.5);
        textvs3.font = "Press Start 2P";
        textvs3.fontSize = 25;
        textvs3.align = "center";
        textvs3.fill = "#FFA397";
        textvs3.stroke = "#DD5257";
        textvs3.strokeThickness = 8;
      }
      if(game.input.keyboard.isDown(Phaser.Keyboard.S) && !pressedS){
        pressedS = true;
        if(nameDone){
          nameDone = false;
          currentChar = 0;
        } else{
          playerASCII[currentChar]++;
          if(playerASCII[currentChar] === 91){
            playerASCII[currentChar] = 65;
          }
          playerName[currentChar] = String.fromCharCode(playerASCII[currentChar]);
        }
      }else if(!game.input.keyboard.isDown(Phaser.Keyboard.S)){
        pressedS = false;
      }
      if(game.input.keyboard.isDown(Phaser.Keyboard.K) && !pressedK){
        pressedK = true;
        if(nameDone){
          gameScreen = 3;
          newScreen = true;
          speed = 200;
          for(var i = 0; i < playerName.length; i++){
            if(playerName[i] === "_")
              playerName[i] = "";
          }
          player = playerName[0] + playerName[1] + playerName[2] + playerName[3];
        } else{
          if(currentChar < 3){
            currentChar++;
          }else{
            nameDone = true;
          }
        }
      } else if(!game.input.keyboard.isDown(Phaser.Keyboard.K)){
        pressedK = false;
      }
      game.stage.backgroundColor = "#222527";
      if(!nameDone){
        if(currentChar === 3){
          textvs3.text = "press S to choose a letter\npress K to continue";
        } else{
          textvs3.text = "press S to choose a letter\npress K to go to next letter";
        }
      } else{
        textvs3.text = "press S to change name\npress K to go to play";
      }
      textvs2.text = playerName[0] + " " + playerName[1] + " " + playerName[2] + " " + playerName[3];
      break;
    case 3:
      if(newScreen){
        newScreen = false;
        pressedS = false;
        pressedK = false;
        textvs.destroy();
        textvs2.destroy();
        textvs3.destroy();
        imgOL.destroy();
        imgField = game.add.sprite(0, 0, "field");
        textvs = game.add.text(90, 40, "HIGH SCORE");
        textvs.font = "Press Start 2P";
        textvs.fontSize = 25;
        textvs.align = "center";
        textvs.fill = "#FFA397";
        textvs.stroke = "#DD5257";
        textvs.strokeThickness = 8;
        textvs2 = game.add.text(580, 65, player);
        textvs2.anchor.setTo(0.5, 0.5);
        textvs2.font = "Press Start 2P";
        textvs2.fontSize = 25;
        textvs2.align = "center";
        textvs2.fill = "#5FFFFD";
        textvs2.stroke = "#00B9B5";
        textvs2.strokeThickness = 8;
        textvs3 = game.add.text(70, 90, "" + hiscore);
        textvs3.font = "Press Start 2P";
        textvs3.fontSize = 35;
        textvs3.align = "center";
        textvs3.fill = "#C0FF86";
        textvs3.stroke = "#6BFF00";
        textvs3.strokeThickness = 8;
        textvs4 = game.add.text(450, 90, "" + score);
        textvs4.font = "Press Start 2P";
        textvs4.fontSize = 35;
        textvs4.align = "center";
        textvs4.fill = "#C0FF86";
        textvs4.stroke = "#6BFF00";
        textvs4.strokeThickness = 8;
        donkeyA = game.add.sprite(120, 460, "donkeyA");
        donkeyA.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(donkeyA);
        donkeyA.body.setSize(10, 50, 45, 30);
        donkeyB = game.add.sprite(680, 460, "donkeyB");
        donkeyB.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(donkeyB);
        donkeyB.body.setSize(10, 50, -45, 30);
        ball = game.add.sprite(400, 300, "ball");
        ball.anchor.setTo(0.5, 0,5);
        game.physics.arcade.enable(ball);
        textvs5 = game.add.text(400, 280, "");
        textvs5.anchor.setTo(0.5, 0.5);
        textvs5.font = "Press Start 2P";
        textvs5.fontSize = 50;
        textvs5.align = "center";
        textvs5.fill = "#FFA397";
        textvs5.stroke = "#DD5257";
        textvs5.strokeThickness = 8;
        textvs6 = game.add.text(400, 330, "");
        textvs6.anchor.setTo(0.5, 0.5);
        textvs6.font = "Press Start 2P";
        textvs6.fontSize = 25;
        textvs6.align = "center";
        textvs6.fill = "#FFA397";
        textvs6.stroke = "#DD5257";
        textvs6.strokeThickness = 8;
        imgOL = game.add.sprite(0, 0, "screenOverlay");
        var r = game.rnd.frac();
        if(r < 0.5){
          dir = -1;
        }else{
          dir = 1;
        }
      }
      if(donkeyA.y >= 460){
        donkeyA.body.velocity.y = 0;
        stoppedA = true;
      }else{
        donkeyA.body.velocity.y += GRAVITY;
      }
      if(donkeyB.y >= 460){
        donkeyB.body.velocity.y = 0;
        stoppedB = true;
      }else{
        donkeyB.body.velocity.y += GRAVITY;
      }
      if(game.input.keyboard.isDown(Phaser.Keyboard.S)){
        if(!lost && stoppedA){
          donkeyA.body.velocity.y = -JUMP;
          stoppedA = false;
          pressedS = true;
        }
      } else{
        pressedS = false;
      }
      if(game.input.keyboard.isDown(Phaser.Keyboard.K)){
        if(!lost && stoppedB){
          donkeyB.body.velocity.y = -JUMP;
          stoppedB = false;
          pressedK = true;
        }
      } else{
        pressedK = false;
      }
      game.physics.arcade.overlap(ball, donkeyA, overlapDonkeyA, null, this);
      game.physics.arcade.overlap(ball, donkeyB, overlapDonkeyB, null, this);
      if(ball.x > 786 || ball.x < 16){
        lost = true;
        speed = 0;
        ball.x = 850;
      }
      if(lost){
        textvs5.text = "GAME OVER";
        textvs6.text = "press S or K to restart";
        if(game.input.keyboard.isDown(Phaser.Keyboard.K) || game.input.keyboard.isDown(Phaser.Keyboard.S)){
          if(!pressedS  && !pressedK){
            pressedS = true;
            pressedK = true;
            restart();
          }
        }
      }
      if(donkeyA.y > 300 && kickedA){
        donkeyA.loadTexture("donkeyA");
        kickedA = false;
      }
      if(donkeyB.y > 300 && kickedB){
        donkeyB.loadTexture("donkeyB");
        kickedB = false;
      }
      ball.body.velocity.x = speed * dir;
      ball.y = Math.sin((ball.x + 400) * 0.006) * 30 + 280;
      if(score >= hiscore){
        hiscore = score;
      }
      var hiText = hiscore.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')
      textvs3.text = "" + hiText;
      //textvs3.text = "" + pressedS;
      var loText = score.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,');
      textvs4.text = "" + loText;
      //textvs4.text = "" + pressedK;
      //game.debug.body(donkeyA);
      //game.debug.body(donkeyB);
      break;
    default:
      break;
  }
}
