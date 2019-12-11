/*
The entire body of code for the game resides in this file. The code is structured in order as follows:
-----------------------------------------------------------------------------------------------------------
1. Game options and configurations
2. Boot Game Scene: Nothing is displayed to the player in this scene. All graphics, sounds, and fonts are pre-loaded before the game begins.
3. Main Menu Scene: First screen that the player sees. Contains options such as play standard mode, play expert mode, or learn how to play.
4. Play Game Scene: This is the standard version of the game with the pizza visuals to aid in learning to add fractions.
5. Play Expert Scene: This is the difficult mode where pizza visuals are taken away and only fractions are displayed to the player.
6. Game Over Scene: Final score is displayed. From this scene, the player can decide to play again or procede to the quiz.
*/
var game;
var gameOptions = {
	pans: 6,
	maxPanValue: 12,
	maxStrikes: 5,
	scoreForExpert: 1500,
	totalHints: 20,
	panSize: 150,
	verticalPanSpace: 47.5,
	horizontalPanSpace: 87.5,
	layout: {
		rows: 3,
		cols: 3
	},
	sliceSize: 140,
	fractionSize: 60,
	panFractionSize: 120,
	tweenSpeed: 100,
	buttonTweenSpeed: 50,
	localStorageName: "highScorePizzaSlicer"
}
window.onload = function() {
	var gameConfig = {
		scale: {
			mode: Phaser.Scale.FIT,
			width: (gameOptions.panSize * (gameOptions.pans / 2)) + (gameOptions.horizontalPanSpace * ((gameOptions.pans / 2) + 1)),		//800
			height: (gameOptions.panSize * (gameOptions.pans / 2)) + (gameOptions.verticalPanSpace * ((gameOptions.pans / 2) + 1)),			//640
		},
		backgroundColor: 0x454342,
		physics: {
			default: "arcade",
			arcade: {
				debug: false
			}
		},
		scene: [bootGame, mainMenu, playGame, playExpert, gameOver]
	}
	game = new Phaser.Game(gameConfig);
	window.focus();
	resizeGame();
	window.addEventListener("resize", resizeGame);
}

/*
Nick Bobich
Notes: Boot Game scene handles the preloading of all sprites as the game begins to start up. 
Last Updated: 12-10-19 by Nick
*/
class bootGame extends Phaser.Scene {
	constructor() {
		super("BootGame");
	}
	preload() {
		this.load.image("playButton", "assets/sprites/playgame.png");
		this.load.image("expertButton", "assets/sprites/expert.png");
		this.load.image("howButton", "assets/sprites/howtoplay.png");
		this.load.image("background", "assets/sprites/background.png");

		this.load.image("woodBackground", "assets/sprites/woodBackGround.png");
		this.load.image("logo", "assets/sprites/logo.png");
		this.load.image("homeButton", "assets/sprites/home.png");
		this.load.image("restartButton", "assets/sprites/restart.png");
		this.load.image("score", "assets/sprites/score.png");
		this.load.image("highScore", "assets/sprites/highScore.png");
		this.load.spritesheet("strikePanel", "assets/sprites/strikes.png", {
			frameWidth: 225,
			frameHeight: 50
		});

		this.load.image("pan", "assets/sprites/pan.png");
		this.load.image("fractionBackground", "assets/sprites/fractionBackGround.png");
		this.load.spritesheet("slices", "assets/sprites/modernSlices.png", {
			frameWidth: gameOptions.sliceSize,
			frameHeight: gameOptions.sliceSize
		});
		this.load.spritesheet("fractions", "assets/sprites/fractionSprite.png", {
			frameWidth: gameOptions.fractionSize,
			frameHeight: gameOptions.fractionSize
		});
		this.load.bitmapFont("font", "assets/fonts/font.png", "assets/fonts/font.fnt");
		this.load.audio("grow", ["assets/sounds/grow.ogg", "assets/sounds/grow.mp3"]);

		this.load.spritesheet("panFractions", "assets/sprites/panFractions.png", {
			frameWidth: gameOptions.panFractionSize,
			frameHeight: gameOptions.panFractionSize
		});

		this.load.image("gameOver", "assets/sprites/gameOver.png");
		this.load.image("scoreBackground", "assets/sprites/scoreBackGround.png");
		this.load.image("finalScoreLabel", "assets/sprites/finalScore.png");
		this.load.image("playAgain", "assets/sprites/playAgain.png");
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
Last Updated: 12-10-19 by Nick
*/
class mainMenu extends Phaser.Scene {
	constructor() {
		super("MainMenu");
	}

	create() {
		var background = this.add.image(400, 320, "background");
		var playButtonXY = this.getObjectPosition(1.1, 1), expertButtonXY = this.getObjectPosition(1.5, 1), howButtonXY = this.getObjectPosition(1.9, 1);
		var playButton = this.add.sprite(playButtonXY.x, playButtonXY.y, "playButton");					//398.875, 412.925
		playButton.setInteractive();
		playButton.setAlpha(0.7);
		var expertButton = this.add.sprite(expertButtonXY.x, expertButtonXY.y, "expertButton");	//398.875, 491.925
		expertButton.setInteractive();
		expertButton.setAlpha(0.7);
		var howButton = this.add.sprite(howButtonXY.x, howButtonXY.y, "howButton");							//398.875, 570.925
		howButton.setInteractive();
		howButton.setAlpha(0.7);

		playButton.on("pointerover", function (pointer, gameObject) {
			this.tweens.add({targets: [playButton], scaleX: 1.2, scaleY: 1.2, alpha: 1, duration: gameOptions.tweenSpeed});
		}, this);

		playButton.on("pointerout", function (pointer, gameObject) {
			this.tweens.add({targets: [playButton], scaleX: 1, scaleY: 1, alpha: 0.7, duration: gameOptions.tweenSpeed});
		}, this);

		expertButton.on("pointerover", function (pointer, gameObject) {
			this.tweens.add({targets: [expertButton], scaleX: 1.2, scaleY: 1.2, alpha: 1, duration: gameOptions.tweenSpeed});
		}, this);

		expertButton.on("pointerout", function (pointer, gameObject) {
			this.tweens.add({targets: [expertButton], scaleX: 1, scaleY: 1, alpha: 0.7, duration: gameOptions.tweenSpeed});
		}, this);

		howButton.on("pointerover", function (pointer,gameObject) {
			this.tweens.add({targets: [howButton], scaleX: 1.2, scaleY: 1.2, alpha: 1, duration: gameOptions.tweenSpeed});
		}, this);

		howButton.on("pointerout", function (pointer,gameObject) {
			this.tweens.add({targets: [howButton], scaleX: 1, scaleY: 1, alpha: 0.7, duration: gameOptions.tweenSpeed});
		}, this);
		
		playButton.on("pointerdown", function() {
			this.scene.start("PlayGame");
		}, this);
		
		expertButton.on("pointerdown", function() {
			var highScore = localStorage.getItem(gameOptions.localStorageName);
			if (highScore >= gameOptions.scoreForExpert) {
				this.scene.start("PlayExpert", {playAgain: null});
			} else {
				Swal.fire({
				  icon: 'error',
				  title: 'Not yet...',
				  text: 'You need a better high score to play expert mode!',
				  showConfirmButton: false,
					backdrop: false,
					showCloseButton: true
				});
			}
		}, this);
		
		howButton.on("pointerdown", function() {
			window.location.href = "howTo.html";
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
Last Updated: 12-10-19 by Nick
*/
class playGame extends Phaser.Scene {
	constructor() {
		super("PlayGame");
	}

	create() {
		var woodBackground = this.add.image(400, 320, "woodBackground");
		var logo = this.add.image(400, 140, "logo");

		this.hintsArray = [{imageName: 'hint00.png', firstOperand: 2, secondOperand: 11}, {imageName: 'hint01.png', firstOperand: 3, secondOperand: 11}, 
												{imageName: 'hint02.png', firstOperand: 4, secondOperand: 11}, {imageName: 'hint03.png', firstOperand: 5, secondOperand: 11},
												{imageName: 'hint04.png', firstOperand: 6, secondOperand: 11}, {imageName: 'hint05.png', firstOperand: 7, secondOperand: 11},
												{imageName: 'hint06.png', firstOperand: 3, secondOperand: 10}, {imageName: 'hint07.png', firstOperand: 4, secondOperand: 10},
												{imageName: 'hint08.png', firstOperand: 5, secondOperand: 10}, {imageName: 'hint09.png', firstOperand: 6, secondOperand: 10},
												{imageName: 'hint10.png', firstOperand: 7, secondOperand: 10}, {imageName: 'hint11.png', firstOperand: 4, secondOperand: 9},
												{imageName: 'hint12.png', firstOperand: 5, secondOperand: 9}, {imageName: 'hint13.png', firstOperand: 6, secondOperand: 9},
												{imageName: 'hint14.png', firstOperand: 7, secondOperand: 9}, {imageName: 'hint15.png', firstOperand: 5, secondOperand: 8},
												{imageName: 'hint16.png', firstOperand: 6, secondOperand: 8}, {imageName: 'hint17.png', firstOperand: 7, secondOperand: 8},
												{imageName: 'hint18.png', firstOperand: 7, secondOperand: 6}, {imageName: 'hint19.png', firstOperand: 7, secondOperand: 7}];

		this.panArray = [];
		this.score = 0;
		this.strikes = 0;
		this.playAgain = 0;
		var zone1, zone2, zone3, zone4, zone5, zone6;
		var zoneNum = 1;
		var fractionXY = [this.getObjectPosition(0.17, -0.42), this.getObjectPosition(0.17, 2.43), this.getObjectPosition(1.17, -0.42), 			//Left side fractions -0.42
											this.getObjectPosition(1.53, 1.00),																																									//Center fraction
											this.getObjectPosition(1.17, 2.43), this.getObjectPosition(2.17, -0.42), this.getObjectPosition(2.17, 2.43)];				//Right side fractions 2.43
		var fracNum = 0;
		var slice, fraction;

		var homeXY = this.getObjectPosition(2.15, 0.85);
		var homeButton = this.add.sprite(homeXY.x, homeXY.y, "homeButton");			//363.25, 580.8
		homeButton.setInteractive();
		homeButton.setAlpha(0.8);
		homeButton.on("pointerdown", function() {
			this.tweens.add({
				targets: [homeButton],
				scaleX: 1.2,
				scaleY: 1.2,
				duration: gameOptions.buttonTweenSpeed,
				yoyo: true,
				callbackScope: this,
				onComplete: function() {
					this.scene.start("MainMenu");
				}
			});
		}, this);

		var restartXY = this.getObjectPosition(2.15, 1.15);
		var restartButton = this.add.sprite(restartXY.x, restartXY.y, "restartButton");			//434.5, 580.8
		restartButton.setInteractive();
		restartButton.setAlpha(0.8);
		restartButton.on("pointerdown", function() {
			this.tweens.add({
				targets: [restartButton],
				scaleX: 1.2,
				scaleY: 1.2,
				duration: gameOptions.buttonTweenSpeed,
				yoyo: true,
				callbackScope: this,
				onComplete: function() {
					this.scene.start("PlayGame");
				}
			});
		}, this);

		var scorePanelXY = this.getObjectPosition(-0.6, -0.15);
		var scorePanel = this.add.image(scorePanelXY.x, scorePanelXY.y, "score");
		scorePanel.setAlpha(0.8);
		var scoreTextXY = this.getObjectPosition(-0.66, -0.2);
		this.scoreText = this.add.bitmapText(scoreTextXY.x, scoreTextXY.y, "font", "0");

		var highScorePanelXY = this.getObjectPosition(-0.6, 2.15);
		var highScorePanel = this.add.image(highScorePanelXY.x, highScorePanelXY.y, "highScore");
		highScorePanel.setAlpha(0.8);
		var highScoreTextXY = this.getObjectPosition(-0.66, 2.09);
		this.highScore = localStorage.getItem(gameOptions.localStorageName);
		if (this.highScore == null) {
			this.highScore = 0;
		}
		this.highScoreText = this.add.bitmapText(highScoreTextXY.x, highScoreTextXY.y, "font", this.highScore.toString());

		var strikePanelXY = this.getObjectPosition(-0.6, 1);
		this.strikePanel = this.add.sprite(strikePanelXY.x, strikePanelXY.y, "strikePanel", this.strikes);
		this.strikePanel.setAlpha(0.8);

		for (var i = 0; i < gameOptions.layout.rows; i++) {
			this.panArray[i] = [];
			for (var j = 0; j < gameOptions.layout.cols; j++) {
				var objectPosition = this.getObjectPosition(i, j);
				if (j == 0 || j == 2) {
					
					if (j == 0) {
						this.add.image(objectPosition.x - 100, objectPosition.y + 35, "fractionBackground");
					} else {
						this.add.image(objectPosition.x + 100, objectPosition.y + 35, "fractionBackground");
					}

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
					this.add.image(objectPosition.x, objectPosition.y + 100, "fractionBackground");
					this.add.image(objectPosition.x, objectPosition.y, "pan");
					var randomSlice = Math.floor((Math.random() * 7) + 1);
					slice = this.physics.add.sprite(objectPosition.x, objectPosition.y, "slices", randomSlice).setInteractive();
					fraction = this.add.sprite(fractionXY[fracNum].x, fractionXY[fracNum].y, "fractions", randomSlice);
					fracNum++;
					this.input.setDraggable(slice);
					this.physics.world.enable(slice, 0);					//0 for dynamic, 1 for static
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
		var posX = gameOptions.panSize * (col + 1) + gameOptions.horizontalPanSpace * (col + 0.13);
    var posY = gameOptions.panSize * (row + 1) + gameOptions.verticalPanSpace * (row + 0.13);
    return new Phaser.Geom.Point(posX, posY);
	}

	/*
	Nick Bobich
	Notes: This function handles addition of slices and changes the image displayed on a given pan.
	Last Updated: 12-11-19 by Nick
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
						this.refreshGame(this.panArray[i][j].add, i, j);
					} else {
						gameObject.destroy();
						this.refreshGame(this.panArray[i][j].add, i, j);
					}
				}
			}
		}
	}

	/*
	Megan Solomon
	Notes: This function updates the game after a slice is added to a pan.
	Last Updated: 12-11-19 by Nick
	*/
	refreshGame(canAdd, iPan, jPan) {
		var slice;
		var row = 0, col = 0;

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
						row = i;
						col = j;
					}
				}
			}

			if (this.panArray[row][col].panValue == gameOptions.maxPanValue) {
				this.growSound.play();
				this.score += 100;

				this.tweens.add ({
					targets: [this.panArray[row][col].sliceSprite],
					scaleX: 1.5,
					scaleY: 1.5,
					duration: gameOptions.tweenSpeed,
					yoyo: true,
					repeat: 1,
					callbackScope: this,
					onComplete: function() {
						this.panArray[row][col].panValue = 0;
						this.panArray[row][col].sliceSprite.setFrame(0);
						this.panArray[row][col].sliceSprite.visible = false;
						this.panArray[row][col].fractionSprite.setFrame(0);
					}
				});
			}

		} else {
			
			var firstOperand = this.panArray[1][1].panValue;
			var secondOperand = this.panArray[iPan][jPan].panValue;
			var imageName;

			for (var i = 0; i < gameOptions.totalHints; i++) {
				if (firstOperand == this.hintsArray[i].firstOperand || firstOperand == this.hintsArray[i].secondOperand) {
					if (secondOperand == this.hintsArray[i].firstOperand || secondOperand == this.hintsArray[i].secondOperand) {
						imageName = this.hintsArray[i].imageName;
					}
				}
			}

			Swal.fire({
				text: 'Are you ready to continue?',
				imageUrl: 'assets/hints/' + imageName,
				imageWidth: 400,
				imageHeight: 400,
				showConfirmButton: false,
				backdrop: false,
				showCloseButton: true
			});

			slice = this.physics.add.sprite(this.panArray[1][1].panPositionX, this.panArray[1][1].panPositionY, "slices", this.panArray[1][1].panValue).setInteractive();
			this.input.setDraggable(slice);
			this.physics.world.enable(slice, 0);
			this.panArray[1][1].sliceSprite = slice;
			this.panArray[1][1].fractionSprite.setFrame(this.panArray[1][1].panValue);

			if (this.strikes < gameOptions.maxStrikes) {
				this.strikes++;
				this.tweens.add ({
					targets: [this.strikePanel],
					scaleX: 1.5,
					scaleY: 1.5,
					duration: gameOptions.tweenSpeed,
					yoyo: true,
					repeat: 1,
					callbackScope: this,
					onComplete: function() {
						this.strikePanel.setFrame(this.strikes);
					}
				});
			}
		}

		this.scoreText.text = this.score.toString();
		if (this.score > this.highScore) {
			this.highScore = this.score;
			localStorage.setItem(gameOptions.localStorageName, this.highScore);
			this.highScoreText.text = this.highScore.toString();
		}

		this.time.addEvent({																										//Delay check for gameOver by 0.5 secs to allow animation to finish before check
			delay: 500,
			callback: ()=> {
				if (this.isGameOver()) {
					this.scene.start("GameOver", {score: this.score});
				}
			}
		});
		
		if (this.score >= gameOptions.scoreForExpert)  {
			this.scene.start("PlayExpert", {score: this.score, playAgain: this.playAgain});
			Swal.fire({
			  icon: 'info',
			  title: 'Great Job!',
			  text: 'You are now in expert mode.',
			  showConfirmButton: false,
				backdrop: false,
				showCloseButton: true
			});
		}
	}

	/*
	Nick Bobich
	Notes: Checks to see if there is any possible move. If not, the game ends.
	Last Updated: 12-10-19 by Nick
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
		return ((cannotAdd == gameOptions.pans || this.strikes == gameOptions.maxStrikes) ? true : false);
	}
}//End of PlayGame class

/*
Nick Bobich
Notes: Scene displays the expert mode of the game.
Last Updated: 12-10-19 by Nick
*/
class playExpert extends Phaser.Scene {
	constructor() {
		super("PlayExpert");
	}

	//Receives score and flag from Play Game scene. The purpose of the flag is to determine whether the reset/play again button should go straight to expert or normal
	init(data) {
		this.currentScore = data.score;
		this.playExpertAgain = data.playAgain;
	}

	create() {
		if (this.currentScore == null) {
			this.currentScore = 0;
		}

		if (this.playExpertAgain == null) {
			this.playExpertAgain = 1;
		}
		var woodBackground = this.add.image(400, 320, "woodBackground");
		var logo = this.add.image(400, 140, "logo");

		this.hintsArray = [{imageName: 'hint00.png', firstOperand: 2, secondOperand: 11}, {imageName: 'hint01.png', firstOperand: 3, secondOperand: 11}, 
												{imageName: 'hint02.png', firstOperand: 4, secondOperand: 11}, {imageName: 'hint03.png', firstOperand: 5, secondOperand: 11},
												{imageName: 'hint04.png', firstOperand: 6, secondOperand: 11}, {imageName: 'hint05.png', firstOperand: 7, secondOperand: 11},
												{imageName: 'hint06.png', firstOperand: 3, secondOperand: 10}, {imageName: 'hint07.png', firstOperand: 4, secondOperand: 10},
												{imageName: 'hint08.png', firstOperand: 5, secondOperand: 10}, {imageName: 'hint09.png', firstOperand: 6, secondOperand: 10},
												{imageName: 'hint10.png', firstOperand: 7, secondOperand: 10}, {imageName: 'hint11.png', firstOperand: 4, secondOperand: 9},
												{imageName: 'hint12.png', firstOperand: 5, secondOperand: 9}, {imageName: 'hint13.png', firstOperand: 6, secondOperand: 9},
												{imageName: 'hint14.png', firstOperand: 7, secondOperand: 9}, {imageName: 'hint15.png', firstOperand: 5, secondOperand: 8},
												{imageName: 'hint16.png', firstOperand: 6, secondOperand: 8}, {imageName: 'hint17.png', firstOperand: 7, secondOperand: 8},
												{imageName: 'hint18.png', firstOperand: 7, secondOperand: 6}, {imageName: 'hint19.png', firstOperand: 7, secondOperand: 7}];

		this.panArray = [];
		this.strikes = 0;
		var zone1, zone2, zone3, zone4, zone5, zone6;
		var zoneNum = 1;
		var panFraction;

		var homeXY = this.getObjectPosition(2.15, 0.85);
		var homeButton = this.add.sprite(homeXY.x, homeXY.y, "homeButton");			//363.25, 580.8
		homeButton.setInteractive();
		homeButton.setAlpha(0.8);
		homeButton.on("pointerdown", function() {
			this.tweens.add({
				targets: [homeButton],
				scaleX: 1.2,
				scaleY: 1.2,
				duration: gameOptions.buttonTweenSpeed,
				yoyo: true,
				callbackScope: this,
				onComplete: function() {
					this.scene.start("MainMenu");
				}
			});
		}, this);

		var restartXY = this.getObjectPosition(2.15, 1.15);
		var restartButton = this.add.sprite(restartXY.x, restartXY.y, "restartButton");			//434.5, 580.8
		restartButton.setInteractive();
		restartButton.setAlpha(0.8);
		restartButton.on("pointerdown", function() {
			this.tweens.add({
				targets: [restartButton],
				scaleX: 1.2,
				scaleY: 1.2,
				duration: gameOptions.buttonTweenSpeed,
				yoyo: true,
				callbackScope: this,
				onComplete: function() {
					if (this.playExpertAgain == 1) {
						this.scene.start("PlayExpert");
					} else {
						this.scene.start("PlayGame");
					}
				}
			});
		}, this);

		var scorePanelXY = this.getObjectPosition(-0.6, -0.15);
		var scorePanel = this.add.image(scorePanelXY.x, scorePanelXY.y, "score");
		scorePanel.setAlpha(0.8);
		var scoreTextXY = this.getObjectPosition(-0.66, -0.2);
		this.scoreText = this.add.bitmapText(scoreTextXY.x, scoreTextXY.y, "font", this.currentScore);

		var highScorePanelXY = this.getObjectPosition(-0.6, 2.15);
		var highScorePanel = this.add.image(highScorePanelXY.x, highScorePanelXY.y, "highScore");
		highScorePanel.setAlpha(0.8);
		var highScoreTextXY = this.getObjectPosition(-0.66, 2.09);
		this.highScore = localStorage.getItem(gameOptions.localStorageName);
		this.highScoreText = this.add.bitmapText(highScoreTextXY.x, highScoreTextXY.y, "font", this.highScore.toString());

		var strikePanelXY = this.getObjectPosition(-0.6, 1);
		this.strikePanel = this.add.sprite(strikePanelXY.x, strikePanelXY.y, "strikePanel", this.strikes);
		this.strikePanel.setAlpha(0.8);

		for (var i = 0; i < gameOptions.layout.rows; i++) {
			this.panArray[i] = [];
			for (var j = 0; j < gameOptions.layout.cols; j++) {
				var objectPosition = this.getObjectPosition(i, j);
				if (j == 0 || j == 2) {
					this.add.image(objectPosition.x, objectPosition.y, "pan");
					panFraction = this.add.sprite(objectPosition.x, objectPosition.y, "panFractions", 0);
					panFraction.visible = false;
					
					this.panArray[i][j] = {
						panPositionX: objectPosition.x,
						panPositionY: objectPosition.y,
						panValue: 0,
						panFractionSprite: panFraction,
						add: false
					};
					
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
					var randomPanFraction = Math.floor((Math.random() * 7) + 1);
					panFraction = this.physics.add.sprite(objectPosition.x, objectPosition.y, "panFractions", randomPanFraction).setInteractive();
					this.input.setDraggable(panFraction);
					this.physics.world.enable(panFraction, 0);
					this.panArray[i][j] = {
						panPositionX: objectPosition.x,
						panPositionY: objectPosition.y,
						panValue: randomPanFraction,
						panFractionSprite: panFraction,
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
						panFractionSprite: null,
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
			this.addFraction(gameObject);
		}, this);

		this.input.on("dragend", function (pointer, gameObject, dropped) {
      if (!dropped) {
          gameObject.x = gameObject.input.dragStartX;
          gameObject.y = gameObject.input.dragStartY;
      }
    });

    this.growSound = this.sound.add("grow");
	}//End of Play Game Difficult Create

	/*
	Nick Bobich
	Notes: This function returns a point in 2D space of a game object. All measurements are based on panSize.
	Last Updated: 10-21-19 by Nick
	*/
	getObjectPosition(row, col) {
		var posX = gameOptions.panSize * (col + 1) + gameOptions.horizontalPanSpace * (col + 0.13);
    var posY = gameOptions.panSize * (row + 1) + gameOptions.verticalPanSpace * (row + 0.13);
    return new Phaser.Geom.Point(posX, posY);
	}

	/*
	Nick Bobich
	Notes: This function handles addition of slices and changes the image displayed on a given pan.
	Last Updated: 11-18-19 by Nick
	*/
	addFraction(gameObject) {
		for (var i = 0; i < gameOptions.layout.rows; i++) {
			for (var j = 0; j < gameOptions.layout.cols; j++) {
				if (gameObject.x == this.panArray[i][j].panPositionX && gameObject.y == this.panArray[i][j].panPositionY) {
					this.panArray[i][j].add =  false;
					if (this.panArray[i][j].panValue + this.panArray[1][1].panValue <= gameOptions.maxPanValue) {
						this.panArray[i][j].add = true;
						this.panArray[i][j].panValue = this.panArray[i][j].panValue + this.panArray[1][1].panValue;
						this.panArray[i][j].panFractionSprite.visible = true;
						this.panArray[i][j].panFractionSprite.setFrame(this.panArray[i][j].panValue);
						this.currentScore += 10;
						gameObject.destroy();
						this.refreshGame(this.panArray[i][j].add, i, j);
					} else {
						gameObject.destroy();
						this.refreshGame(this.panArray[i][j].add, i, j);
					}
				}
			}
		}
	}

	/*
	Megan Solomon
	Notes: This function updates the game after a slice is added to a pan.
	Last Updated: 12-10-19 by Megan
	*/
	refreshGame(canAdd, iPan, jPan) {
		var panFraction;
		var row = 0, col = 0;

		if (canAdd) {
			var randomPanFraction = Math.floor((Math.random() * 7) + 1);
			panFraction = this.physics.add.sprite(this.panArray[1][1].panPositionX, this.panArray[1][1].panPositionY, "panFractions", randomPanFraction).setInteractive();
			this.input.setDraggable(panFraction);
			this.physics.world.enable(panFraction, 0);
			this.panArray[1][1].panValue = randomPanFraction;
			this.panArray[1][1].panFractionSprite = panFraction;

			for (var i = 0; i < gameOptions.layout.rows; i++) {
				for (var j = 0; j < gameOptions.layout.cols; j++) {
					if (this.panArray[i][j].panValue == gameOptions.maxPanValue) {
						row = i;
						col = j;
					}
				}
			}

			if (this.panArray[row][col].panValue == gameOptions.maxPanValue) {
				this.growSound.play();
				this.currentScore += 100;

				this.tweens.add ({
					targets: [this.panArray[row][col].panFractionSprite],
					scaleX: 1.5,
					scaleY: 1.5,
					duration: gameOptions.tweenSpeed,
					yoyo: true,
					repeat: 1,
					callbackScope: this,
					onComplete: function() {
						this.panArray[row][col].panValue = 0;
						this.panArray[row][col].panFractionSprite.setFrame(0);
						this.panArray[row][col].panFractionSprite.visible = false;
					}
				});
			}

		} else {
			
			var firstOperand = this.panArray[1][1].panValue;
			var secondOperand = this.panArray[iPan][jPan].panValue;
			var imageName;

			for (var i = 0; i < gameOptions.totalHints; i++) {
				if (firstOperand == this.hintsArray[i].firstOperand || firstOperand == this.hintsArray[i].secondOperand) {
					if (secondOperand == this.hintsArray[i].firstOperand || secondOperand == this.hintsArray[i].secondOperand) {
						imageName = this.hintsArray[i].imageName;
					}
				}
			}

			Swal.fire({
				text: 'Are you ready to continue?',
				imageUrl: 'assets/hints/' + imageName,
				imageWidth: 400,
				imageHeight: 400,
				showConfirmButton: false,
				backdrop: false,
				showCloseButton: true
			});

			panFraction = this.physics.add.sprite(this.panArray[1][1].panPositionX, this.panArray[1][1].panPositionY, "panFractions", this.panArray[1][1].panValue).setInteractive();
			this.input.setDraggable(panFraction);
			this.physics.world.enable(panFraction, 0);
			this.panArray[1][1].panFractionSprite = panFraction;

			if (this.strikes < gameOptions.maxStrikes) {
				this.strikes++;
				this.tweens.add ({
					targets: [this.strikePanel],
					scaleX: 1.5,
					scaleY: 1.5,
					duration: gameOptions.tweenSpeed,
					yoyo: true,
					repeat: 1,
					callbackScope: this,
					onComplete: function() {
						this.strikePanel.setFrame(this.strikes);
					}
				});
			}
		}

		this.scoreText.text = this.currentScore.toString();
		if (this.currentScore > this.highScore) {
			this.highScore = this.currentScore;
			localStorage.setItem(gameOptions.localStorageName, this.highScore);
			this.highScoreText.text = this.highScore.toString();
		}

		this.time.addEvent({																										//Delay check for gameOver by 0.5 secs to allow animation to finish before check
			delay: 500,
			callback: ()=> {
				if (this.isGameOver()) {
					this.scene.start("GameOver", {score: this.currentScore, playAgain: this.playExpertAgain});
				}
			}
		});
	}

	/*
	Nick Bobich
	Notes: Checks to see if there is any possible move. If not, the game ends.
	Last Updated: 12-10-19 by Nick
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
		return ((cannotAdd == gameOptions.pans || this.strikes == gameOptions.maxStrikes) ? true : false);
	}

}//End of Play Expert Scene

/*
Andrejs Tomsons
Notes: Scene displays your score at the end of the game and provides a link to play again or to the quiz.
Last Updated: 11-22-19 by Andrejs
*/
class gameOver extends Phaser.Scene {
	constructor() {
		super("GameOver");
	}

	//Receives score from Play Game or Play Expert scene
	init(data) {
		this.finalScore = data.score;
		this.playAgain = data.playAgain;
	}

	create() {
		var background = this.add.image(400, 320, "woodBackground");

		var gameOverXY = this.getObjectPosition(-0.1, 1);
		var gameOverPanel = this.add.image(gameOverXY.x, gameOverXY.y, "gameOver");

		var finalScoreXY = this.getObjectPosition(0.6, 1);
		var finalScoreLabel = this.add.image(finalScoreXY.x, finalScoreXY.y, "finalScoreLabel");

		var scorePanelXY = this.getObjectPosition(1, 1);
		var scorePanel = this.add.image(scorePanelXY.x, scorePanelXY.y, "scoreBackground");
		var scoreTextXY = this.getObjectPosition(1.075, 1);
		this.scoreText = this.add.bitmapText(scoreTextXY.x, scoreTextXY.y, "bigFont", this.finalScore);
		this.scoreText.setOrigin(0.5);

		var playAgainXY = this.getObjectPosition(1.75, 0.5);
		var playAgainButton = this.add.sprite(playAgainXY.x, playAgainXY.y, "playAgain");
		playAgainButton.setInteractive();

		var quizXY = this.getObjectPosition(1.75, 1.5);
		var quizButton = this.add.sprite(quizXY.x, quizXY.y, "takeQuiz");
		quizButton.setInteractive();
		
		playAgainButton.on("pointerover", function (pointer, gameObject) {
			this.tweens.add({targets: [playAgainButton], scaleX: 1.2, scaleY: 1.2, duration: gameOptions.tweenSpeed});
		}, this);

		playAgainButton.on("pointerout", function (pointer, gameObject) {
			this.tweens.add({targets: [playAgainButton], scaleX: 1, scaleY: 1, duration: gameOptions.tweenSpeed});
		}, this);

		quizButton.on("pointerover", function (pointer, gameObject) {
			this.tweens.add({targets: [quizButton], scaleX: 1.2, scaleY: 1.2, duration: gameOptions.tweenSpeed});
		}, this);

		quizButton.on("pointerout", function (pointer, gameObject) {
			this.tweens.add({targets: [quizButton], scaleX: 1, scaleY: 1, duration: gameOptions.tweenSpeed});
		}, this);

		playAgainButton.on("pointerdown", function() {
			if (this.playAgain == 1) {
						this.scene.start("PlayExpert");
					} else {
						this.scene.start("PlayGame");
					}
		}, this);

		quizButton.on("pointerdown", function() {
			window.location.href="quiz.html";
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