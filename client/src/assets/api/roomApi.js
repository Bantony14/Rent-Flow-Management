import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1/room`,
  // baseURL: "http://localhost:5000/api/v1/room",
  withCredentials: true,
});

export function updateRoomAvailability(data) {
  return API.patch("/update-room-availability", data);
}

export function addRoom(data) {
  return API.post("/roomadd", data);
}

export function getAllRoom() {
  return API.get("/get-all-room");
}

export function roomDetailsUpdate(id, data) {
  return API.put(`/roomdetailupdate/${id}`, data);
}

export function deleteRoomApi(id) {
  return API.delete(`/roomdelete/${id}`);
}

export function updateRoomImageApi(id, data) {
  return API.post(`/roomimageupdate/${id}`, data);
}

// Remove a single image from a room
export function removeRoomImageApi(roomId, imageId) {
  return API.patch(`/roomimageremove/${roomId}/${imageId}`);
}

// Add new images to a room
export function addRoomImageApi(id, data) {
  return API.put(`/addroomimage/${id}`, data);
}

export function bookRoom(data) {
  return API.post("/book-room", data);
}
