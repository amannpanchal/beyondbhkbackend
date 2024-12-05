const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");
const { errorResponse } = require("../Utils/resHandler");

//  const validateUserToken = async (req, res, next) => {
//   const token = req.header("Authorization");

//   if (!token) {
//     return errorResponse(res, "Access denied. No token provided.", 401);
//   }

//   try {
//      const decoded = jwt.verify(
//        token.replace("Bearer ", ""),
//        process.env.JWTSECRET
//      );

//      const user = await User.findById(decoded._id);
//     if (!user) {
//       return errorResponse(res, "Invalid token or user does not exist", 401);
//     }

//      req.user = user;

//     next();
//   } catch (error) {
//     return errorResponse(res, "Invalid token", 401);
//   }

// };

const validateUserToken = async (req, res, next) => {
  let token = req.header("Authorization");


  
    // Ensure the token is provided in the correct format
    if (!token || !token.startsWith("Bearer ")) {
      return errorResponse(res, "Access denied. No token provided.", 401);
    }

    try {
      // Extract the token and verify it
      token = token.replace("Bearer ", "");
      console.log(token ,'the token is ')

      const decoded = await  jwt.verify(token, process.env.JWTSECRET);

      // Find the user by the ID encoded in the token
      const user = await User.findById(decoded.id || decoded._id);
      if (!user) {
        return errorResponse(res, "Invalid token or user does not exist", 401);
      }

      // Attach the user to the request object
      req.user = user;

      next();
    } catch (error) {
      console.error("Token validation error:", error);
      return errorResponse(res, "Invalid token", 401);
    }
};












 const validateTokenForRoles = (roles = []) => {
  return async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
      return errorResponse(res, "Access denied. No token provided.", 401);
    }
    console.log('token', token)


    try {
       const decoded = jwt.verify(
         token.replace("Bearer ", ""),
         process.env.JWTSECRET
       );

       const user = await User.findById(decoded._id);
      if (!user) {
        return errorResponse(res, "Invalid token or user does not exist", 401);
      }

       if (roles.length && !roles.includes(user.role)) {
        return errorResponse(
          res,
          "Access denied. Insufficient permissions.",
          403
        );
      }


       req.user = user;

      next();
    } catch (error) {
      return errorResponse(res, "Invalid token", 401);
    }
  };
};

module.exports = {
  validateUserToken,  
  validateTokenForRoles, // For specific roles (admin, superAdmin, etc.)
};
