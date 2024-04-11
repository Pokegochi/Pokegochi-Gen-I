import { Math as PhaserMath, Scene } from "phaser";
import { isMobile } from "../../../../../utils/utils";
import eventsCenter from "../../EventCenter";

var width = isMobile() ? window.innerWidth : 500;
var height = window.innerHeight;

class OnePlusTwo extends Scene {
  constructor(props) {
    super(props);
    this.sumsArray = [];
    this.score = 0;
    this.isGameOver = false;
    this.numbersArray = [-3, -2, -1, 1, 2, 3];
    this.randomSum = 0;
  }

  preload() {
    this.load.image("timebar", "assets/OnePlusTwo/timebar.png");
    this.load.image("buttonmask", "assets/OnePlusTwo/buttonmask.png");
    this.load.spritesheet("buttons", "assets/OnePlusTwo/buttons.png", {
      frameWidth: 400,
      frameHeight: 50,
    });

    this.load.spritesheet("backBtn", "assets/mainBody/back/button.png", {
      frameWidth: 150,
      frameHeight: 75,
    });
  }

  update() {}
  create() {
    this.topScore =
      localStorage.getItem("topScore") == null
        ? 0
        : localStorage.getItem("topScore");
    this.cameras.main.setBackgroundColor("#dff9ca");

    for (var i = 1; i < 5; i++) {
      this.sumsArray[i] = [[], [], []];
      for (var j = 1; j <= 3; j++) {
        this.buildThrees(j, 1, i, j);
      }
    }

    this.gameOverText = this.add
      .text(width/2, height/2, "Game Over", {
        font: "bold 72px Arial", 
      })
      .setOrigin(0.5, 0.5)
      .setDepth(99999)
      .setVisible(false)

    this.questionText = this.add
      .text(width / 2, 160, "-", {
        font: "bold 72px Arial",
      })
      .setColor("0xffffff")
      .setOrigin(0.5, 0.5);

    this.scoreText = this.add.text(10, 10, "-", {
      font: "bold 24px Arial",
    }).setColor("0xffffff");

    for (let i = 0; i < 3; i++) {
      this.add
        .sprite(width / 2, 250 + i * 75, "buttons", i)
        .setInteractive()
        .setOrigin(0.5, 0)
        .on("pointerdown", () => {
          if (!this.isGameOver) {
            if (i === this.randomSum) {
              this.score += Math.floor(
                (this.buttonMask.geometryMask.x + 350) / 4
              );
              this.nextNumber();
            } else {
              if (this.score > 0) {
                this.timeTween.stop();
              }

              this.gameOver(i + 1);
            }
          }
        });
    }
    this.numberTimer = this.add
      .sprite(width / 2, 250, "timebar")
      .setOrigin(0.5, 0);
    this.nextNumber();

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
        eventsCenter.emit('updateNumberGame', this.score)
        this.scene.start("mainBody", {style: "numberGame", score: this.isGameOver?this.score:0});
        this.sumsArray = [];
        this.score = 0;
        this.isGameOver = false;
        this.numbersArray = [-3, -2, -1, 1, 2, 3];
        this.randomSum = 0;
      })
      .on("pointerout", () => {
        this.backBtn.setFrame(0);
      });
  }

  gameOver(gameOverString) {
    this.cameras.main.setBackgroundColor("#caf9df");
    this.questionText.setText(this.questionText.text + " = " + gameOverString);
    this.isGameOver = true;
    this.gameOverText.setVisible(true).setColor("red")
    localStorage.setItem("topScore", Math.max(this.score, this.topScore));
  }

  nextNumber() {
    this.scoreText.text =
      "Score: " +
      this.score.toString() +
      "\nBest Score: " +
      this.topScore.toString();
    if (this.buttonMask) {
      this.buttonMask.geometryMask.destroy();
      if (this.timeTween) this.timeTween.remove();
    }
    const shape = this.make.graphics();
    shape.setPosition(width / 2 - 200, 250);
    shape.fillRect(0, 0, 400, 200);
    shape.fillStyle(0x000000);
    this.buttonMask = shape.createGeometryMask();

    this.numberTimer.setMask(this.buttonMask);
    if (this.score > 0) {
      this.timeTween = this.tweens.add({
        targets: shape,
        x: -350,
        duration: 3000,
        yoyo: true,
        ease: "Linear",
        onComplete: () => {
          this.gameOver("?");
        },
      });
    }
    this.randomSum = PhaserMath.Between(0, 2);
    this.questionText.setText(
      this.sumsArray[Math.min(Math.round((this.score - 100) / 400) + 1, 4)][
        this.randomSum
      ][
        PhaserMath.Between(
          0,
          this.sumsArray[Math.min(Math.round((this.score - 100) / 400) + 1, 4)][
            this.randomSum
          ].length - 1
        )
      ]
    );
  }
  buildThrees(initialNummber, currentIndex, limit, currentString) {
    for (var i = 0; i < this.numbersArray.length; i++) {
      var sum = initialNummber + this.numbersArray[i];
      var outputString =
        currentString +
        (this.numbersArray[i] < 0 ? "" : "+") +
        this.numbersArray[i];
      if (sum > 0 && sum < 4 && currentIndex === limit) {
        this.sumsArray[limit][sum - 1].push(outputString);
      }
      if (currentIndex < limit) {
        this.buildThrees(sum, currentIndex + 1, limit, outputString);
      }
    }
  }
}

export default OnePlusTwo;
