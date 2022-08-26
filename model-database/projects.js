require("dotenv").config();
const mongoose = require("mongoose");




mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/web3launchpad",
   { useNewUrlParser: true, useUnifiedTopology: true})
   .then(() => console.log('connected to DB!'))
    .catch(error => console.log(error));



  



//for users collection
const projectSchema = mongoose.Schema({
 dateandtime : {type: Date, default: Date.now},
 name: {type: String, required: true},
 symbol: {type: String, required: true},
 "logo_url": {type: String, required: true},
 description: {type: String, required: true},
 website: {type: String, required: true},
 ama: {type: Date, required: true},
 votes: {type: Number},
 facebook: {type: String, required: true},
 twitter: {type: String, required: true},
 instagram: {type: String, required: true},
 contract: {type: String, required: true},
});


 module.exports = {
   Projects: mongoose.model("Projects", projectSchema),
 }
