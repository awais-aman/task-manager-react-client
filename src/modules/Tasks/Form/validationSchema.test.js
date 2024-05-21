import { describe, expect, test } from "vitest";
import dayjs from "dayjs";

import schema from "./validationSchema";
import authSchema from "modules/Authorization/validationSchema";

const today = dayjs().startOf("day");
const valid = {
  title: "Book venue",
  description: "Confirm the room",
  priority: "medium",
  deadline: today,
};

const errorsFor = async (s, values) => {
  try {
    await s.validate(values, { abortEarly: false });
    return [];
  } catch (error) {
    return error.errors;
  }
};

describe("task form", () => {
  test("accepts a task due today", async () => {
    expect(await errorsFor(schema, valid)).toEqual([]);
  });

  test("rejects whitespace-only text and titles the database cannot hold", async () => {
    const errors = await errorsFor(schema, {
      ...valid,
      title: "x".repeat(26),
      description: "   ",
    });
    expect(errors).toEqual([
      "* Title must be at most 25 characters",
      "* Description Required",
    ]);
  });

  test("rejects a missing or past deadline on new tasks only", async () => {
    expect(await errorsFor(schema, { ...valid, deadline: null })).toEqual([
      "* Enter a valid date",
    ]);
    expect(await errorsFor(schema, { ...valid, deadline: dayjs("2026-02-31x") })).toEqual([
      "* Enter a valid date",
    ]);
    const yesterday = today.subtract(1, "day");
    expect(await errorsFor(schema, { ...valid, deadline: yesterday })).toEqual([
      "* Deadline cannot be in the past",
    ]);
    expect(await errorsFor(schema, { ...valid, id: 4, deadline: yesterday })).toEqual([]);
  });

  test("rejects an unknown priority", async () => {
    expect(await errorsFor(schema, { ...valid, priority: "urgent" })).toEqual([
      "* Choose a priority",
    ]);
  });
});

describe("sign-up form", () => {
  const signUp = {
    isLogin: false,
    firstName: "Ada",
    lastName: "Lovelace",
    email: " ada@example.com ",
    password: "secret123",
    confirmPassword: "secret123",
  };

  test("accepts a padded email and matching passwords", async () => {
    expect(await errorsFor(authSchema, signUp)).toEqual([]);
  });

  test("requires names and a matching confirmation", async () => {
    const errors = await errorsFor(authSchema, {
      ...signUp,
      firstName: " ",
      confirmPassword: "different",
    });
    expect(errors).toEqual(["* First Name Required", "* Passwords must match"]);
  });

  test("login ignores the sign-up-only fields", async () => {
    expect(
      await errorsFor(authSchema, {
        isLogin: true,
        email: "ada@example.com",
        password: "secret123",
      })
    ).toEqual([]);
  });
});
