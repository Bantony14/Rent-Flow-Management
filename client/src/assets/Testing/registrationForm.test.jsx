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
import { getRoomByBuilding } from "../api/authApi";

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

  mockGetRoomByBBuilding.mock;
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
  const doc = [
    fullName,
    aadhaarNumber,
    mobileNumber,
    date,
    password,
    building,
    roomNumber,
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

  //   doc.forEach((value) => {
  //     expect(value).toBeInTheDocument();
  //   });

  expect(roomNumber).toHaveValue("A-102");

  expect(profileImageInput.files[0]).toBe(file);

  expect(profileImageInput).toBeInTheDocument();
});
