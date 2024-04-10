import { Scene } from "phaser";
import { isMobile } from "../../../../../utils/utils";
import eventsCenter from "../../EventCenter";

var width = isMobile() ? window.innerWidth : 500;
var height = window.innerHeight;
class HighLow extends Scene {
  constructor(props) {
    super("hiLow");
    this.spriteNumber = null;
    this.number = 0;
    this.workingButtons = true;
    this.higher = true;
    this.score = 0;
    this.isGameOver = false;
  }

  preload() {
    this.load.spritesheet("numbers", "assets/HiLow/numbers.png", {
      frameWidth: 100,
      frameHeight: 100,
    });
    this.load.image("gametitle", "assets/HiLow/gametitle.png");
    this.load.image("play", "assets/HiLow/play.png");
    this.load.image("higher", "assets/HiLow/higher.png");
    this.load.image("lower", "assets/HiLow/lower.png");
    this.load.image("gameover", "assets/HiLow/gameover.png");

    this.load.spritesheet("backBtn", "assets/mainBody/back/button.png", {
      frameWidth: 150,
      frameHeight: 75,
    });
  }
  update() {}

  create() {
    this.cameras.main.setBackgroundColor("#dff9ca");
    this.number = Math.floor(Math.random() * 10);
    this.spriteNumber = this.add.sprite(
      width / 2,
      height / 2,
      "numbers",
      this.number
    );
    this.spriteNumber.setOrigin(0.5, 0.5);

    var higherButton = this.add
      .sprite(width / 2, height / 2 - 200, "higher")
      .setInteractive()
      .on("pointerup", () => {
        if (!this.isGameOver) {
          this.clickedHigher();
        }
      });
    higherButton.setOrigin(0.5, 0.5);
    var lowerButton = this.add
      .sprite(width / 2, height / 2 + 200, "lower")
      .setInteractive()
      .on("pointerup", () => {
        if (!this.isGameOver) {
          this.clickedLower();
        }
      });
    lowerButton.setOrigin(0.5, 0.5);

    this.backBtn = this.add
      .sprite((width - 150) / 2, height - 150, "backBtn", 0)
      .setInteractive()
      .setOrigin(0, 0)
      .on("pointerover", () => {
        this.backBtn.setFrame(1);
      })
      .on("pointerdown", () => {
        this.backBtn.setFrame(2);
      })
      .on("pointerup", () => {
        this.backBtn.setFrame(0);
        eventsCenter.emit('updateHiLoGame', this.number)
        this.scene.start("mainBody", {style: "hiLoGame", score: this.isGameOver?this.number:0});
        this.spriteNumber = null;
        this.number = 0;
        this.workingButtons = true;
        this.higher = true;
        this.score = 0;
        this.isGameOver = false;
      })
      .on("pointerout", () => {
        this.backBtn.setFrame(0);
      });
    this.textArea = this.add.text(10, 10, "Score:0", {
      font: "bold 24px Arial",
    }).setColor("0x000000");

    this.gameOverText = this.add
      .text(width/2, height/2, "Game Over", {
        font: "bold 72px Arial", 
      })
      .setOrigin(0.5, 0.5)
      .setDepth(99999)
      .setVisible(false)
  }
  clickedHigher() {
    this.higher = true;
    this.tweenNumber(true);
  }
  clickedLower() {
    this.higher = false;
    this.tweenNumber(false);
  }
  tweenNumber(higher) {
    if (this.workingButtons) {
      this.workingButtons = false;
      this.tweens.add({
        targets: this.spriteNumber,
        x: width,
        duration: 500,
        yoyo: false,
        ease: "Linear",
        onComplete: () => {
          this.exitNumber();
        },
      });
    }
  }
  exitNumber() {
    this.spriteNumber.x = -width / 2;
    this.spriteNumber.setFrame(Math.floor(Math.random() * 10));
    this.tweens.add({
      targets: this.spriteNumber,
      x: width / 2,
      duration: 500,
      yoyo: false,
      ease: "linear",
      onComplete: () => {
        this.enterNumber();
      },
    });
  }
  enterNumber() {
    this.workingButtons = true;
    if (
      (this.higher && this.spriteNumber.frame.name < this.number) ||
      (!this.higher && this.spriteNumber.frame.name > this.number)
    ) {
      // this.textArea.setText("Game Over");
      this.gameOverText.setVisible(true).setColor("red")
      this.isGameOver = true;
      this.cameras.main.setBackgroundColor("#caf9df");
    } else {
      this.score++;
      this.textArea.setText(`Score:${this.score}`);
      this.number = this.spriteNumber.frame.name;
    }
  }
}

export default HighLow;
