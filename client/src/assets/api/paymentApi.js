import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1/payment`,
  // baseURL: "http://localhost:5000/api/v1/payment",
  withCredentials: true,
});

export function paymentOrderCreate() {
  return API.post("/create-order");
}

export function paymentCheck() {
  return API.post("/payment-check");
}

export function paymentHistoryByUser() {
  return API.get("/payment-history");
}
