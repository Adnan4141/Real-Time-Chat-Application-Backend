import mongoose, {model,Schema} from "mongoose";

const messageSchema = new Schema({
  text:{
   type:String
  },
  photo:{
   type:String,
   default:""
  },
  conversionId:{
    type:mongoose.Schema.Types.ObjectId,
   ref:"Conversion",
  },
  senderId:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"User",
   required:true
  },
  receiverId:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"User"
  },
  seen:{
   type:Boolean,
   default:false
  }
},
{
   timestamps:true
})

const MessageModel = model("Message",messageSchema)
export default MessageModel;