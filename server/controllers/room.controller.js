import cloudinary from "../config/cloudinary.connect.js";
import Room from "../models/room.model.js";
import fs from "fs/promises";
import ErrorHandler from "../utils/error.js";
import User from "../models/user.model.js";
import sendEmail from "../utils/emailSender.js";
import bookingClientTemplate from "../utils/bookingClientTemplate.js";
import bookingOwnerTemplate from "../utils/bookingOwnerTemplate.js";

export const roomCreate = async (req, res, next) => {
  const { buildingName, id, room } = req.body;

  console.log("req.body>>>", req.body);
  console.log("req.files>>>", req.files);

  try {
    const roomExist = await Room.findOne({
      room,
      buildingName,
    });

    if (roomExist) {
      return next(
        new ErrorHandler("Room already exists in this building", 400),
      );
    }

    const admin = await User.findById(id);

    if (!admin) {
      return next(new ErrorHandler("Admin not found", 404));
    }
    // creating a data here in room db
    const newRoom = await Room.create(req.body);

    try {
      if (req.files?.length) {
        for (const file of req.files) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "roomImage",
          });

          newRoom.roomImage.push({
            public_id: result.public_id,
            secure_url: result.secure_url,
          });

          await fs.unlink(file.path);
        }
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }

    if (!admin.properties.includes(buildingName)) {
      admin.properties.push(buildingName);
    }

    await newRoom.save();
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Room created successfully",
      room: newRoom,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const roomDelete = async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return next(new ErrorHandler("room not found", 400));
  }
  try {
    const room = await Room.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "room delete updated sucessfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const roomImageUpdate = async (req, res, next) => {
  const roomId = req.params.id;
  if (!req.files) {
    return next(new ErrorHandler("no changes in Image only in details"));
  }

  if (!roomId) {
    return next(new ErrorHandler("Please enter room id", 400));
  }

  try {
    const room = await Room.findById(roomId);
    console.log("room>>>", room);

    if (!room) {
      return next(new ErrorHandler("Room not found", 404));
    }

    const imageIds = Array.isArray(req.body.imageIds)
      ? req.body.imageIds
      : [req.body.imageIds];

    if (imageIds.length !== req.files.length) {
      return next(new ErrorHandler("Images and imageIds count mismatch", 400));
    }

    for (let i = 0; i < imageIds.length; i++) {
      const imageId = imageIds[i];
      const file = req.files[i];

      const image = room.roomImage.find(
        (img) => img._id.toString() === imageId,
      );

      if (!image) continue;

      await cloudinary.uploader.destroy(image.public_id);

      const result = await cloudinary.uploader.upload(file.path, {
        folder: "roomImage",
      });

      image.public_id = result.public_id;
      image.secure_url = result.secure_url;
    }

    await room.save();

    return res.status(200).json({
      success: true,
      message: "Room images updated successfully",
      room,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const roomDetailUpdate = async (req, res, next) => {
  const id = req.params.id;
  if (Object.keys(req.body).length === 0) {
    return next(
      new ErrorHandler("no changes in details Wait.... for image update"),
    );
  }

  try {
    const room = await Room.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
      runValidation: true,
    });

    if (!room) {
      return next(new ErrorHandler("room not found", 400));
    }

    res.status(200).json({
      success: true,
      message: "room detail updated sucessfully",
      room,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const roomImageRemove = async (req, res, next) => {
  const id = req.params.id;
  const imageId = req.params.imageid;

  if (!id) {
    return next(new ErrorHandler("please enter id  ", 400));
  }
  if (!imageId) {
    return next(new ErrorHandler("imageId does not exist ", 400));
  }

  try {
    const room = await Room.findByIdAndUpdate(
      id,
      {
        $pull: {
          roomImage: { _id: imageId },
        },
      },
      {
        new: true,
        runValidation: true,
      },
    );

    if (!room) {
      return next(new ErrorHandler("room not have ", 400));
    }

    res.status(200).json({
      success: true,
      message: "room image remove successful",
      room,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const addRoomImage = async (req, res, next) => {
  const id = req.params.id;

  try {
    const room = await Room.findById(id);

    try {
      if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
          const result = await cloudinary.uploader.upload(req.files[i].path, {
            folder: "roomImage",
          });
          room.roomImage.push({
            public_id: result.public_id,
            secure_url: result.secure_url,
          });
          await fs.unlink(req.files[i].path);
        }
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }

    await room.save();

    res.status(200).json({
      success: true,
      message: "image upload sucessfully",
      room,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const updateRoomAvailability = async (req, res) => {
  try {
    const { oldBuilding, oldRoom, newBuilding, newRoom, id } = req.body;
    console.log(req.body);
    console.log(id);

    // Purana room available kar do
    const oldRoomData = await Room.findOne({
      buildingName: oldBuilding,
      room: oldRoom,
    });

    if (oldRoomData) {
      oldRoomData.Avaliablity = true;
      await oldRoomData.save();
    }

    const newRoomData = await Room.findOne({
      buildingName: newBuilding,
      room: newRoom,
    });

    if (!newRoomData) {
      return res.status(404).json({
        success: false,
        message: "New room not found",
      });
    }
    newRoomData.tenantsId.push(id);
    newRoomData.Avaliablity = false;
    await newRoomData.save();

    return res.status(200).json({
      success: true,
      message: "Room availability updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllRoom = async (req, res, next) => {
  try {
    const room = await Room.find({});

    if (room.length === 0) {
      return next(new ErrorHandler("There are no rooms", 404));
    }

    res.status(200).json({
      success: true,
      message: "All rooms fetched successfully",
      room,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const bookRoom = async (req, res, next) => {
  try {
    const {
      roomId,
      roomName,
      buildingName,
      rent,
      userName,
      userEmail,
      userMobile,
    } = req.body;
    // Validate required fields
    if (!roomId || !userName || !userEmail || !userMobile) {
      return next(new ErrorHandler("All fields are required", 400));
    }
    // Find the room to get address
    const room = await Room.findById(roomId);
    if (!room) {
      return next(new ErrorHandler("Room not found", 404));
    }
    const bookingDate = new Date();
    // Common data for both templates
    const templateData = {
      userName,
      userEmail,
      userMobile,
      roomName: roomName || room.room,
      buildingName: buildingName || room.buildingName,
      rent: rent || room.rent,
      address: room.address,
      bookingDate,
    };
    // 1. Send email to CLIENT
    await sendEmail({
      email: userEmail,
      subject: `Booking Request Received - Room ${templateData.roomName} | RentFlow`,
      message: bookingClientTemplate(templateData),
    });
    // 2. Send email to OWNER
    await sendEmail({
      email: process.env.OWNER_EMAIL, // Add OWNER_EMAIL to your .env file
      subject: `🔔 New Booking Request - Room ${templateData.roomName} by ${userName}`,
      message: bookingOwnerTemplate(templateData),
    });
    res.status(200).json({
      success: true,
      message: "Booking request sent successfully! Check your email.",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
