import { Scene } from "phaser";
import { isMobile } from "../../../utils/utils";
import eventsCenter from "./EventCenter";

import effect from "./assets/mainbody/effect/spritesheet.png"
import effectJson from "./assets/mainbody/effect/sprites.json"

var width = isMobile() ? window.innerWidth : 500;
var height = window.innerHeight;

class MainBody extends Scene {
  constructor(props) {
    super("mainBody");
    this.level = 1;
    this.hunger = 100;
    this.fun = 100;
    this.energy = 100;
    this.xp = 0;
    this.dialog = {};
    this.feedDialog = {};
    this.excreta = [];
    this.excretaCount = 0;
    this.spendXP = 0;

    this.delayInMilliseconds = 10000;
    this.delayExcretaInMilliseconds = 60000;
    this.delayPushExcreta = 2000;
  }

  preload() {
    this.load.image(
      "machine1",
      "assets/sprites/Background_/Machine_/Machine_1.png"
    );
    this.load.image(
      "machine2",
      "assets/sprites/Background_/Machine_/Machine_2.png"
    );
    this.load.image(
      "machine3",
      "assets/sprites/Background_/Machine_/Machine_3.png"
    );
    this.load.image(
      "machine4",
      "assets/sprites/Background_/Machine_/Machine_4.png"
    );
    this.load.image(
      "machine5",
      "assets/sprites/Background_/Machine_/Machine_5.png"
    );

    this.load.spritesheet("playButtons", "assets/mainBody/play/button.png", {
      frameWidth: 150,
      frameHeight: 75,
    });
    this.load.spritesheet("feedButtons", "assets/mainBody/feed/button.png", {
      frameWidth: 150,
      frameHeight: 75,
    });
    this.load.spritesheet("cleanButtons", "assets/mainBody/clean/button.png", {
      frameWidth: 150,
      frameHeight: 75,
    });

    for (let i = 0; i < 14; i++) {
      this.load.image(`cha${i + 1}`, `assets/sprites/Adult/12/${i + 1}.png`);
    }

    this.load.image("dialog", "assets/mainBody/mini-games/dialog.png");
    this.load.spritesheet(
      "numberGame",
      "assets/mainBody/mini-games/numbers/button.png",
      {
        frameWidth: 100,
        frameHeight: 100,
      }
    );
    this.load.spritesheet(
      "hiloGame",
      "assets/mainBody/mini-games/hilo/button.png",
      {
        frameWidth: 100,
        frameHeight: 100,
      }
    );
    this.load.spritesheet(
      "rabbitGame",
      "assets/mainBody/mini-games/rabbit/button.png",
      {
        frameWidth: 100,
        frameHeight: 100,
      }
    );
    this.load.spritesheet(
      "breadImage",
      "assets/feed/bread.png",
      {
        frameWidth: 100,
        frameHeight: 100,
      }
    );
    this.load.spritesheet(
      "tomatoImage",
      "assets/feed/tomato.png",
      {
        frameWidth: 100,
        frameHeight: 100,
      }
    );
    this.load.spritesheet(
      "meatImage",
      "assets/feed/meat.png",
      {
        frameWidth: 100,
        frameHeight: 100,
      }
    );
    this.load.spritesheet(
      "iceCreamImage",
      "assets/feed/iceCream.png",
      {
        frameWidth: 100,
        frameHeight: 100,
      }
    );
    this.load.spritesheet(
      "closeImage",
      "assets/mainBody/close/button.png",
      {
        frameWidth: 25,
        frameHeight: 11,
      }
    );
    this.load.image("excretaImage1", "assets/mainBody/excreta/1.png");
    this.load.image("excretaImage2", "assets/mainBody/excreta/2.png");
    this.load.image("excretaImage3", "assets/mainBody/excreta/3.png");

    this.load.atlas('effectSpreat', effect, effectJson);
  }

  disableInput() {
    this.playButton.disableInteractive();
    this.feedButton.disableInteractive();
    this.cleanButton.disableInteractive();
  }

  enableInput() {
    this.playButton.setInteractive();
    this.feedButton.setInteractive();
    this.cleanButton.setInteractive();
  }

  async update() {
    this.levelBar.setText(this.level)
    this.hungerBar.setSize(this.hunger * 2, this.hungerBar.height)
    this.funBar.setSize(this.fun * 2, this.funBar.height)
    this.energyBar.setSize(this.energy * 2, this.energyBar.height)
    this.xpBar.setText(this.xp)

    for (let i = 0; i < 4; i++) {
      this.excreta[i].setVisible(false)
    }

    for (let i = 0; i < this.excretaCount; i++) {
      this.excreta[i].setVisible(true)
    }
  }

  updateSpecies () {
    if (this.energy > 100) this.energy = 100;
    if (this.energy < 0) this.energy = 0;

    if (this.hunger > 100) this.hunger = 100;
    if (this.hunger < 0) this.hunger = 0;

    if (this.fun > 100) this.fun = 100;
    if (this.fun < 0) this.fun = 0;
  }

  updateTimer() {
    console.log("updateTimer", this.hunger, this.fun, this.energy)
    if (this.hunger > 0) {
      this.hunger -= 1;
    } else {
      this.energy -= 0.2;
    }

    if (this.fun > 0) {
      this.fun -= 2;
    } else {
      this.energy -= 0.2;
    }

    // if (this.energy > 0)
    //   this.energy -= 0.5;

    this.updateSpecies();
  }

  pushExcreta() {
    this.excretaCount ++
    this.xp ++
    this.character.play("characterImage")
    if (this.excretaCount > 4) {
      this.excretaCount = 4
      return
    }
    
    this.spendXP += 1
    if(this.spendXP >= this.level * this.level * this.level) {
      this.spendXP -= this.level * this.level * this.level
      this.level ++
      this.effect.play("EffectImage")
    }
  }

  updateExcretaTimer() {
    this.character.stop();
    this.time.delayedCall(this.delayPushExcreta, this.pushExcreta, [], this)
  }

  updateNumberGame(score) {
    console.log("updateNumberGame", score)
    this.energy -= 10;
    if (score >= 2000) {
      this.fun += 40;
    } else if (score >= 1500) {
      this.fun += 30;
    } else if (score >= 1000) {
      this.fun += 25;
    } else if (score >= 500) {
      this.fun += 20;
    } else {
      this.fun += 15;
    }
    this.updateSpecies()
  }

  updateHiLoGame(score) {
    console.log("updateHiLoGame", score)
    this.energy -= 5;
    if (score > 20) {
      this.fun += 40;
    } else if (score > 10) {
      this.fun += 20;
    } else if (score > 5) {
      this.fun += 10;
    } else if (score > 1) {
      this.fun += 5;
    } else {
      this.fun += 2;
    }
    this.fun += 20
    this.updateSpecies()
  }

  updateRabbitGame(score) {
    console.log("updateRabbitGame", score)
    this.energy -= 20;
    if (score <= 0) {
      this.fun += 5;
    } else if (score < 15) {
      this.fun += 10;
    } else if (score < 30) {
      this.fun += 20;
    } else if (score < 45) {
      this.fun += 30;
    } else {
      this.fun += 40;
    }
    this.updateSpecies()
  }

  init() {
    console.log("init")
  }

  async create(data) {
    console.log("create", data)
    this.cameras.main.setBackgroundColor("#dff9ca");

    this.anims.create({
      key: "machineImage",
      frames: [
        { key: "machine1" },
        { key: "machine2" },
        { key: "machine3" },
        { key: "machine4" },
        { key: "machine5" },
      ],
      frameRate: 5,
      repeat: -1,
    });

    const frames = [];
    for (let i = 0; i < 14; i++) {
      frames.push({ key: `cha${i + 1}` });
    }

    this.anims.create({
      key: "characterImage",
      frames: frames,
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "EffectImage", 
      frames: this.anims.generateFrameNames('effectSpreat', { prefix: '', start: 1, end: 34, zeroPad: 0, }), 
      frameRate: 5, 
      repeat: 0, 
    })

    this.add
      .sprite(width / 2, height / 2, "machine")
      .setScale(0.5, 0.5)
      .play("machineImage");
    this.character = this.add
      .sprite(width / 2, height / 2, "character")
      .setScale(0.25, 0.25)
      .setOrigin(0.5, 0.5)
      .play("characterImage");
    this.effect = this.add
      .sprite(width / 2, height / 2, "EffectAnimation")
      .setOrigin(0.5, 0.5)
      .setScale(0.5, 0.5)
    
    if (data && ( data.style === "numberGame" || data.style === "hiLoGame" || data.style === "rabbitGame" ) && data.score > 0) {
      console.log("effect start")
      this.effect.play("EffectImage");
    } else {
      this.effect.setVisible(false)
    }

    this.anims.create({
      key: "excretaAnimation1",
      frames: [
        { key: "excretaImage1" },
        { key: "excretaImage2" },
        { key: "excretaImage3" },
      ],
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "excretaAnimation2",
      frames: [
        { key: "excretaImage2" },
        { key: "excretaImage3" },
        { key: "excretaImage1" },
      ],
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "excretaAnimation3",
      frames: [
        { key: "excretaImage3" },
        { key: "excretaImage2" },
        { key: "excretaImage1" },
      ],
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "excretaAnimation4",
      frames: [
        { key: "excretaImage2" },
        { key: "excretaImage1" },
        { key: "excretaImage3" },
      ],
      frameRate: 5,
      repeat: -1,
    });

    for (let i = 0; i < 4; i++) {
      this.excreta[i] = this.add
        .sprite(width/2 - 85 + 60 * i, height/2 + 100, "excreta")
        .setScale(1.5, 1.5)
        .play(`excretaAnimation${i+1}`)
        .setVisible(false);
    }

    {
      this.levelText = this.add
        .text(width - 300, 25, `Level:`, {fontFamily: '"Press Start 2P"', color: "0x013220", fontSize: 16, fontStyle: 'bold'})
        .setOrigin(0, 0);
      this.levelBar = this.add
        .text(width - 200, 25, `${this.level}`, {fontFamily: '"Press Start 2P"', color: "0x013220", fontSize: 16, fontStyle: 'bold'})
        .setOrigin(0, 0);

      this.hungerText = this.add
        .text(width - 300, 55, `Hunger:`, {fontFamily: '"Press Start 2P"', color: "0x013220", fontSize: 16, fontStyle: 'bold'})
        .setOrigin(0, 0);
      this.add.rectangle(width - 200, 50, 200, 25, 0xdff8d0)
        .setOrigin(0, 0)
        .setDepth(0)
        .setScrollFactor(0);
      this.hungerBar = this.add
        .rectangle(width - 200, 50, this.hunger * 2, 25, 0x013220)
        .setOrigin(0, 0)
        .setDepth(0)
        .setScrollFactor(0);
      
      this.funText = this.add
        .text(width - 300, 85, `Fun:`, {fontFamily: '"Press Start 2P"', color: "0x013220", fontSize: 16, fontStyle: 'bold'})
        .setOrigin(0, 0);
      this.add.rectangle(width - 200, 80, 200, 25, 0xdff8d0)
        .setOrigin(0, 0)
        .setDepth(0)
        .setScrollFactor(0);
      this.funBar = this.add
        .rectangle(width - 200, 80, this.fun * 2, 25, 0x013220)
        .setOrigin(0, 0)
        .setDepth(0)
        .setScrollFactor(0);
      
      this.energyText = this.add
        .text(width - 300, 115, `Energy:`, {fontFamily: '"Press Start 2P"', color: "0x013220", fontSize: 16, fontStyle: 'bold'})
        .setOrigin(0, 0);
      this.add.rectangle(width - 200, 110, 200, 25, 0xdff8d0)
        .setOrigin(0, 0)
        .setDepth(0)
        .setScrollFactor(0);
      this.energyBar = this.add
        .rectangle(width - 200, 110, this.energy * 2, 25, 0x013220)
        .setOrigin(0, 0)
        .setDepth(0)
        .setScrollFactor(0);

      this.xpText = this.add
        .text(width - 300, 145, `XP:`, {fontFamily: '"Press Start 2P"', color: "0x013220", fontSize: 16, fontStyle: 'bold'})
        .setOrigin(0, 0);
      this.xpBar = this.add
        .text(width - 200, 145, `${this.xp}`, {fontFamily: '"Press Start 2P"', color: "0x013220", fontSize: 16, fontStyle: 'bold'})
        .setOrigin(0, 0);
    }

    {
      this.playButton = this.add
        .sprite(0, height - 75, "playButtons", 0)
        .setInteractive()
        .setOrigin(0, 0)
        .on("pointerover", () => {
          this.playButton.setFrame(1);
        })
        .on("pointerdown", () => {
          this.playButton.setFrame(2);
        })
        .on("pointerup", () => {
          this.playButton.setFrame(0);
          this.disableInput();
          this.foregroundImage.setVisible(true);
          this.dialog.container.setVisible(true);
        })
        .on("pointerout", () => {
          this.playButton.setFrame(0);
        });

      this.feedButton = this.add
        .sprite(width / 2, height - 75, "feedButtons", 0)
        .setInteractive()
        .setOrigin(0.5, 0)
        .on("pointerover", () => {
          this.feedButton.setFrame(1);
        })
        .on("pointerdown", () => {
          this.feedButton.setFrame(2);
        })
        .on("pointerup", () => {
          this.feedButton.setFrame(0);
          this.disableInput();
          this.foregroundImage.setVisible(true);
          this.feedDialog.container.setVisible(true)
        })
        .on("pointerout", () => {
          this.feedButton.setFrame(0);
        });

      this.cleanButton = this.add
        .sprite(width - 150, height - 75, "cleanButtons", 0)
        .setInteractive()
        .setOrigin(0, 0)
        .on("pointerover", () => {
          this.cleanButton.setFrame(1);
        })
        .on("pointerdown", () => {
          this.cleanButton.setFrame(2);
        })
        .on("pointerup", () => {
          this.cleanButton.setFrame(0);
          this.excretaCount = 0;
        })
        .on("pointerout", () => {
          this.cleanButton.setFrame(0);
        });
    }

    this.foregroundImage = this.add.rectangle(0, 0, width, height, 0x000000, 0.3)
      .setOrigin(0, 0)
      .setDepth(1)
      .setScrollFactor(0)
      .setVisible(false);

    {
      this.dialog.width = 300;
      this.dialog.height = 300;
      this.dialog.x = (width - this.dialog.width) / 2;
      this.dialog.y = (height - this.dialog.height) / 2;

      this.playground = this.add.image(0, 0, "dialog").setOrigin(0, 0);

      this.numberGameBtn = this.add
        .sprite(0 + 40, 0 + 40, "numberGame", 0)
        .setInteractive()
        .setOrigin(0, 0)
        .on("pointerover", () => {
          this.numberGameBtn.setFrame(1);
        })
        .on("pointerdown", () => {
          this.numberGameBtn.setFrame(2);
        })
        .on("pointerup", () => {
          this.numberGameBtn.setFrame(0);
          this.enableInput()
          this.foregroundImage.setVisible(false)
          this.scene.launch("onePlusTwo");
          this.dialog.container.setVisible(false);
        })
        .on("pointerout", () => {
          this.numberGameBtn.setFrame(0);
        });

      this.hiloGameBtn = this.add
        .sprite(0 + 160, 0 + 40, "hiloGame", 0)
        .setInteractive()
        .setOrigin(0, 0)
        .on("pointerover", () => {
          this.hiloGameBtn.setFrame(1);
        })
        .on("pointerdown", () => {
          this.hiloGameBtn.setFrame(2);
        })
        .on("pointerup", () => {
          this.hiloGameBtn.setFrame(0);
          this.enableInput()
          this.foregroundImage.setVisible(false)
          this.scene.launch("hiLow");
          this.dialog.container.setVisible(false);
        })
        .on("pointerout", () => {
          this.hiloGameBtn.setFrame(0);
        });

      this.rabbitGameBtn = this.add
        .sprite(0 + 40, 0 + 160, "rabbitGame", 0)
        .setInteractive()
        .setOrigin(0, 0)
        .on("pointerover", () => {
          this.rabbitGameBtn.setFrame(1);
        })
        .on("pointerdown", () => {
          this.rabbitGameBtn.setFrame(2);
        })
        .on("pointerup", () => {
          this.rabbitGameBtn.setFrame(0);
          this.enableInput()
          this.foregroundImage.setVisible(false)
          this.scene.launch("iHateRabbits");
          this.dialog.container.setVisible(false);
        })
        .on("pointerout", () => {
          this.rabbitGameBtn.setFrame(0);
        });

      this.playCloseBtn = this.add
        .sprite(this.dialog.width / 2, 0 + 280 - 15, "closeImage", 0)
        .setInteractive()
        .setScale(2, 2)
        .setOrigin(0.5, 0)
        .on("pointerover", () => {
          this.playCloseBtn.setFrame(1);
        })
        .on("pointerdown", () => {
          this.playCloseBtn.setFrame(2);
        })
        .on("pointerup", () => {
          this.playCloseBtn.setFrame(0);
          this.enableInput();
          this.foregroundImage.setVisible(false);
          this.dialog.container.setVisible(false);
        })
        .on("pointerout", () => {
          this.playCloseBtn.setFrame(0);
        });

      this.dialog.container = this.add
        .container(this.dialog.x, this.dialog.y, [
          this.playground,
          this.numberGameBtn,
          this.hiloGameBtn,
          this.rabbitGameBtn,
          this.playCloseBtn, 
        ])
        .setDepth(2)
        .setVisible(false);

      this.input.on("pointerup", (pt) => {
        if (this.dialog.container.visible === true) {
          // console.log("123123123")
          // const x = pt.position.x;
          // const y = pt.position.y;
          // if (x >= this.dialog.x &&  x <= this.dialog.x + this.dialog.width && y >= this.dialog.y && y <= this.dialog.y + this.dialog.height) {
          // } else {
          //   this.dialog.container.setVisible(false)
          // }
        }
      });
    }

    {
      this.feedDialog.width = 300;
      this.feedDialog.height = 300;
      this.feedDialog.x = (width - this.feedDialog.width) / 2;
      this.feedDialog.y = (height - this.feedDialog.height) / 2;

      this.feedground = this.add.image(0, 0, "dialog").setOrigin(0, 0);

      this.breadBtn = this.add
        .sprite(0 + 40, 0 + 40, "breadImage", 0)
        .setInteractive()
        .setOrigin(0, 0)
        .on("pointerover", () => {
          this.breadBtn.setFrame(1);
        })
        .on("pointerdown", () => {
          this.breadBtn.setFrame(2);
        })
        .on("pointerup", () => {
          this.breadBtn.setFrame(0);
          this.enableInput()
          this.foregroundImage.setVisible(false)
          this.feedDialog.container.setVisible(false);
          // this.xp -= 2;
          this.energy += 20;
          this.hunger += 40;
          this.updateSpecies();
        })
        .on("pointerout", () => {
          this.breadBtn.setFrame(0);
        });

      this.tomatoBtn = this.add
        .sprite(0 + 160, 0 + 40, "tomatoImage", 0)
        .setInteractive()
        .setOrigin(0, 0)
        .on("pointerover", () => {
          this.tomatoBtn.setFrame(1);
        })
        .on("pointerdown", () => {
          this.tomatoBtn.setFrame(2);
        })
        .on("pointerup", () => {
          this.tomatoBtn.setFrame(0);
          this.enableInput()
          this.foregroundImage.setVisible(false)
          this.feedDialog.container.setVisible(false);
          // this.xp -= 1;
          this.energy += 10;
          this.hunger += 20;
          this.updateSpecies();
        })
        .on("pointerout", () => {
          this.tomatoBtn.setFrame(0);
        });

      this.meatBtn = this.add
        .sprite(0 + 40, 0 + 160, "meatImage", 0)
        .setInteractive()
        .setOrigin(0, 0)
        .on("pointerover", () => {
          this.meatBtn.setFrame(1);
        })
        .on("pointerdown", () => {
          this.meatBtn.setFrame(2);
        })
        .on("pointerup", () => {
          this.meatBtn.setFrame(0);
          this.enableInput()
          this.foregroundImage.setVisible(false)
          this.feedDialog.container.setVisible(false);
          // this.xp -= 5;
          this.energy += 30;
          this.hunger += 60;
          this.updateSpecies();
        })
        .on("pointerout", () => {
          this.meatBtn.setFrame(0);
        });

      this.iceCreamBtn = this.add
        .sprite(0 + 160, 0 + 160, "iceCreamImage", 0)
        .setInteractive()
        .setOrigin(0, 0)
        .on("pointerover", () => {
          this.iceCreamBtn.setFrame(1);
        })
        .on("pointerdown", () => {
          this.iceCreamBtn.setFrame(2);
        })
        .on("pointerup", () => {
          this.iceCreamBtn.setFrame(0);
          this.enableInput()
          this.foregroundImage.setVisible(false)
          this.feedDialog.container.setVisible(false);
          // this.xp -= 1;
          this.energy += 5;
          this.hunger += 15;
          this.updateSpecies();
        })
        .on("pointerout", () => {
          this.iceCreamBtn.setFrame(0);
        });

      this.feedCloseBtn = this.add
        .sprite(this.dialog.width / 2, 0 + 280 - 15, "closeImage", 0)
        .setInteractive()
        .setScale(2, 2)
        .setOrigin(0.5, 0)
        .on("pointerover", () => {
          this.feedCloseBtn.setFrame(1);
        })
        .on("pointerdown", () => {
          this.feedCloseBtn.setFrame(2);
        })
        .on("pointerup", () => {
          this.feedCloseBtn.setFrame(0);
          this.enableInput()
          this.foregroundImage.setVisible(false)
          this.feedDialog.container.setVisible(false);
        })
        .on("pointerout", () => {
          this.feedCloseBtn.setFrame(0);
        });

      this.feedDialog.container = this.add
        .container(this.feedDialog.x, this.feedDialog.y, [
          this.feedground,
          this.breadBtn,
          this.tomatoBtn,
          this.meatBtn,
          this.iceCreamBtn, 
          this.feedCloseBtn, 
        ])
        .setDepth(2)
        .setVisible(false);

      this.input.on("pointerup", (pt) => {
        if (this.dialog.container.visible === true) {
          // console.log("123123123")
          // const x = pt.position.x;
          // const y = pt.position.y;
          // if (x >= this.dialog.x &&  x <= this.dialog.x + this.dialog.width && y >= this.dialog.y && y <= this.dialog.y + this.dialog.height) {
          // } else {
          //   this.dialog.container.setVisible(false)
          // }
        }
      });
    }
    this.updateTimerEle = this.time.addEvent({delay: this.delayInMilliseconds, loop: true, callback: this.updateTimer, callbackScope: this})
    this.updateTimerExcretaEle = this.time.addEvent({delay: this.delayExcretaInMilliseconds, loop: true, callback: this.updateExcretaTimer, callbackScope: this})

    {
      eventsCenter.off('updateNumberGame')
      eventsCenter.off('updateHiLoGame')
      eventsCenter.off('updateRabbitGame')
      eventsCenter.on('updateNumberGame', this.updateNumberGame, this)
      eventsCenter.on('updateHiLoGame', this.updateHiLoGame, this)
      eventsCenter.on('updateRabbitGame', this.updateRabbitGame, this)
    }
  }
}

export default MainBody;
