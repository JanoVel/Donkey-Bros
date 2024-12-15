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
var textvs, textvs2, textvs3, texvs4, textvs5, textvs6, textBM;

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
  donkeyA.loadTexture("donkey_k");
  soundHit.play();
  kickedA = true;
  speed = game.rnd.integerInRange(250, 700);
  dir = 1;
  score += Math.floor((Math.random() * 100) + 1);
}

function overlapDonkeyB(){
  donkeyB.loadTexture("donkey_k");
  soundHit.play();
  kickedB = true;
  speed = game.rnd.integerInRange(250, 700);
  dir = -1;
  score += Math.floor((Math.random() * 100) + 1);
}

function createText(){
  game.stage.backgroundColor = "#71F3FF";
  imgInit = game.add.sprite(6, 7, "titlescreen");
  // Create a bitmap text object 
  textvs = game.add.bitmapText(50, 450, 'PressStart2P', 'press S or K\n  to start');
  // Apply a tint to the bitmap text
  textvs.tint = 0xdd5555;
  soundHit = game.add.audio("ballHit");
}

function preload() {
  game.load.crossOrigin = "Anonymous";
  game.load.image("titlescreen", "assets/titlescreen.png");
  game.load.image("field", "assets/field.png");
  game.load.image("ball", "assets/ball.png");
  game.load.image("donkey", "assets/donkey.png");
  game.load.image("donkey_k", "assets/donkey_k.png");
  game.load.audio("ballHit", ["assets/ballHit.mp3", "assets/ballHit.ogg"]);
  game.load.bitmapFont('PressStart2P', 'assets/fonts/PressStart2P.png', 'assets/fonts/PressStart2P.xml');
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = "#222527";
  createText();
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
        textvs = game.add.bitmapText(128, 128, 'PressStart2P', 'Enter player name');
        textvs.tint = 0xff7979;
        //textvs.fill = "#FFA397";
        //textvs.stroke = "#DD5257";
        textvs2 = game.add.bitmapText(220, 280, 'PressStart2P', playerName[0] + " " + playerName[1] + " " + playerName[2] + " " + playerName[3], 50);
        textvs2.tint = 0x5ffffD;
        //textvs2.fill = "#5FFFFD";
        //textvs2.stroke = "#00B9B5";
        textvs3 = game.add.bitmapText(62, 440, 'PressStart2P', ' press S to choose a letter\npress K to go to next letter', 24);
        textvs3.tint = 0xff7979;
        //textvs3.fill = "#FFA397";
        //textvs3.stroke = "#DD5257";
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
          textvs3.text = " press S to choose a letter\n     press K to continue";
        } else{
          textvs3.text = " press S to choose a letter\npress K to go to next letter";
        }
      } else{
        textvs3.text = "   press S to change name\n      press K to play";
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
        //imgOL.destroy();
        // Text
        imgField = game.add.sprite(0, 0, "field");
        textvs = game.add.bitmapText(96, 48, 'PressStart2P', 'HIGH SCORE', 24);
        textvs.tint = 0xff7979;
        textvs2 = game.add.bitmapText(540, 48, 'PressStart2P', player, 24);
        textvs2.tint = 0x5ffffd;
        textvs3 = game.add.bitmapText(96, 96, 'PressStart2P', "" + hiscore);
        textvs3.tint = 0xc0ff86;
        //textBM.tint = 0x6bff00;
        textvs4 = game.add.bitmapText(450, 96, 'PressStart2P', "" + score);
        textvs4.tint = 0xc0ff86;
        // Sprites
        donkeyA = game.add.sprite(120, 460, "donkey");
        donkeyA.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(donkeyA);
        donkeyA.body.setSize(10, 50, 45, 30);
        donkeyB = game.add.sprite(680, 460, "donkey");
        donkeyB.anchor.setTo(0.5, 0.5);
        donkeyB.scale.setTo(-1, 1);
        game.physics.arcade.enable(donkeyB);
        donkeyB.body.setSize(10, 50, -45, 30);
        ball = game.add.sprite(400, 300, "ball");
        ball.anchor.setTo(0.5, 0,5);
        game.physics.arcade.enable(ball);
        // Game Over text
        textvs5 = game.add.bitmapText(170, 280, 'PressStart2P', '', 50);
        textvs5.tint = 0xff7979;
        textvs6 = game.add.bitmapText(100, 350, 'PressStart2P', '', 26);
        textvs6.tint = 0xff7979;
        // Random start direction
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
        donkeyA.loadTexture("donkey");
        kickedA = false;
      }
      if(donkeyB.y > 300 && kickedB){
        donkeyB.loadTexture("donkey");
        kickedB = false;
      }
      ball.body.velocity.x = speed * dir;
      ball.y = Math.sin((ball.x + 400) * 0.006) * 30 + 280;
      if(score >= hiscore){
        hiscore = score;
      }
      var hiText = hiscore.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')
      textvs3.text = "" + hiText;
      var loText = score.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,');
      textvs4.text = "" + loText;
      break;
    default:
      break;
  }
}
