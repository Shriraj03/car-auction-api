import mongoose from "mongoose";
import bcrypt from "bcrypt"

const dealerSchema = new mongoose.Schema({
    dealerId : {type:String,required:true,unique:true},
    dealerName :{type:String,required:true},
    dealerEmail : {type:String,required:true,unique:true,lowercase:true},
    dealerPassword : {type:String,required: true, unique: true},
    auctions :[{type:mongoose.Schema.Types.ObjectId,ref:"Auction"}],
    TimeStamps : {createdAt:true,updatedAt:false}
});

//Hashing the password before saving
dealerSchema.pre("save",async function (next) {
    if(!this.isModified("dealerPassword")) return next() // preventing rehashing saved password
    
    this.dealerPassword = await bcrypt.hash(this.dealerPassword,10)
    next()
})

//Comparing the saved password and input password
dealerSchema.methods.isPasswordCorrect = async function(dealerPassword){
    return await bcrypt.compare(dealerPassword,this.dealerPassword)
}






const Dealer = mongoose.model("Dealer", dealerSchema);

export default Dealer;

