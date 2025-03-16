import mongoose, {model,Schema } from "mongoose";

const conversionSchema = new Schema({
    name:{
      type:String
    },
    messages:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:"Message"
      }
    ],
    participant:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:"User"
      }
    ],
    lastConversion:{
      type:Date
    }
},

{timestamps:true}
)

const ConversionModel = model("Conversion",conversionSchema)
export default ConversionModel;