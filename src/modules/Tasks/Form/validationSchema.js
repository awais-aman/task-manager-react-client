import * as Yup from "yup";
import dayjs from "dayjs";

import { deadlineToDay } from "helpers/dateFormat";

// The tasks.title column is varchar(25), tighter than the model's 30.
export const TITLE_MAX = 25;

const schema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .max(TITLE_MAX, `* Title must be at most ${TITLE_MAX} characters`)
    .required("* Title Required"),
  description: Yup.string().trim().required("* Description Required"),
  priority: Yup.string()
    .oneOf(["low", "medium", "high"], "* Choose a priority")
    .required("* Choose a priority"),
  deadline: Yup.mixed()
    .nullable()
    .test("valid", "* Enter a valid date", (value) =>
      Boolean(deadlineToDay(value))
    )
    .when("id", {
      // Existing tasks may already be overdue; only new ones must be current.
      is: (id) => !id,
      then: (rule) =>
        rule.test("not-past", "* Deadline cannot be in the past", (value) => {
          const day = deadlineToDay(value);
          return !day || !day.isBefore(dayjs().startOf("day"));
        }),
    }),
});

export default schema;
