import 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.load.image("logo", "src/assets/logo.png");
    }

    create() {
        const logo = this.add.image(400, 150, "logo");
    }
}