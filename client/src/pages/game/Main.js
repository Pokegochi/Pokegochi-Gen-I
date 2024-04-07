import Phaser from "phaser";
import { useEffect } from "react";
import OnePlusTwo from "./scenes/mini-games/OnePlusTwo/OnePlusTwo";
import HighLow from "./scenes/mini-games/HiLow/HiLow";
import MainBody from "./scenes/mainbody";
import Loading from "./scenes/Loading";
import IHateRabbits from "./scenes/mini-games/IHateRabbits/IHateRabbits";
import { getWidth } from "../../utils/utils";

const Main = () => {
  useEffect(() => {
    const width = getWidth();

    const config = {
      type: Phaser.AUTO,
      parent: "game",
      physics: {
        default: "arcade",
        arcade: {
          //debug: true,
          gravityY: 0,
        },
      },
      scale: {
        // mode: isMobile() ? Phaser.Scale.NONE : Phaser.Scale.NONE,
        mode: Phaser.Scale.FIT,
        parent: "game",
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: width,
        height: window.innerHeight,
      },
      backgroundColor: "#dff8d0",
      scene: [MainBody, Loading, OnePlusTwo, HighLow, IHateRabbits],
    };

    var game = new Phaser.Game(config);

    game.scene.start("mainBody");

    return () => {
      game = null;
    };
  }, []);

  return (
    <>
      {/* <Link to="/withdraw" id="navTowith" /> */}
      <div className="h-screen flex items-center justify-center">
        <div id="game"></div>
      </div>
    </>
  );
};

export default Main;
