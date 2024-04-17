const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
const User = require("../../model/User");
const Nft = require("../../model/Nft");
const {ShyftSdk, Network} = require("@shyft-to/js")

// @route    POST api/users
// @desc     Register user
// @access   Public
const { withDraw, addScore, addEarn } = require("../../api/api");

const SHYFT_API = config.get("shyftAPI")
const shyft = new ShyftSdk({ apiKey: SHYFT_API, network: Network.Mainnet });

const collectAddress = config.get("collectAddress")

router.post("/withdraw", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.earn > 0 && user.earn <= 100000) {
      let amount = user.earn;
      user.earn = 0;
      await user.save();
      await withDraw(user.solana_wallet, amount);
      res.status(200).send("success");
    } else {
      res.status(400).json({ errors: [{ msg: "No Earning!" }] });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/retrieve", async (req, res) => {
  console.log("retrieve")
  try {
      
  } catch(err) {
      console.log(err)
      res.status(400).send()
  }
})

router.post("/addScore", auth, async (req, res) => {
  try {

    console.log("addscore", req.user.id, req.body.score);
    await addScore(req.user.id, req.body.score, req.body.sec);
    res.status(200).send("success");
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get('/security', auth, async (req, res) => {
  try {
    var value = String(Math.random() * 10000);
    const user = await User.findById(req.user.id);
    user.sec = value;
    await user.save();
    res.status(200).send(value);
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
})

router.post("/addEarn", auth, async (req, res) => {
  try {
    console.log("addEarn", req.user.id, req.body.earn);
    await addEarn(req.user.id, req.body.earn, req.body.sec);
    res.status(200).send("success");
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/all", async (req, res) => {
  try {
    const users = await User.find().sort({ "earn": -1 });
    res.json(users)
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }

})

router.get("/", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    const walletAddress = user.solana_wallet;
    const nft = await shyft.nft.getNftByOwner({owner: walletAddress})
    const filteredNft = nft.filter(el => el.collection?.address?.toString() === collectAddress)
    const data = user._doc;
    user.nft = filteredNft

    res.json({...data, nft: filteredNft});
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/signup", async (req, res) => {
  console.log(req.body);
  const { name, wallet } = req.body;
  try {
    let user = await User.findOne({ solana_wallet: wallet });
    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }
    user = new User({
      name: name,
      solana_wallet: wallet,
    });

    await user.save();

    const payload = {
      user: {
        id: user._id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/login", async (req, res) => {
  const { wallet } = req.body;

  console.log(wallet);

  try {
    let user = await User.findOne({ solana_wallet: wallet });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/getNft", async (req, res) => {
  const { nftAddress } = req.body
  try {
    let nft = await Nft.findOne({ nft_address: nftAddress });
    if (nft) {
      return res.json(nft)
    } else {
      return res.status(405).send("No result")
    }
  } catch (err) {
    console.log(err)
    return res.status(404).send("Server Error")
  }
})

router.post("/jwtheader", async (req, res) => {
  console.log("jwtheader")
  try {
    const { nftAddress } = req.body
    const timeStamp = (new Date()).getTime()
    const payload = {
      date: timeStamp, 
      nftAddress: nftAddress, 
      // Add any other data you want to include in the token payload
    };

    const token = jwt.sign(payload, config.get("secretKey"), { expiresIn: '5m' }); // Token expires in 5 minutes
    return res.json({token: token})
  } catch(err) {
    console.log(err)
    return res.status(404).send("Server Error")
  }
})

router.post("/update", async (req, res) => {
  console.log("update")
  try {
    const { nftAddress, level, hunger, fun, energy, xp, excretaCount, spendXP } = req.body
    const token = req.headers["jwt-header"]
    const decoded = jwt.verify(token, config.get("secretKey"));
    if (nftAddress === decoded.nftAddress) {
      let nft = await Nft.findOne({ nft_address: nftAddress });
      if (nft) {
        await Nft.findOneAndUpdate(
          { nft_address: nftAddress }, 
          { level: level, 
            hunger: hunger, 
            fun: fun, 
            energy: energy, 
            xp: xp, 
            excretaCount: excretaCount, 
            spendXP: spendXP 
          }, 
          { new: true }
        )
      } else {
        nft = new Nft({
          nft_address: nftAddress, 
          level: level, 
          hunger: hunger, 
          fun: fun, 
          energy: energy, 
          xp: xp, 
          excretaCount: excretaCount, 
          spendXP: spendXP
        });
        await nft.save()
      }
      return res.json(nft)
    } else {
      return res.status(406).send("Invalid credential")
    }
  } catch(err) {
    console.log(err)
    return res.status(404).send("Server Error")
  }
})

module.exports = router;
