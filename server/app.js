import express from "express";
import userRoute from "./routers/user.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import RazorPay from "razorpay";
import paymentRoute from "./routers/payment.route.js";
import cors from "cors";
import roomRoute from "./routers/room.route.js";
const app = express();

export const razorpay = new RazorPay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URL],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/v1/user", userRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/room", roomRoute);
app.use((req, res, next) => {
  res.send("404 page is not found");
});
app.use(errorMiddleware);
export default app;
