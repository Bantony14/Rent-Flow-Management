import axios from "axios";

const API = axios.create({
  // baseURL: `${import.meta.env.VITE_API_URL}/api/v1/user`,
  baseURL: "http://localhost:5000/api/v1/user",
  withCredentials: true,
});

export function userRegistrationApi(data) {
  return API.post("/registeruser", data);
}

export function userLogin(data) {
  return API.post("/userlogin", data);
}

export function getMe() {
  return API.get("/me");
}

export function userLogout() {
  return API.post("/userlogout");
}

export function getAllUser(params) {
  return API.get("/getalluser", { params });
}

export function updateUser(id, editData) {
  return API.post(`/userupdate/${id}`, editData);
}

export function deleteUser(id) {
  return API.post(`/userdelete/${id}`);
}

export function getUser(id) {
  return API.post(`/getuser/${id}`);
}

export function getOneUser(data) {
  return API.post("/getoneuser", data);
}

export function getRoomByBuilding(params) {
  return API.get("/getalluserbybuilding", { params });
}

export function forgotPassword(email) {
  return API.post("/forgotpassword", { email });
}

export function verifyEmailOtp(email, otp) {
  return API.post("/verifyotp", { email, otp });
}

export function resetPassword(email, otp, newPassword, confirmPassword) {
  return API.post("/resetpassword", {
    email,
    otp,
    newPassword,
    confirmPassword,
  });
}

export function userReceipt() {
  return API.get("/getreceipt");
}

export function fetchImage(id) {
  return API.post("/aaddharimage", { id });
}

// ============================================
// Member Management APIs
// ============================================

// ---------- Add Member ----------
// FormData bhejni hoti hai (members JSON string + profileImage + aadhaarFront + aadhaarBack)
export function addMember(id, formData) {
  return API.put(`/addmember/${id}`, formData);
}

// ---------- Update Member ----------
// Text fields aur images dono optional hoti hai, Multipart FormData jaati hai
export function updateMember(id, memberId, formData) {
  return API.put(`/updatemember/${id}/${memberId}`, formData);
}

// ---------- Remove Member ----------
// Backend actual delete nahi karta, sirf isActive = false karta hai
export function removeMember(id, memberId) {
  return API.put(`/removemember/${id}/${memberId}`);
}

// ---------- Get Aadhaar Image ----------
// Sirf public_id ke basis par secure image url fetch karne ke liye
export function getAadhaarImage(memberId, userId) {
  return API.post("/get-member-aadhaar-image", { memberId, userId });
}
