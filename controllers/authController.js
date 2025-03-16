import bcrypt from "bcryptjs";
import UserModel from "../models/User.js";
import { isValidEmail } from "../utils/ErrorHandler/inputValidation/emailValidation.js";
import { generatedToken } from "../utils/generatToken/GenreateToken.js";





export const register = async (req, res, next) => {
  const { username, email, password, photo } = req.body;
  const userId = req.id || "";

  try {

    if (!username || !email || !password)
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
      await UserModel.findOneAndUpdate({email},{lastLogin:currentDate})
  
   
      const cookiesOptions = {
          httpOnly:true,
          secure:true,
          samesite:"stric"
      }


    return res.cookie("token",newToken,cookiesOptions).json({
      message: "User login successfully",
      success: true,
      error: false,
      data:user,
      token:newToken
    });


  } catch (error) {
    console.log(error.message)
    console.log(error)
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    })
   }
}
