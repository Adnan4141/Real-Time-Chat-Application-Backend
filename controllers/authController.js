import bcrypt from "bcryptjs";

import { isValidEmail } from "../utils/ErrorHandler/inputValidation/emailValidation.js";
import { generatedToken } from "../utils/generatToken/GenreateToken.js";
import UserModel from "../models/User.js";





export const register = async (req, res, next) => {
  const { username, email, password, photo } = req.body;
  
  try {
 
    if (!username || !email || !password || !photo)
      return res.json({
        message: "Provide the require field",
        success: false,
        error: true,
      });

      const user = await UserModel.findOne({email});
      if(user) return res.json({
        message: "User already exists",
        success: false,
        error: true,
      });


    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const payload = {
      username,
      email,
      password: hashedPassword,
      photo
    };

    const newUser = await UserModel.create(payload);

    if (!newUser)
      return res.json({
        message: "Failed to create new user",
        success: false,
        error: true,
      });

    return res.json({
      message: "User registered successfully",
      success: true,
      error: false,
    });

  } catch (error) {
    console.log(error.message);
    return res.status(404).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};




// const login
export const login = async (req,res,next)=>{
  const {email,password} = req.body;
  try {
    if(!email || !password) 
      return res.json({
        message: "Provide the required field",
        success: false,
        error: true,
      });

     const isValidedEmail = isValidEmail(email);
    

     if(!isValidedEmail)
      return res.json({
        message: "Invalid Email.Please provide valid email",
        success: false,
        error: true,
      })




    const user = await UserModel.findOne({email})
    if(!user)
      return res.json({
        message: "No data found with this email.Please provide correct email",
        success: false,
        error: true,
      })

    const isMatchedPassword = bcrypt.compareSync(password,user.password)
    
    if(!isMatchedPassword)
      return res.json({
        message: "Incorrect password",
        success: false,
        error: true,
      })

      const newToken = await generatedToken(user)

      const currentDate = new Date;
      const updateUser =  await UserModel.findOneAndUpdate({email},{lastLogin:currentDate},{new:true}).select("-password")
  
     console.log(updateUser)
   
      const cookiesOptions = {
          httpOnly:true,
          secure: process.env.NODE_ENV =="production",
          sameSite:process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          maxAge: 24 * 60 * 60 * 1000, 
          
        }

       
    return res.cookie("token",newToken,cookiesOptions).status(200).json({
      message: "User login successfully",
      success: true,
      error: false,
      data:updateUser,
      token:newToken
    });

  } catch (error) {
    console.log(error.message)

    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    })
   }
}

export const logout = async (req, res, next) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      secure: process.env.NODE_ENV === 'production', 
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', 
    });

   
    const userId = req?.id; 
    if (userId) {
      await UserModel.findByIdAndUpdate(userId, { lastLogout: new Date() });
    }

    // Send a success response
    return res.status(200).json({
      message: 'User logged out successfully',
      success: true,
      error: false,
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      message: error.message || 'Internal server error',
      success: false,
      error: true,
    });
  }
};
