import { CST } from "../CST.js";
export class MenuScene extends Phaser.Scene{
    constructor() {
        super({
            key:CST.SCENES.MENU
        })
    }

    //grab data transfered from another scene
    init(){

    }

    create(){

        //setOrigin moves the origin of the image to the topleft
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.20, CST.IMAGE.LOGO).setDepth(1);
        this.add.image(0,0, CST.IMAGE.TITLE).setOrigin(0,0).setDepth(0);
        let playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, CST.IMAGE.PLAY).setDepth(1);

        let optionsButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100, CST.IMAGE.OPTIONS).setDepth(1);

        //this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100, CST.IMAGE.OPTIONS).setDepth(1);

        let hoverSprite = this.add.sprite(100,100,CST.SPRITE.CAT);
        hoverSprite.setScale(2);
        hoverSprite.setVisible(false);

        this.sound.pauseOnBlur = false;
        this.sound.play(CST.AUDIO.TITLE,{
            loop: true
        });

        this.anims.create({
            key: "walk",
            frameRate: 4,
            repeat: -1, //repeats forever
            frames: this.anims.generateFrameNumbers(CST.SPRITE.CAT,{
                frames: [0,1,2,3]
            })
        });

        //make the image interactible
        playButton.setInteractive();
        //enter the image
        playButton.on("pointerover", ()=>{
            hoverSprite.setVisible(true);
            hoverSprite.play("walk");
            hoverSprite.x = playButton.x - playButton.width;
            hoverSprite.y = playButton.y;
        })

        //leave the image
        playButton.on("pointerout", ()=>{
            hoverSprite.setVisible(false);
        })

        //click the button
        playButton.on("pointerup", ()=>{
            console.log("open the gates");
        })

        //make the image interactible
        optionsButton.setInteractive();
        //enter the image
        optionsButton.on("pointerover", ()=>{
            hoverSprite.setVisible(true);
            hoverSprite.play("walk");
            hoverSprite.x = optionsButton.x - optionsButton.width;
            hoverSprite.y = optionsButton.y;
        })

        //leave the image
        optionsButton.on("pointerout", ()=>{
            hoverSprite.setVisible(false);
        })

        //click the button
        optionsButton.on("pointerup", ()=>{
            console.log("open the options");
        })

    }
}