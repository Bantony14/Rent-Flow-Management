import express from "express";
import { uploadRoomImage } from "../middlewares/upload.middleware.js";
import {
  addRoomImage,
  bookRoom,
  getAllRoom,
  roomCreate,
  roomDelete,
  roomDetailUpdate,
  roomImageRemove,
  roomImageUpdate,
  updateRoomAvailability,
} from "../controllers/room.controller.js";
import { isAuthorized, isLoggedIn } from "../middlewares/authUser.js";

const route = express.Router();

route.post("/roomadd", uploadRoomImage, roomCreate);

route.post(
  "/roomimageupdate/:id",
  isLoggedIn,
  isAuthorized("ADMIN"),
  uploadRoomImage,
  roomImageUpdate,
);
route.put(
  "/roomdetailupdate/:id",
  isLoggedIn,
  isAuthorized("ADMIN"),
  roomDetailUpdate,
);
route.delete("/roomdelete/:id", isLoggedIn, isAuthorized("ADMIN"), roomDelete);
route.patch(
  "/roomimageremove/:id/:imageid",
  isLoggedIn,
  isAuthorized("ADMIN"),
  roomImageRemove,
);
route.put(
  "/addroomimage/:id",
  isLoggedIn,
  isAuthorized("ADMIN"),
  uploadRoomImage,
  addRoomImage,
);
route.patch(
  "/update-room-availability",
  isLoggedIn,
  isAuthorized("ADMIN"),
  updateRoomAvailability,
);

route.post("/book-room", bookRoom);

route.get("/get-all-room", getAllRoom);

export default route;
