import { CST } from "../CST.js";
// "Dynamic" MenuScene, can remove the import in main.js
//import { MenuScene } from "./MenuScene.js";
export class LoadScene extends Phaser.Scene{
    constructor() {
        super({
            key:CST.SCENES.LOAD
        })
    }
    //optional
    init(){

    }

    loadImages(){
        this.load.setPath("./src/dist/assets/image");

        //easily load all images
        for(let prop in CST.IMAGE){
            this.load.image(CST.IMAGE[prop], CST.IMAGE[prop]);
        }
    }

    loadAudio(){
        this.load.setPath("./src/dist/assets/audio");

        //easily load all images
        for(let prop in CST.AUDIO){
            this.load.audio(CST.AUDIO[prop], CST.AUDIO[prop]);
        }
    }

    loadSprites(frameConfig){
        this.load.setPath("./src/dist/assets/sprite");

        //easily load all images
        for(let prop in CST.SPRITE){
            this.load.spritesheet(CST.SPRITE[prop], CST.SPRITE[prop], frameConfig);
        }
    }

    preload(){

        this.loadImages();
        this.loadAudio();
        this.loadSprites({
            frameHeight: 32,
            frameWidth: 32
        });
        //old way of loading all assets
        /*
        this.load.image("title_bg", "./src/dist/assets/title_bg.jpg");

        this.load.image("options_button", "./src/dist/assets/options_button.png");

        this.load.image("play_button", "./src/dist/assets/play_button.png");

        this.load.image("logo", "./src/dist/assets/logo.png");

        this.load.spritesheet("cat", "./src/dist/assets/cat.png", {
            frameHeight: 32,
            frameWidth: 32
        });
        
        this.load.audio("title_music", "./src/dist/assets/shuinvy-childhood.mp3");
        */

        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff //white
            }
        });

        //simulate large loading time
        /*
        for(let i = 0; i < 100; i++){
            this.load.spritesheet("cat" + i, "./asset/cat.png", {
                frameHeight: 32,
                frameWidth: 32
            });
        }*/

        this.load.on("progress", (percent)=>{
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50)
            //console.log(percent);
        });

        this.load.on("complete", ()=>{
            this.scene.start(CST.SCENES.MENU, "Hello from LoadScene");
        });

        this.load.on("load", (file)=>{
            //prints out the name of a file when it is loaded correctly
            console.log(file.src);
        });
    }
    update(){}

    //needed for fuctionality
    create() {
        //for a "dynamic" MenuScene
        //this.Scene.add(CST.SCENES>MENU, MenuScene, false);

        //transter control to the menu scene. secondparameter is used for transfering data to another scene
        //this.scene.start(CST.SCENES.MENU);
        
    }
}