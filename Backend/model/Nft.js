const mongoose = require("mongoose");
const Nft = new mongoose.Schema({
  nft_address: {
    type: String,
    required: true,
  }, 
  level: {
    type: String, 
  }, 
  hunger: {
    type: String, 
  }, 
  fun: {
    type: String, 
  }, 
  energy: {
    type: String, 
  }, 
  xp: {
    type: String, 
  }, 
  excretaCount: {
    type: String, 
  }, 
  spendXP: {
    type: String, 
  }, 
});
module.exports = mongoose.model("nft", Nft);
