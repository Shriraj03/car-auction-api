const mongoose = require("mongoose");

const dealerSchema = new mongooose.Schema({
    dealerId : {type:String,required:true,unique:true},
    dealerName :{type:String,required:true},
    dealerEmail : {type:String,required:true,unique:true,lowercase:true},
    auctions :[{type:mongoose.Schema.Types.ObjectId,ref:"Auction"}],
    TimeStamps : {createdAt:true,updatedAt:false}
});

const Dealer = mongoose.model("Dealer", dealerSchema);

module.exports = Dealer;