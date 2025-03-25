import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token =  req?.cookies?.token || req.headers?.authorization?.split(" ")[1];
    if (!token)
      return res.json({
        message: "token not found",
        success: false,
        error: true,
      });
    console.log("token", req?.cookies?.token);
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res.json({
        message: "Unathoriazed Access",
        success: false,
        error: true,
      });
    req.id = decoded._id;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.log(error.message)
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      return res.status(401).json({
        message: error.message || "Token expired",
        success: false,
        error: true,
      });
    }

    console.log(error.message || error);
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};
