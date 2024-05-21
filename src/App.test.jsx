import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("shows the login form to a signed-out visitor", async () => {
  render(<App />);
  expect(await screen.findByText("Login", { selector: "p" })).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Email Address")).toBeInTheDocument();
});
