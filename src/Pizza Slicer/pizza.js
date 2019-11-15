var game;
var gameOptions = {
	pans: 6,
	maxPanValue: 12,
	panSize: 150,
	verticalPanSpace: 47.5,
	horizontalPanSpace: 87.5,
	layout: {
		rows: 3,
		cols: 3
	},
	sliceSize: 140,
	panFractionSize: 120,
	tweenSpeed: 100,
	localStorageName: "highScorePizzaSlicer"
}
window.onload = function() {
	var gameConfig = {
		width: (gameOptions.panSize * (gameOptions.pans / 2)) + (gameOptions.horizontalPanSpace * ((gameOptions.pans / 2) + 1)),		//800
		height: (gameOptions.panSize * (gameOptions.pans / 2)) + (gameOptions.verticalPanSpace * ((gameOptions.pans / 2) + 1)),			//640
		backgroundColor: 0x454342,
		debug: true,
		physics: {
			default: "arcade",
			arcade: {
				debug: false
			}
		},
		scene: [bootGame, mainMenu, playGame, gameOver]
	}
	game = new Phaser.Game(gameConfig);
	window.focus();
	resizeGame();
	window.addEventListener("resize", resizeGame);
}

/*
Nick Bobich
Notes: Boot Game scene handles the preloading of all sprites as the game begins to start up. 
Last Updated: 11-14-19 by Nick
*/
class bootGame extends Phaser.Scene {
	constructor() {
		super("BootGame");
	}
	preload() {
		this.load.image("playButton", "assets/sprites/playgame.png");
		this.load.image("quizButton", "assets/sprites/quiz.png");
		this.load.image("howButton", "assets/sprites/howtoplay.png");
		this.load.image("background", "assets/sprites/background.png");

		this.load.image("logo", "assets/sprites/logo.png");
		this.load.image("homeButton", "assets/sprites/home.png");
		this.load.image("restartButton", "assets/sprites/restart.png");
		this.load.image("score", "assets/sprites/score.png");
		this.load.image("highScore", "assets/sprites/highScore.png");

		this.load.image("pan", "assets/sprites/pan.png");
		this.load.image("underline", "assets/sprites/underline.png");
		this.load.spritesheet("slices", "assets/sprites/sliceSprite.png", {
			frameWidth: gameOptions.sliceSize,
			frameHeight: gameOptions.sliceSize
		});
		this.load.spritesheet("fractions", "assets/sprites/fractionSprite.png", {
			frameWidth: 60,
			frameHeight: 60
		});
		this.load.bitmapFont("font", "assets/fonts/font.png", "assets/fonts/font.fnt");
		this.load.audio("grow", ["assets/sounds/grow.ogg", "assets/sounds/grow.mp3"]);

		this.load.spritesheet("panFractions", "assets/sprites/panFractions.png", {
			frameWidth: gameOptions.panFractionSize,
			frameHeight: gameOptions.panFractionSize
		});

		this.load.image("backgroundGameOver", "assets/sprites/backgroundGameOver.png");
		this.load.image("gameOver", "assets/sprites/gameOver.png");
		this.load.image("scoreBackground", "assets/sprites/scoreBackGround.png");
		this.load.image("takeQuiz", "assets/sprites/takeQuizButton.png");
		this.load.bitmapFont("bigFont", "assets/fonts/bigFont.png", "assets/fonts/bigFont.fnt");
	}
	create() {
		this.scene.start("MainMenu");
	}
}//End of Boot Game class

/*
Megan Solomon
Notes: Main Menu scene contains the menu with a play game button to start the game, a quiz button, which is a 
link to an HTML page with a quiz, and a How to Play button which opens an instruction scene.
Last Updated: 11-14-19 by Nick
*/
class mainMenu extends Phaser.Scene {
	constructor() {
		super("MainMenu");
	}

	create() {
		var background = this.add.image(400, 320, "background");
		var playButtonXY = this.getObjectPosition(1.3, 1), quizButtonXY = this.getObjectPosition(1.7, 1), howButtonXY = this.getObjectPosition(2.1, 1);
		var playButton = this.add.sprite(playButtonXY.x, playButtonXY.y, "playButton");					//398.875, 412.925
		playButton.setInteractive();
		var quizButton = this.add.sprite(quizButtonXY.x, quizButtonXY.y, "quizButton");					//398.875, 491.925
		quizButton.setInteractive();
		var howButton = this.add.sprite(howButtonXY.x, howButtonXY.y, "howButton");							//398.875, 570.925
		howButton.setInteractive();
		
		playButton.on("pointerdown", function() {
			this.scene.start("PlayGame")
		}, this);
		quizButton.on("pointerdown", function() {
			window.location.href="quiz.html"
		});
		howButton.on("pointerdown", function() {
			window.location.href="howTo.html"
		});
	}

	/*
	Nick Bobich
	Notes: This function returns a point in 2D space of a game object. All measurements are based on panSize.
	Last Updated: 10-21-19 by Nick
	*/
	getObjectPosition(row, col) {
		var posX = gameOptions.panSize * (col + 1) + gameOptions.horizontalPanSpace * (col + 0.13);			//150 * (0 + 1) + 87.5 * (0 + 0.13)
    var posY = gameOptions.panSize * (row + 1) + gameOptions.verticalPanSpace * (row + 0.13);				//150 * (0 + 1) + 47.5 * (0 + 0.13)
    return new Phaser.Geom.Point(posX, posY);
	}
}//End of Main Menu class

/*
Nick Bobich/Megan Solomon/Andrejs Tomsons
Notes: Play Game scene contains all game functionality.
Last Updated: 11-14-19 by Nick/Megan
*/
class playGame extends Phaser.Scene {
	constructor() {
		super("PlayGame");
	}

	create() {
		var logo = this.add.image(400, 132, "logo");
		this.panArray = [];
		this.score = 0;
		var zone1, zone2, zone3, zone4, zone5, zone6;
		var zoneNum = 1;
		var fractionXY = [this.getObjectPosition(-0.05, -0.52), this.getObjectPosition(-0.05, 2.53), this.getObjectPosition(0.95, -0.52), 		//Left side fractions -0.52
											this.getObjectPosition(1.63, 1.00),																																									//Center fraction
											this.getObjectPosition(0.95, 2.53), this.getObjectPosition(1.95, -0.52), this.getObjectPosition(1.95, 2.53)];				//Right side fractions 2.53
		var fracNum = 0;
		var slice, fraction;

		var homeXY = this.getObjectPosition(2.15, 0.85);
		var homeButton = this.add.sprite(homeXY.x, homeXY.y, "homeButton");			//363.25, 580.8
		homeButton.setInteractive();
		homeButton.on("pointerdown", function() {
			this.scene.start("MainMenu");
		}, this);

		var restartXY = this.getObjectPosition(2.15, 1.15);
		var restartButton = this.add.sprite(restartXY.x, restartXY.y, "restartButton");			//434.5, 580.8
		restartButton.setInteractive();
		restartButton.on("pointerdown", function() {
			this.scene.start("PlayGame");
		}, this);

		var scorePanelXY = this.getObjectPosition(-0.6, 0);
		var scorePanel = this.add.image(scorePanelXY.x, scorePanelXY.y, "score");
		var scoreTextXY = this.getObjectPosition(-0.66, -0.075);
		this.scoreText = this.add.bitmapText(scoreTextXY.x, scoreTextXY.y, "font", "0");

		var highScorePanelXY = this.getObjectPosition(-0.6, 2);
		var highScorePanel = this.add.image(highScorePanelXY.x, highScorePanelXY.y, "highScore");
		var highScoreTextXY = this.getObjectPosition(-0.66, 1.935);
		this.highScore = localStorage.getItem(gameOptions.localStorageName);
		if (this.highScore == null) {
			this.highScore = 0;
		}
		this.highScoreText = this.add.bitmapText(highScoreTextXY.x, highScoreTextXY.y, "font", this.highScore.toString());

		for (var i = 0; i < gameOptions.layout.rows; i++) {
			this.panArray[i] = [];
			for (var j = 0; j < gameOptions.layout.cols; j++) {
				var objectPosition = this.getObjectPosition(i, j);
				if (j == 0 || j == 2) {
					this.add.image(objectPosition.x, objectPosition.y, "pan");
					slice = this.add.sprite(objectPosition.x, objectPosition.y, "slices", 0);
					slice.visible = false;
					fraction = this.add.sprite(fractionXY[fracNum].x, fractionXY[fracNum].y, "fractions", 0);
					fraction.visible = false;
					fracNum++;
					this.panArray[i][j] = {
						panPositionX: objectPosition.x,
						panPositionY: objectPosition.y,
						panValue: 0,
						sliceSprite: slice,
						fractionSprite: fraction,
						add: false
					};
					
					if (j == 0) {
						this.add.image(objectPosition.x - 125, objectPosition.y, "underline");
					} else {
						this.add.image(objectPosition.x + 125, objectPosition.y, "underline");
					}
					
					switch (zoneNum) {
						case (1):
							zone1 = this.add.zone(objectPosition.x, objectPosition.y, 150, 150).setRectangleDropZone(150, 150);
							this.physics.world.enable(zone1, 0);
							break;
						case (2):
							zone2 = this.add.zone(objectPosition.x, objectPosition.y, 150, 150).setRectangleDropZone(150, 150);
							this.physics.world.enable(zone2, 0);
							break;
						case (3):
							zone3 = this.add.zone(objectPosition.x, objectPosition.y, 150, 150).setRectangleDropZone(150, 150);
							this.physics.world.enable(zone3, 0);
							break;
						case (4):
							zone4 = this.add.zone(objectPosition.x, objectPosition.y, 150, 150).setRectangleDropZone(150, 150);
							this.physics.world.enable(zone4, 0);
							break;
						case (5):
							zone5 = this.add.zone(objectPosition.x, objectPosition.y, 150, 150).setRectangleDropZone(150, 150);
							this.physics.world.enable(zone5, 0);
							break;
						case (6):
							zone6 = this.add.zone(objectPosition.x, objectPosition.y, 150, 150).setRectangleDropZone(150, 150);
							this.physics.world.enable(zone6, 0);
							break;
					}
					zoneNum++;

				} else if (i == 1 && j == 1) {
					this.add.image(objectPosition.x, objectPosition.y, "pan");
					this.add.image(objectPosition.x, objectPosition.y + 135, "underline");
					var randomSlice = Math.floor((Math.random() * 7) + 1);
					slice = this.physics.add.sprite(objectPosition.x, objectPosition.y, "slices", randomSlice).setInteractive();
					fraction = this.add.sprite(fractionXY[fracNum].x, fractionXY[fracNum].y, "fractions", randomSlice);
					fracNum++;
					this.input.setDraggable(slice);
					this.physics.world.enable(slice, 0);
					this.panArray[i][j] = {
						panPositionX: objectPosition.x,
						panPositionY: objectPosition.y,
						panValue: randomSlice,
						sliceSprite: slice,
						fractionSprite: fraction,
						add: false
					};
					/*
					Even though we dont need a pan in the center of the first row or the last row, we still need to fill the array spots with a placeholder found below.
					*/
				} else {
					this.panArray[i][j] = {
						panPositionX: null,
						panPositionY: null,
						panValue: null,
						sliceSprite: null,
						fractionSprite: null,
						add: null
					};
				}
			}
		}
		
		this.input.on("drag", function (pointer, gameObject) {
			this.children.bringToTop(gameObject);
		}, this);

		this.input.on("drag", function (pointer, gameObject, dragX, dragY) {
			gameObject.x = dragX;
			gameObject.y = dragY;
		});

		this.input.on("drop", function (pointer, gameObject, zone) {
			gameObject.x = zone.x;
      gameObject.y = zone.y;
			this.addSlice(gameObject);
		}, this);

		this.input.on("dragend", function (pointer, gameObject, dropped) {
      if (!dropped) {
          gameObject.x = gameObject.input.dragStartX;
          gameObject.y = gameObject.input.dragStartY;
      }
    });

    this.growSound = this.sound.add("grow");
	}//End of Play Game create function

	/*
	Nick Bobich
	Notes: This function returns a point in 2D space of a game object. All measurements are based on panSize.
	Last Updated: 10-21-19 by Nick
	*/
	getObjectPosition(row, col) {
		var posX = gameOptions.panSize * (col + 1) + gameOptions.horizontalPanSpace * (col + 0.13);			//150 * (0 + 1) + 87.5 * (0 + 0.13)
    var posY = gameOptions.panSize * (row + 1) + gameOptions.verticalPanSpace * (row + 0.13);				//150 * (0 + 1) + 47.5 * (0 + 0.13)
    return new Phaser.Geom.Point(posX, posY);
	}

	/*
	Nick Bobich
	Notes: This function handles addition of slices and changes the image displayed on a given pan.
	Last Updated: 11-4-19 by Nick
	*/
	addSlice(gameObject) {
		for (var i = 0; i < gameOptions.layout.rows; i++) {
			for (var j = 0; j < gameOptions.layout.cols; j++) {
				if (gameObject.x == this.panArray[i][j].panPositionX && gameObject.y == this.panArray[i][j].panPositionY) {
					this.panArray[i][j].add =  false;
					if (this.panArray[i][j].panValue + this.panArray[1][1].panValue <= gameOptions.maxPanValue) {
						this.panArray[i][j].add = true;
						this.panArray[i][j].panValue = this.panArray[i][j].panValue + this.panArray[1][1].panValue;
						this.panArray[i][j].sliceSprite.visible = true;
						this.panArray[i][j].sliceSprite.setFrame(this.panArray[i][j].panValue);
						this.panArray[i][j].fractionSprite.visible = true;
						this.panArray[i][j].fractionSprite.setFrame(this.panArray[i][j].panValue);
						this.score += 10;
						gameObject.destroy();
						this.refreshGame(this.panArray[i][j].add);
					} else {
						gameObject.destroy();
						this.refreshGame(this.panArray[i][j].add);
					}
				}
			}
		}
	}

	/*
	Megan Solomon
	Notes: This function updates the game after a slice is added to a pan.
	Last Updated: 11-7-19 by Nick
	*/
	refreshGame(canAdd) {
		var slice;
		if (canAdd) {
			var randomSlice = Math.floor((Math.random() * 7) + 1);
			slice = this.physics.add.sprite(this.panArray[1][1].panPositionX, this.panArray[1][1].panPositionY, "slices", randomSlice).setInteractive();
			this.input.setDraggable(slice);
			this.physics.world.enable(slice, 0);
			this.panArray[1][1].panValue = randomSlice;
			this.panArray[1][1].sliceSprite = slice;
			this.panArray[1][1].fractionSprite.setFrame(this.panArray[1][1].panValue);

			for (var i = 0; i < gameOptions.layout.rows; i++) {
				for (var j = 0; j < gameOptions.layout.cols; j++) {
					if (this.panArray[i][j].panValue == gameOptions.maxPanValue) {
						this.growSound.play();
						
						// this.tweens.add ({
						// 	targets: [this.panArray[i][j].sliceSprite],
						// 	scaleX: 1.5,
						// 	scaleY: 1.5,
						// 	delay: 500,
						// 	duration: gameOptions.tweenSpeed,
						// 	yoyo: true,
						// 	repeat: 1,
						// 	callbackScope: this,
						// 	onComplete: function() {
								
						// 	}
						// });
						
						this.panArray[i][j].panValue = 0;
						this.panArray[i][j].sliceSprite.setFrame(0);
						this.panArray[i][j].sliceSprite.visible = false;
						this.panArray[i][j].fractionSprite.setFrame(0);
						this.score += 100;
					}
				}
			}
		} else {
			window.alert("Incorrect");
			slice = this.physics.add.sprite(this.panArray[1][1].panPositionX, this.panArray[1][1].panPositionY, "slices", this.panArray[1][1].panValue).setInteractive();
			this.input.setDraggable(slice);
			this.physics.world.enable(slice, 0);
			this.panArray[1][1].sliceSprite = slice;
			this.panArray[1][1].fractionSprite.setFrame(this.panArray[1][1].panValue);

			if (this.score < 20) {
				this.score -= this.score;
			} else {
				this.score -= 20;
			}
		}

		this.scoreText.text = this.score.toString();
		if (this.score > this.highScore) {
			this.highScore = this.score;
			localStorage.setItem(gameOptions.localStorageName, this.highScore);
			this.highScoreText.text = this.highScore.toString();
		}

		if (this.isGameOver()) {
			this.scene.start("GameOver", {score: this.score});
		}
	}

	/*
	Nick Bobich
	Notes: Checks to see if there is any possible move. If not, the game ends.
	Last Updated: 11-14-19 by Nick
	*/
	isGameOver() {
		var cannotAdd = 0;
		for (var i = 0; i < gameOptions.layout.rows; i++) {
			for (var j = 0; j < gameOptions.layout.cols; j++) {
				if ((this.panArray[i][j].panValue + this.panArray[1][1].panValue) > gameOptions.maxPanValue && j != 1) { 				//j != 1 because we are never checking the middle column 
					cannotAdd++;
				}
			}
		}
		return ((cannotAdd == gameOptions.pans) ? true : false);
	}
}//End of PlayGame class

/*
Andrejs Tomsons
Notes: Scene displays your score at the end of the game and provides a link to the quiz.
Last Updated: 11-14-19 by Andrejs
*/
class gameOver extends Phaser.Scene {
	constructor() {
		super("GameOver");
	}

	//Receives score from Play Game scene
	init(data) {
		this.finalScore = data.score;
	}

	create() {
		var background = this.add.image(400, 320, "backgroundGameOver");

		var gameOverXY = this.getObjectPosition(0, 1);
		var gameOverPanel = this.add.image(gameOverXY.x, gameOverXY.y, "gameOver");

		var scorePanelXY = this.getObjectPosition(1, 1);
		var scorePanel = this.add.image(scorePanelXY.x, scorePanelXY.y, "scoreBackground");
		var scoreTextXY = this.getObjectPosition(1.075, 1);
		this.scoreText = this.add.bitmapText(scoreTextXY.x, scoreTextXY.y, "bigFont", this.finalScore);
		this.scoreText.setOrigin(0.5);

		var quizXY = this.getObjectPosition(1.75, 1);
		var quizButton = this.add.sprite(quizXY.x, quizXY.y, "takeQuiz");
		quizButton.setInteractive();
		quizButton.on("pointerdown", function() {
			window.location.href="quiz.html"
		});
	}

	/*
	Nick Bobich
	Notes: This function returns a point in 2D space of a game object. All measurements are based on panSize.
	Last Updated: 10-21-19 by Nick
	*/
	getObjectPosition(row, col) {
		var posX = gameOptions.panSize * (col + 1) + gameOptions.horizontalPanSpace * (col + 0.13);			//150 * (0 + 1) + 87.5 * (0 + 0.13)
    var posY = gameOptions.panSize * (row + 1) + gameOptions.verticalPanSpace * (row + 0.13);				//150 * (0 + 1) + 47.5 * (0 + 0.13)
    return new Phaser.Geom.Point(posX, posY);
	}
}//End of Game Over class

/*
Nick Bobich
Notes: This function automatically resizes the game whenever window size changes.
Last Updated: 10-21-19 by Nick
*/
function resizeGame() {
	var canvas = document.querySelector("canvas");
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var windowRatio = windowWidth / windowHeight;
  var gameRatio = game.config.width / game.config.height;
  if (windowRatio < gameRatio) {
      canvas.style.width = windowWidth + "px";
      canvas.style.height = (windowWidth / gameRatio) + "px";
  } else {
      canvas.style.width = (windowHeight * gameRatio) + "px";
      canvas.style.height = windowHeight + "px";
  }
}