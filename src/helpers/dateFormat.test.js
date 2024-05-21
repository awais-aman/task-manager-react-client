import { afterEach, describe, expect, test } from "vitest";
import dayjs from "dayjs";

import { deadlineToDay, formattedDate, toDeadlinePayload } from "./dateFormat";

const originalTz = process.env.TZ;
afterEach(() => {
  process.env.TZ = originalTz;
});

describe.each(["America/Los_Angeles", "UTC", "Asia/Karachi", "Pacific/Auckland"])(
  "deadlines in %s",
  (tz) => {
    test("a stored UTC-midnight deadline shows its own calendar day", () => {
      process.env.TZ = tz;
      expect(formattedDate("2026-11-14T00:00:00.000Z")).toBe("2026-11-14");
    });

    test("the picked day is sent without a timezone shift", () => {
      process.env.TZ = tz;
      const picked = dayjs(new Date(2026, 10, 14));
      expect(toDeadlinePayload(picked)).toBe("2026-11-14");
    });

    test("editing a task preselects the stored day", () => {
      process.env.TZ = tz;
      const day = deadlineToDay("2026-11-14T00:00:00.000Z");
      expect([day.year(), day.month(), day.date()]).toEqual([2026, 10, 14]);
    });
  }
);

test("the timezone switch is live, so the cases above really cross midnight", () => {
  process.env.TZ = "America/Los_Angeles";
  expect(new Date("2026-11-14T00:00:00.000Z").getDate()).toBe(13);
});

test("empty and invalid values do not render as Invalid date", () => {
  expect(formattedDate(null)).toBe("");
  expect(formattedDate("not a date")).toBe("");
  expect(toDeadlinePayload(null)).toBeNull();
});
