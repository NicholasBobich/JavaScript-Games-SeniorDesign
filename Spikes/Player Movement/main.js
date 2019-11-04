var config = {
    //AUTO uses what it can for browser
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        //needed functions that will be defined later
        preload: preload,
        create: create,
        update: update,

        //allows for functions created to be in the game context eg. this.makePlayer now works
        extend: {
            makePlayer:makePlayer
        }
    }
}

var game = new Phaser.Game(config);

var player;
var leftKey;
var rightKey;
var upKey;
var downKey;

function preload() {
    //'player' is the key
    this.load.image('player','assets/player.png')
}

function create() {
    //takes the width / 2 and the height to put the "player" at the bottom-center
    player = this.makePlayer(this.sys.canvas.width / 2,this.sys.canvas.height);
    leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

    console.log();
}

function update() {
    //player can move left and right, bounded by the sides of the game
    if(rightKey.isDown && player.x < this.sys.canvas.width - player.displayWidth * player.originX) {
        player.x += player.properties.speedX;
    } else if (leftKey.isDown && player.x > 0 + player.displayWidth * player.originX) {
        player.x -= player.properties.speedX;
    }

    //player can move up and down, bounded by the sides of the game ( Y is opposite what you think)
    if(upKey.isDown && player.y > 0 + player.displayHeight * player.originY) {
        player.y -= player.properties.speedY;
    } else if(downKey.isDown && player.y < this.sys.canvas.height) {
        player.y += player.properties.speedY;
    }

}

function makePlayer(x,y) {
    //uses key 'player' from the loaded image
    //setOrignin: 0.5 for x makes it in the middle, 1 for y puts it near the bottom
    var player = this.add.image(x,y,'player').setOrigin(0.5,1);

    //creaes an empty variable that we can use as properties for the player object
    player.properties = {};
    player.properties.speedX = 5;
    player.properties.speedY = 5;

    return player;
}