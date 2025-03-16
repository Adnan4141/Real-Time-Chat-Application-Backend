import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token =
      req?.cookies?.token || req.headers?.authorization?.split(" ")[1];
    if (!token)
      return res.json({
        message: "token not found",
        success: false,
        error: true,
      });
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
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};
