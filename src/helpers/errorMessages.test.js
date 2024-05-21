import { expect, test } from "vitest";

import { errorMessages } from "./errorMessages";

const withData = (status, data) => ({ response: { status, data } });

test("flattens the three error shapes the API uses", () => {
  expect(errorMessages(withData(422, { errors: ["Title can't be blank"] }))).toEqual([
    "Title can't be blank",
  ]);
  expect(errorMessages(withData(401, { error: "Invalid Email or password." }))).toEqual([
    "Invalid Email or password.",
  ]);
  expect(errorMessages(withData(404, { message: "Record(s) not found: Task" }))).toEqual([
    "Record(s) not found: Task",
  ]);
});

test("never returns an empty or undefined message", () => {
  expect(errorMessages(withData(500, "<html>"))).toEqual([
    "Something went wrong. Please try again.",
  ]);
  expect(errorMessages(new Error("Network Error"))[0]).toMatch(/could not reach/i);
  expect(errorMessages({ sessionExpired: true })[0]).toMatch(/session has expired/i);
});
