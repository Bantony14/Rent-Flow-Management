export default {
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  setupFiles: ["<rootDir>/jest.setup.js"],
};
