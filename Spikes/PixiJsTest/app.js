PIXI.utils.sayHello();

var renderer =  PIXI.autoDetectRenderer({
    width: 512,
    height: 512,
    transparent: true,
    resolution: 1
});

document.getElementById('display').appendChild(renderer.view);

var stage = new PIXI.Container();
//.add("rat", "images/rat.png")
PIXI.loader
    .add("spritesheet", "images/skeleton.png")
    .load(setup);

var sprite;
//var rat;

function setup() {
    stage.interactive = true;

    var rect = new PIXI.Rectangle(0,0,35,72);
    var texture = PIXI.loader.resources["spritesheet"].texture;
    texture.frame = rect;

    sprite = new PIXI.Sprite(texture);
    var idle = setInterval(function() {
        if (rect.x >= 35 * 5) rect.x = 35;
        sprite.texture.frame = rect;
        rect.x += 35;
    }, 250);

    sprite.scale.set(2,2);

    sprite.vx = 3;

    stage.addChild(sprite);

    /*rat = new PIXI.Sprite(
        PIXI.loader.resources["rat"].texture
    );
    rat.interactive = true;
    rat.scale.set(0.5, 0.5);
    rat.anchor.set(0.5, 0.5);
    rat.pivot.set(200,0);
    rat.click = function() {
        rat.scale.x -= 0.1;
        rat.scale.y -= 0.1;
    }
    stage.addChild(rat);*/
    animationLoop();
}

function animationLoop() {
    requestAnimationFrame(animationLoop);

    
    /*rat.x = renderer.width / 2;
    rat.y = renderer.width / 2;
    rat.rotation += 0.01;*/
    

    renderer.render(stage);
}

window.addEventListener("keydown", function(event) {
    event.preventDefault();
    sprite.x += sprite.vx
});

