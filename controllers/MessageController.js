import ConversionModel from "../models/Conversion.js";
import MessageModel from "../models/Message.js";
import UserModel from "../models/User.js";



export const newMessageCreate = async (req, res) => {
  try {
    const userId = req.id;
    const { text, photo } = req.body;
    const conversionId = req.params.id ;

    if(!conversionId)
      return res.json({
         message: "Conversion Id are required",
         success: false,
         error: true,
       });

    if (!text && !photo)
      return res.json({
        message: "Text  are required",
        success: false,
        error: true,
      });

    const existingConversion = await ConversionModel.findById(
      conversionId
    );

    if (!existingConversion)
      return res.json({
        message: "Conversion not found",
        success: false,
        error: true,
      });

    const payload = {
      text: text || "",
      photo: photo || "",
      senderId: userId || null,
      conversionId: conversionId,
    };

    const newMessage = await MessageModel.create(payload);

    if (!newMessage)
      return res.json({
        message: "Failed to  send message",
        success: true,
        error: false,
       
      });

    const updatedConversion = await ConversionModel.findByIdAndUpdate(
      existingConversion._id,
      {
        $push: { messages: newMessage._id },
        $set: { lastConversion: new Date() },
      },
      { new: true }
    );
    if (!updatedConversion)
      return res.status(400).json({
        message: "failed to update conversion for sending message",
        success: false,
        error: true,
      });

      const receiverId = existingConversion.participant.find(
        (participant) => participant.toString() !== userId.toString()
      );

      if (receiverId) {
        // req.io.to(receiverId.toString()).emit("receive_message", receiverId);
        req.io.emit("receiver_id", receiverId);
      }

      
    return res.json({
      message: "successfully send message",
      success: true,
      error: false,
      data:newMessage
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      message: error.message || error,
      success: true,
      error: false,
    });
  }
};

export const deleteMessage = async (req, res) => {
  const messageId = req.params.id ;
   const userId = req.id; 
  try {
    if(!messageId)
      return res.json({
         message: "MessageId are required",
         success: false,
         error: true,
       });



     const updatedCoversion =   await ConversionModel.findOneAndUpdate(
        {messages:{$in:[messageId]}}, 
        {$pull:{messages:messageId}},
        {new:true}
     )
  

   const deleteMessage = await MessageModel.findOneAndDelete(messageId)


    if (!deleteMessage)
      return res.status(400).json({
        message: "failed to delete Message ",
        success: false,
        error: true,
      });

      
    const receiverId = updatedCoversion.participant.find(
      (participant) => participant.toString() !== userId.toString()
    );

    if (receiverId) {
      console.log(receiverId)
      req.io.emit("receiver_id", receiverId);
    }

    return res.json({
      message: "Successfully delete message",
      success: true,
      error: false,
      data:deleteMessage
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      message: error.message || error,
      success: true,
      error: false,
    });
  }
};

