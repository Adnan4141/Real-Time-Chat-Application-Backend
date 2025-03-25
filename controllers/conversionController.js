import ConversionModel from "../models/Conversion.js";
import MessageModel from "../models/Message.js";
import UserModel from "../models/User.js";

export const newConversionCreate = async (req, res) => {
  try {
    const userId = req.id;

    const { username, email } = req.body;

    if (!email)
      return res.json({
        message: "Username and email are required",
        success: false,
        error: true,
      });

    const otherUser = await UserModel.findOne({ email });
    const otherUserId = otherUser._id;

    if (!otherUser)
      return res.json({
        message: "Paricipant are not found with this email id",
        success: false,
        error: true,
      });

    const existingConversion = await ConversionModel.findOne({
      participant: { $all: [userId, otherUserId] },
    });

    if (existingConversion)
      return res.json({
        message: "Already exists the conversion",
        success: false,
        error: true,
      });

    const payload = {
      username,
      participant: [userId, otherUserId],
      createdAt: new Date(),
      lastConversion: new Date(),
    };

    const newConversion = new ConversionModel(payload);

     const savedConversions =  await newConversion.save();



    const receiverId = savedConversions.participant.find(
      (participant) => participant.toString() !== userId.toString()
    );

    if (receiverId) {
      console.log(receiverId)
      req.io.emit("receiver_id", receiverId);
    }

    return res.json({
      message: "Conversion created successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      message: error.message,
      success: true,
      error: false,
    });
  }
};

export const getConversionsList = async (req, res) => {
  try {
    const id = req.id;
    const { query } = req.query;

    const user = await UserModel.findById(id).select("username email photo");

    const conversions = await ConversionModel.find({
      participant: { $in: [id] },
    })
      .populate({
        path: "participant",
        select: "username photo",
      })
      .sort({ lastConversion: -1 });

    const conversionList = await Promise.all(
      conversions.map(async (conv) => {
        const otherUser = conv.participant.filter(
          (item) => item._id.toString() !== id.toString()
        );
     
        const messages = conv.messages;
        const lastMessageId = messages[messages.length - 1];

        const lastMessage = await MessageModel.findOne({
          _id: lastMessageId,
        })
          .sort({ createdAt: -1 })
          .limit(1);
   
          
        return {
          _id: conv._id,
          name: conv.name,
          lastConversion: conv.lastConversion,
          lastMessage: lastMessage,
          otherUserName: otherUser[0]?.username,
          otherUserPhoto: otherUser[0]?.photo,
          otherUserId: otherUser[0]?._id,
        };
      })
    );

    if (!conversions)
      return res.json({
        message: "Conversion not found",
        success: false,
        error: true,
      });

    
    
    return res.json({
      message: "Succefully returned the conversions",
      success: true,
      error: false,
      data: conversionList,
      user,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const getConverstionsMessage = async (req, res) => {
  try {
    const userId = req.id;
    const conversionId = req.params.id;
    const limit = 20;

    const messages = await ConversionModel.findById(conversionId).populate({
      path: "messages",
      options: { sort: { createdAt: -1 }, limit: limit },
      populate: { path: "senderId", select: "username photo" },
    });

    if (!messages)
      return res.json({
        message: "Message not found",
        success: false,
        error: true,
      });
    res.cookie("Test","Adnan")
    return res.json({
      message: "Succesfully get Conversion messages",
      success: true,
      error: false,
      data: messages || [],
    });
  } catch (error) {
    console.log(error.message || error);
    return res.json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const deleteConversion = async (req, res) => {
  try {
    const { id } = req.params;
    const conversion = await ConversionModel.findById(id);
    if (!conversion)
      return res.json({
        message: "Conversation not found.",
        success: false,
        error: true,
      });

    await MessageModel.deleteMany({ _id: { $in: conversion.messages } });

    await ConversionModel.findByIdAndDelete(id);



    const receiverId = savedConversions.participant.find(
      (participant) => participant.toString() !== userId.toString()
    );

    if (receiverId) {
      console.log(receiverId)
      req.io.emit("receiver_id", receiverId);
    }



    return res.status(200).json({
      message: "Conversation deleted successfully.",
      success: true,
      error: false,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const markMessageAsSeen = async (req, res) => {
  const userId = req.id;
  const conversionId = req.params.id;
  console.log("conversionId",conversionId)

  try {
    const conversion = await ConversionModel.findById(conversionId);

    const unreadMessages = await MessageModel.find({
      _id: { $in: conversion.messages },
      senderId: { $ne: userId },
      seen: false,
    });

    if (unreadMessages.length == 0) {
      return res.status(200).json({
        message: "No unread messages found to mark as seen",
        success: false,
        error: true,
      });
    }

    const updatedMessages = await MessageModel.updateMany(
      {
        _id: { $in: unreadMessages.map((msg) => msg._id) },
      },
      {
        $set: { seen: true },
      },
      {
        new:true
      }
    );

    return res.status(200).json({
      message: "Messages marked as seen successfully",
      success: true,
      data:updatedMessages,
      error: false,
    });


  } catch (error) {
    return res.status(400).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};
