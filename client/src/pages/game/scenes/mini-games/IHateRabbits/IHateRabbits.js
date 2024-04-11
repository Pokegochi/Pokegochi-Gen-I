import { Input, Scene } from "phaser";
import { isMobile } from "../../../../../utils/utils";
import eventsCenter from "../../EventCenter";

const MAP = [
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0],
  [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1],
  [0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1],
  [0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1],
  [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0],
  [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

var width = isMobile() ? window.innerWidth : 500;
var height = window.innerHeight;

class IHateRabbits extends Scene {
  constructor(props) {
    super("iHateRabbits");
    this.gameInit = false;
    this.gameStart = false;
    this.SCORE = 65;
    this.LEVEL = 0;

    this.changeLevel = true;
  }

  endGame() {
    this.gameInit = false;
    this.gameStart = false;
    this.SCORE = 65;
    this.LEVEL = 0;
    this.changeLevel = true;
  }
  preload() {
    this.load.image("rabbit", "assets/IHateRabbits/rabbit2.png");
    this.load.image("circle", "assets/IHateRabbits/circle.png");
    this.load.spritesheet("bad", "assets/IHateRabbits/bad.png", {
      frameWidth: 36,
      frameHeight: 40,
    });

    this.load.spritesheet("backBtn", "assets/mainBody/back/button.png", {
      frameWidth: 150,
      frameHeight: 75,
    });
  }
  init() {}
  create() {
    this.cameras.main.setBackgroundColor("#dff9ca");

    this.bad = this.add
      .sprite(width / 2, height / 2 - 120, "bad")
      .setOrigin(0.5, 1);
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("bad", { start: 0, end: 1 }),
      frameRate: 5,
      repeat: -1,
    });
    this.circle = this.add
      .sprite(width / 2, height / 2, "circle")
      .setOrigin(0.5, 0.5);
    this.input.on("pointerdown", (pointer, listener) => {
      if (listener.length === 0 || this.LEVEL === 9) this.handleSpace();
    });
    this.spaceKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.SPACE);
    this.spaceKey.on("down", () => {
      this.handleSpace();
    });
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
        eventsCenter.emit('updateRabbitGame', this.SCORE)
        this.scene.start("mainBody", {style: "rabbitGame", score: (this.LEVEL===9)?this.SCORE:0});
        this.endGame();
      })
      .on("pointerout", () => {
        this.backBtn.setFrame(0);
      });
    this.textArea = this.add.text(10, 10, "Score:65", {
      font: "bold 24px Arial",
    }).setColor("black");
    this.textLevel = this.add
      .text(width / 2, height / 2, "Level:1", {
        font: "bold 32px Arial",
      })
      .setOrigin(0.5, 0.5).setColor("black").setFontStyle("bold");
    
    this.gameOverText = this.add
      .text(width/2, height/2, "Game Over", {
        font: "bold 72px Arial", 
      })
      .setOrigin(0.5, 0.5)
      .setDepth(99999)
      .setVisible(false)
  }
  update() {
    if (!this.gameStart) return;
    if (this.rabbits?.getChildren().length === 0) return;

    this.physics.world.overlap(this.bad, this.rabbits, this.hit, null, this);
    if (this.bad.angle >= -2 && this.bad.angle <= 2 && this.changeLevel) {
      this.changeLevel = false;
      this.drawLevel();
    } else if (this.bad.angle > 2) {
      this.changeLevel = true;
    }
    this.bad.angle += 1.5;

    var x =
      width / 2 +
      (this.circle.width / 2 - 4) * Math.cos(this.bad.rotation - Math.PI / 2);
    var y =
      height / 2 +
      (this.circle.width / 2 - 4) * Math.sin(this.bad.rotation - Math.PI / 2);
    this.bad.setPosition(x, y);
  }
  hit(bad, rabbit) {
    rabbit.setActive(false);
    rabbit.setVisible(false);
    this.physics.world.disable(rabbit);
    this.SCORE--;
    this.textArea.setText(`Score:${this.SCORE}`);
  }
  handleSpace() {
    if (this.gameStart) {
      if (!this.rabbits) return;
      var min = 20;
      var minR = null;

      this.rabbits.getChildren().forEach((r) => {
        if (r.jump === false && r.pos < min && r.active) {
          min = r.pos;
          minR = r;
        }
      });
      var rabbit = minR;
      if (min !== 20 && !rabbit.t.isPlaying()) {
        var x =
          width / 2 +
          (this.circle.width / 2 + 90) *
            Math.cos(rabbit.rotation - Math.PI / 2);
        var y =
          height / 2 +
          (this.circle.width / 2 + 90) *
            Math.sin(rabbit.rotation - Math.PI / 2);

        var oX = rabbit.x;
        var oY = rabbit.y;
        this.tweens.add({
          targets: rabbit,
          x: x,
          y: y,
          duration: 400,
          ease: "Linear",
          delay: 0,
          onComplete: () => {
            this.tweens.add({
              targets: rabbit,
              x: oX,
              y: oY,
              ease: "Linear",
              duration: 500,
            });
          },
        });
        rabbit.jump = true;
      }
    } else {
      this.bad.anims.play("walk");
      this.rabbits = this.add.group();
      this.rabbits.createMultiple({
        quantity: 30,
        key: "rabbit",
        active: false,
        visible: false,
      });
      this.physics.world.enable(this.bad);
      this.gameStart = true;
    }
  }
  drawLevel() {
    if (this.LEVEL === 9) {
      this.gameStart = false;
      this.cameras.main.setBackgroundColor("#caf9df");
      this.gameOverText.setVisible(true).setColor("red")
      return;
    }

    this.rabbits.getChildren().forEach((rabbit) => {
      if (rabbit.active)
        this.tweens.add({
          targets: rabbit,
          alpha: 0,
          duration: 300,
          onComplete: () => {
            rabbit.setActive(false);
            rabbit.setVisible(false);
            this.physics.world.disable(rabbit);
          },
        });
    });
    var l = MAP[this.LEVEL];
    for (var i = 0; i < l.length; i++) {
      if (l[i] !== 0) {
        this.addRabbit(i * (Math.PI / 10), i);
      }
    }
    this.LEVEL += 1;
    this.textLevel.setText(`LEVEL:${this.LEVEL}`);
  }
  addRabbit(angle, i) {
    var rabbit = this.rabbits.getFirstDead();
    this.physics.world.enable(rabbit);
    rabbit.setActive(true);
    rabbit.setVisible(true);
    rabbit.rotation = 0;
    rabbit.rotation = angle + Math.PI / 2;

    var xOut = width / 2 + (this.circle.width + 100) * Math.cos(angle);
    var yOut = height / 2 + (this.circle.width + 100) * Math.sin(angle);
    var xIn = width / 2 + (this.circle.width / 2 - 2) * Math.cos(angle);
    var yIn = height / 2 + (this.circle.width / 2 - 2) * Math.sin(angle);

    rabbit.jump = false;
    rabbit.alpha = 1;
    rabbit.pos = i;
    rabbit.setPosition(xOut, yOut);

    rabbit.setOrigin(0.5, 1);
    rabbit.t = this.tweens.add({
      targets: rabbit,
      x: xIn,
      y: yIn,
      duration: 300,
    });
  }
}

export default IHateRabbits;
