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
    init(){}
    preload(){
        this.load.image("title_bg", "./src/dist/assets/title_bg.jpg");

        this.load.image("options_button", "./src/dist/assets/options_button.png");

        this.load.image("play_button", "./src/dist/assets/play_button.png");

        this.load.image("logo", "./src/dist/assets/logo.png");

        this.load.spritesheet("cat", "./src/dist/assets/cat.png", {
            frameHeight: 32,
            frameWidth: 32
        });

        this.load.audio("title_music", "./src/dist/assets/shuinvy-childhood.mp3");

        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff //white
            }
        });

        //simulate large loading time
        for(let i = 0; i < 100; i++){
            this.load.spritesheet("cat" + i, "./asset/cat.png", {
                frameHeight: 32,
                frameWidth: 32
            });
        }

        this.load.on("progress", (percent)=>{
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50)
            //console.log(percent);
        });

        this.load.on("complete", ()=>{
            this.scene.start(CST.SCENES.MENU, "hello from LoadScene");
        });
    }
    update(){}

    //needed for fuctionality
    create() {
        //for a "dynamic" MenuScene
        //this.Scene.add(CST.SCENES>MENU, MenuScene, false);

        //transter control to the menu scene. secondparameter is used for transfering data to another scene
        //this.scene.start(CST.SCENES.MENU, "hello from LoadScene");
        
    }
}