import express from "express";
import {
  addMember,
  forgotPassword,
  getAllUser,
  getAllUserByBuilding,
  getMe,
  getUserById,
  removeMember,
  resetPassword,
  updateMemberInfo,
  userDelete,
  userLogin,
  userLogout,
  userRegistration,
  userUpdate,
  getOneUser,
  verifyOtp,
  getReceiptById,
  getAadhaarImage,
  getAadhaarImageForMember,
} from "../controllers/user.controller.js";
import { isAuthorized, isLoggedIn } from "../middlewares/authUser.js";
import { uploadImages } from "../middlewares/upload.middleware.js";

const route = express.Router();

route.post("/registeruser", uploadImages, userRegistration);
route.post("/userlogin", userLogin);
route.post("/userlogout", userLogout);
route.post("/userdelete/:id", isLoggedIn, isAuthorized("ADMIN"), userDelete);
route.get("/me", isLoggedIn, getMe);
route.post(
  "/userupdate/:id",
  isLoggedIn,
  isAuthorized("ADMIN"),
  uploadImages,
  userUpdate,
);
route.post("/getuser/:id", isLoggedIn, isAuthorized("ADMIN"), getUserById);
route.post("/getoneuser", isLoggedIn, isAuthorized("ADMIN"), getOneUser);
route.get("/getalluser", isLoggedIn, isAuthorized("ADMIN"), getAllUser);
route.get(
  "/getalluserbybuilding",
  isLoggedIn,
  isAuthorized("ADMIN"),
  getAllUserByBuilding,
);
route.post("/forgotpassword", forgotPassword);
route.post("/verifyotp", verifyOtp);
route.post("/resetpassword", resetPassword);
route.put(
  "/addmember/:id",
  isLoggedIn,
  isAuthorized("ADMIN"),
  uploadImages,
  addMember,
);
route.put(
  "/removemember/:id/:memberid",
  isLoggedIn,
  isAuthorized("ADMIN"),
  removeMember,
);
route.put(
  "/updatemember/:id/:memberid",
  isLoggedIn,
  isAuthorized("ADMIN"),
  uploadImages,
  updateMemberInfo,
);
route.get("/getreceipt", isLoggedIn, getReceiptById);
route.post("/aaddharimage", isLoggedIn, getAadhaarImage);
route.post("/get-member-aadhaar-image", isLoggedIn, getAadhaarImageForMember);

export default route;
