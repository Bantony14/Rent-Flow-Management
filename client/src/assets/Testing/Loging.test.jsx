/**
 * @jest-environment jsdom
 */

import { TextEncoder, TextDecoder } from "util";

globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;

import "@testing-library/jest-dom/jest-globals";
import { render, screen } from "@testing-library/react";
import { test, expect, jest } from "@jest/globals";

import { AuthContext } from "../context/authContext";

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));

jest.mock("../api/authApi", () => ({
  userLogin: jest.fn(),
}));

jest.mock("../api/paymentApi", () => ({
  userLogin: jest.fn(),
}));

import Login from "../pages/login";

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
