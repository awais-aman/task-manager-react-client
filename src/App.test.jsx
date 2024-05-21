import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";

test("shows the login form to a signed-out visitor", async () => {
  render(<App />);
  expect(await screen.findByText("Login", { selector: "p" })).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Email Address")).toBeInTheDocument();
});

test("logs in and lists the user's tasks", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/login");
  render(<App />);
  await user.type(await screen.findByPlaceholderText("Email Address"), "ada@example.com");
  await user.type(screen.getByPlaceholderText("Password"), "secret123");
  await user.click(screen.getByRole("button", { name: "Login" }));
  expect(await screen.findByText("Draft release notes")).toBeInTheDocument();
  expect(screen.getByText("ada@example.com")).toBeInTheDocument();
});
