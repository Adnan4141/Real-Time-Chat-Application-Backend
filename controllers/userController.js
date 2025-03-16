import { query } from "express";
import UserModel from "../models/User.js";
import ConversionModel from "../models/Conversion.js";


export const searchNewUsers = async (req, res) => {
   
  try {
    const { query="" } = req.query;
    const id = req.id
    // if (!query) {
    //   return res.status(400).json({ message: "Search query is required." });
    // }
   
    const existingConversions = await ConversionModel.find({
      participant: { $in: [id]}
    })

     const excludedUserIds = existingConversions.flatMap(conv=>conv.participant)
  
     const users = await UserModel.find({
      $or:[
        {username:  {$regex:query,$options:"i"}  },
        {email:  {$regex:query,$options:"i"}  },
      ]  ,
      _id:{$nin:[...excludedUserIds,id]}
     }).select("username email photo").limit(10)

     if(!users) 
      return res.json({
        message:"Cannot find users",
        success:false,
        error:true,
      })



 
     res.json({
       message:"Succesfully returned user data",
       data:users,
       success:true,
       error:false,
     })
 
  } catch (error) {
    console.error("Error searching users:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};





export const findNewUsers = async (req, res) => {
  
  try {
    const { query } = req.query;
    const id = req.id

    if (!query) {
      return res.status(400).json({ message: "Search query is required." });
    }
   
    const existingConversions = await ConversionModel.find({
      participant: { $in: [id]}
    })

     const excludedUserIds = existingConversions.flatMap(conv=>conv.participant)
  
     const users = await UserModel.find({
      $or:[
        {username:  {$regex:query,$options:"i"}  },
        {email:  {$regex:query,$options:"i"}  },
      ]  ,
      _id:{$nin:[...excludedUserIds,id]}
     }).select("username email photo").limit(10)

     if(!users) 
      return res.json({
        message:"Cannot find users",
        success:false,
        error:true,
      })
   

 
     res.json({
       message:"Succesfully returned user data",
       data:users,
       success:true,
       error:false,
     })
 
    
  } catch (error) {
    console.error("Error searching users:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
