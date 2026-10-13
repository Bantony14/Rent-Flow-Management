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
import { AuthContext } from "../context/authContext";
import Registration from "../pages/AdminPages/Registration";
import { paymentCheck } from "../api/paymentApi";
import { Proportions } from "lucide-react";
import { getRoomByBuilding, userRegistrationApi } from "../api/authApi";
import toast from "react-hot-toast";

jest.mock("../api/authApi.js", () => ({
  getRoomByBuilding: jest.fn(),
  userRegistrationApi: jest.fn(),
  getMe: jest.fn(),
}));

jest.mock("../api/paymentApi", () => ({
  paymentCheck: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

test("check basic testing", () => {
  render(
    <AuthContext.Provider value={{ user: jest.fn() }}>
      <Registration />
    </AuthContext.Provider>,
  );

  expect(screen.getByText("Registration Form")).toBeInTheDocument();
});

//  Full Form Test

test("FORM SUBMIT TEST", async () => {
  globalThis.URL.createObjectURL = jest.fn(() => "mock-image-url");

  const mockUserData = {
    properties: ["Ajanta Tower", "Shivam Tower"],
  };

  const mockGetRoomByBBuilding = jest
    .mocked(getRoomByBuilding)
    .mockResolvedValue({
      data: {
        building: [{ room: "A-102" }, { room: "B-201" }],
      },
    });

  const mockUserResgistrationApi = jest
    .mocked(userRegistrationApi)
    .mockResolvedValueOnce({
      data: {
        message: "tenant Added succeessfully",
      },
    });
  render(
    <AuthContext.Provider value={{ user: mockUserData }}>
      <Registration />
    </AuthContext.Provider>,
  );

  const user = userEvent.setup();

  const profileImageInput = document.getElementById("profileImage");

  const fullName = screen.getByPlaceholderText("Enter your Tenant full name");
  const aadhaarNumber = screen.getByPlaceholderText(
    "Enter 12-digit Aadhaar number",
  );
  const mobileNumber = screen.getByPlaceholderText("Enter mobile number");
  const date = screen.getByPlaceholderText("Select date of birth");
  const password = screen.getByPlaceholderText("Create a strong password");
  const building = screen.getByRole("combobox", {
    name: "building",
  });
  const roomNumber = screen.getByRole("combobox", {
    name: "roomNumber",
  });
  const joiningDate = screen.getByPlaceholderText("Select date of joining");
  const email = screen.getByPlaceholderText("Enter your email address");
  const aadhaarFront = document.getElementById("aadhaarFront");
  const aadhaarBack = document.getElementById("aadhaarBack");

  const submitBtn = screen.getByText("Register");

  const doc = [
    fullName,
    aadhaarNumber,
    mobileNumber,
    date,
    password,
    building,
    roomNumber,
    joiningDate,
    email,
    aadhaarFront,
    aadhaarBack,
    submitBtn,
  ];

  const file = new File(["image content"], "profile.png", {
    type: "image/png",
  });

  await user.upload(profileImageInput, file);
  await user.type(fullName, "Bantony Singh");
  await user.type(aadhaarNumber, "123456789012");
  await user.type(mobileNumber, "9104153677");
  await user.type(date, "2026-10-10");
  await user.type(password, "B@ntony14102002");
  await user.selectOptions(building, "Ajanta Tower");
  await user.selectOptions(roomNumber, "A-102");
  await user.type(joiningDate, "2026-10-13");
  await user.type(email, "bantonysin@gmail.com");
  await user.upload(aadhaarFront, file);
  await user.upload(aadhaarBack, file);
  await user.click(submitBtn);

  await doc.forEach((value) => {
    expect(value).toBeInTheDocument();
  });

  expect(aadhaarBack.files[0]).toBe(file);
  expect(aadhaarFront.files[0]).toBe(file);
  expect(profileImageInput.files[0]).toBe(file);

  expect(userRegistrationApi).toHaveBeenCalled();
});
