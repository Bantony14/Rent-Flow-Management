/**
 * @jest-environment jsdom
 */

import { TextEncoder, TextDecoder } from "util";

globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;

import "@testing-library/jest-dom/jest-globals";
import { render, screen } from "@testing-library/react";
import { test, expect, jest, afterEach } from "@jest/globals";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  forgotPassword,
  resetPassword,
  verifyEmailOtp,
} from "../api/authApi.js";

import Forgotpassword from "../pages/ForgotPassword";
import { error } from "console";

afterEach(() => {
  jest.resetAllMocks();
});

jest.mock("../api/authApi.js", () => ({
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
  verifyEmailOtp: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));

// email validation

test("Email Should be Give error", async () => {
  render(<Forgotpassword />);
  const user = userEvent.setup();

  const emailInput = screen.getByPlaceholderText("Enter your email");

  const sendOtpBtn = screen.getByRole("button", { name: "Send OTP" });

  await user.click(sendOtpBtn);

  expect(toast.error).toHaveBeenCalledWith("please enter email");
});

// Otp send validation

test("Should be otp send", async () => {
  render(<Forgotpassword />);

  const user = userEvent.setup();
  const emailInput = screen.getByPlaceholderText("Enter your email");
  const sendOtpBtn = screen.getByRole("button", { name: "Send OTP" });

  await user.type(emailInput, "bantonysin95@gamil.com");
  await user.click(sendOtpBtn);

  expect(forgotPassword).toHaveBeenCalledWith("bantonysin95@gamil.com");
  expect(toast.success).toHaveBeenCalledWith(
    `opt Send Successfull please check your this email ${"bantonysin95@gamil.com"}`,
  );
  expect(
    await screen.findByText("Please enter the 4-digit OTP sent to your email."),
  ).toBeInTheDocument();
});

// otp test error

test("otp should give error", async () => {
  render(<Forgotpassword />);
  const mockForgotPassword = jest.mocked(forgotPassword);

  mockForgotPassword.mockRejectedValueOnce({
    response: {
      data: {
        message: "invalid email",
      },
    },
  });

  const user = userEvent.setup();
  const emailInput = screen.getByPlaceholderText("Enter your email");
  const sendOtpBtn = screen.getByRole("button", { name: "Send OTP" });

  await user.type(emailInput, "bantonysin95@gamil.com");
  await user.click(sendOtpBtn);

  expect(forgotPassword).toHaveBeenCalledWith("bantonysin95@gamil.com");

  expect(toast.error).toHaveBeenCalledWith("invalid email");

  expect(
    screen.queryByText("Please enter the 4-digit OTP sent to your email."),
  ).not.toBeInTheDocument();
});

// otp input focus check and otp validation

test("otp Should be correct ", async () => {
  render(<Forgotpassword />);
  const user = userEvent.setup();

  const emailInput = screen.getByPlaceholderText("Enter your email");

  const sendOtpBtn = screen.getByRole("button", { name: "Send OTP" });

  await user.type(emailInput, "bantonysin95@gamil.com");
  await user.click(sendOtpBtn);

  expect(
    await screen.findByText("Please enter the 4-digit OTP sent to your email."),
  ).toBeInTheDocument();

  const otpInput = document.getElementById("otp-0");

  await user.type(otpInput, "1");

  expect(otpInput).toHaveValue("1");
  const otpInput2 = document.getElementById("otp-1");

  expect(otpInput2).toHaveFocus();

  await user.type(otpInput, "a");
  expect(otpInput).toHaveValue("1");
});

// otp verification and change password

test("otp should be verify", async () => {
  const mockVerifyEmailOtp = jest.mocked(verifyEmailOtp);
  const mockResetPassword = jest.mocked(resetPassword);
  mockVerifyEmailOtp.mockResolvedValue({
    data: {
      message: "otp Verify sucessfully",
    },
  });

  mockResetPassword.mockResolvedValue({
    data: {
      message: "password Change sucessfully",
    },
  });
  render(<Forgotpassword />);

  const user = userEvent.setup();
  const emailInput = screen.getByPlaceholderText("Enter your email");

  const sendOtpBtn = screen.getByRole("button", { name: "Send OTP" });

  await user.type(emailInput, "bantonysin95@gmail.com");
  await user.click(sendOtpBtn);

  const firstOtpBox = document.getElementById("otp-0");
  const secondOtpBox = document.getElementById("otp-1");
  const thirdOtpBox = document.getElementById("otp-2");
  const fourthOtpBox = document.getElementById("otp-3");

  await user.type(firstOtpBox, "1");
  await user.type(secondOtpBox, "1");
  await user.type(thirdOtpBox, "1");
  await user.type(fourthOtpBox, "1");
  const sendVerifyOtpBtn = screen.getByRole("button", { name: "Verify OTP" });

  await user.click(sendVerifyOtpBtn);

  // from here change password testing

  const newPasswordInput = screen.getByPlaceholderText("Enter new password");
  const confirmPasswordInput = screen.getByPlaceholderText(
    "Confirm your password",
  );
  const changePasswordBtn = screen.getByRole("button", {
    name: "Change Password",
  });

  await user.type(newPasswordInput, "B@ntonysin14102002");
  await user.type(confirmPasswordInput, "B@ntonysin14102002");

  await user.click(changePasswordBtn);

  expect(verifyEmailOtp).toHaveBeenCalledWith("bantonysin95@gmail.com", "1111");

  expect(toast.success).toHaveBeenCalledWith("otp Verify sucessfully");

  expect(resetPassword).toHaveBeenCalledWith(
    "bantonysin95@gmail.com",
    "1111",
    "B@ntonysin14102002",
    "B@ntonysin14102002",
  );

  expect(toast.success).toHaveBeenCalledWith("password Change sucessfully");
});
