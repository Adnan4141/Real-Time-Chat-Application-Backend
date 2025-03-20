import { query } from "express";
import UserModel from "../models/User.js";
import ConversionModel from "../models/Conversion.js";
import bcrypt from "bcryptjs"


export const searchNewUsers = async (req, res) => {
  try {
    const { query = "" } = req.query;
    const id = req.id;
    // if (!query) {
    //   return res.status(400).json({ message: "Search query is required." });
    // }

    const existingConversions = await ConversionModel.find({
      participant: { $in: [id] },
    });

    const excludedUserIds = existingConversions.flatMap(
      (conv) => conv.participant
    );

    const users = await UserModel.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
      _id: { $nin: [...excludedUserIds, id] },
    })
      .select("username email photo")
      .limit(10);

    if (!users)
      return res.json({
        message: "Cannot find users",
        success: false,
        error: true,
      });

    res.json({
      message: "Succesfully returned user data",
      data: users,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error searching users:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const findNewUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const id = req.id;

    if (!query) {
      return res.status(400).json({ message: "Search query is required." });
    }

    const existingConversions = await ConversionModel.find({
      participant: { $in: [id] },
    });

    const excludedUserIds = existingConversions.flatMap(
      (conv) => conv.participant
    );

    const users = await UserModel.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
      _id: { $nin: [...excludedUserIds, id] },
    })
      .select("username email photo")
      .limit(10);

    if (!users)
      return res.json({
        message: "Cannot find users",
        success: false,
        error: true,
      });

    res.json({
      message: "Succesfully returned user data",
      data: users,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error searching users:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  const userId = req.id;
  const { username, photo, password } = req.body;
  try {
    const user = await UserModel.findById(userId);
    if (!user)
      res.json({
        message: "Failed to update.User was not found with this id",
        success: false,
        error: true,
      });

     if(username) user.username = username;
     if(photo) user.photo = photo;
     if(password){
         const salt = bcrypt.genSaltSync(10);
         const hashedPassword = bcrypt.hashSync(password,salt)
         user.password = hashedPassword
     }
       await user.save()

    return res.json({
      message: "Successfully updated user data",
      success: false,
      error: true,
      data:{
        username,
        photo
      }
    });



  } catch (error) {}
};
