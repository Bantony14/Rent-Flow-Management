/**
 * @jest-environment jsdom
 */

import { TextEncoder, TextDecoder } from "util";

globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;

import "@testing-library/jest-dom/jest-globals";
import { render, screen } from "@testing-library/react";
import { test, expect, jest } from "@jest/globals";
import userEvent from "@testing-library/user-event";
import { userLogin } from "../api/authApi";
import toast from "react-hot-toast";

import AuthProvider, { AuthContext } from "../context/authContext";

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock("../api/authApi", () => ({
  userLogin: jest.fn(),
}));

jest.mock("../api/paymentApi", () => ({
  userLogin: jest.fn(),
}));

import Login from "../pages/login";

// this test for element Alvaiable or not

test("Should All Element Present", () => {
  render(
    <AuthContext.Provider value={{ setUser: jest.fn() }}>
      <Login />
    </AuthContext.Provider>,
  );

  const heading = screen.getByText("Login Tenant");
  const paragraph = screen.getByText("Enter your credentials to continue");
  const emailInput = screen.getByPlaceholderText("Enter your email");
  const passwordInput = screen.getByPlaceholderText("Enter your password");
  const logingBtn = screen.getByRole("button", { name: "Login" });
  const forgotBtn = screen.getByRole("button", {
    name: "Forgot Password?",
  });

  const elements = [
    heading,
    paragraph,
    emailInput,
    passwordInput,
    logingBtn,
    forgotBtn,
  ];

  elements.forEach((element) => {
    expect(element).toBeInTheDocument();
  });
});

//  this test for check invalid email

test("should not login with invalid email", async () => {
  render(
    <AuthContext.Provider value={{ setUser: jest.fn() }}>
      <Login />
    </AuthContext.Provider>,
  );

  const user = userEvent.setup();

  const emailInput = screen.getByPlaceholderText("Enter your email");

  const logingBtn = screen.getByRole("button", { name: "Login" });

  await user.type(emailInput, "abc");
  await user.click(logingBtn);

  expect(userLogin).not.toHaveBeenCalled();
});

// show hide password check
test("should toggle password visibility", async () => {
  render(
    <AuthContext.Provider value={{ setUser: jest.fn() }}>
      <Login />
    </AuthContext.Provider>,
  );

  const user = userEvent.setup();
  const passwordInput = screen.getByPlaceholderText("Enter your password");

  const showBtn = screen.getByRole("button", { name: "Show password" });

  await user.click(showBtn);

  expect(passwordInput).toHaveAttribute("type", "text");

  const hideBtn = screen.getByRole("button", { name: "Hide password" });
  await user.click(hideBtn);

  expect(passwordInput).toHaveAttribute("type", "password");
});

// login flow test
test("full login flow test", async () => {
  const mockUserLogin = jest.mocked(userLogin);

  mockUserLogin.mockResolvedValue({
    data: {
      message: "login Successfully",
      user: {
        id: 101,
        name: "bantony",
      },
    },
  });

  const mockSetUser = jest.fn();
  render(
    <AuthContext.Provider value={{ setUser: mockSetUser }}>
      <Login />
    </AuthContext.Provider>,
  );

  const user = userEvent.setup();

  const emailInput = screen.getByPlaceholderText("Enter your email");
  const passwordInput = screen.getByPlaceholderText("Enter your password");
  const logingBtn = screen.getByRole("button", { name: "Login" });

  await user.type(emailInput, "bantonysin@gmail.com");
  await user.type(passwordInput, "B@ntony14102002");

  await user.click(logingBtn);

  expect(userLogin).toHaveBeenCalled();
  expect(userLogin).toHaveBeenCalledWith({
    email: "bantonysin@gmail.com",
    password: "B@ntony14102002",
  });

  expect(mockSetUser).toHaveBeenCalledWith({
    id: 101,
    name: "bantony",
  });

  expect(toast.success).toHaveBeenCalledWith("login Successfully");

  expect(emailInput).toHaveValue("");
  expect(passwordInput).toHaveValue("");
});
