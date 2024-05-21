import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { http, HttpResponse } from "msw/http";

import MoreActions from "./MoreActions";
import { makeStore } from "store/makeStore";
import { API, server } from "test/server";
import { demoTasks, demoUser, makeToken, serializeTask } from "test/fixtures";

const inProgress = demoTasks[0];

const renderActions = () => {
  const store = makeStore({
    auth: { user: demoUser, token: makeToken(), status: "idle", error: null },
  });
  const setAnchorEl = vi.fn();
  render(
    <Provider store={store}>
      <MoreActions task={inProgress} setAnchorEl={setAnchorEl} />
    </Provider>
  );
  return { setAnchorEl };
};

test("does not offer the status the task already has", () => {
  renderActions();
  expect(screen.queryByText("Mark as In progress")).not.toBeInTheDocument();
  expect(screen.getByText("Mark as Pending")).toBeInTheDocument();
  expect(screen.getByText("Mark as Completed")).toBeInTheDocument();
});

test("sends the Rails enum key and closes the menu", async () => {
  let body;
  server.use(
    http.patch(`${API}/api/v1/tasks/:id`, async ({ request }) => {
      body = await request.json();
      return HttpResponse.json({
        data: serializeTask({ ...inProgress, status: "completed" }),
      });
    })
  );
  const { setAnchorEl } = renderActions();
  await userEvent.click(screen.getByText("Mark as Completed"));
  await vi.waitFor(() => expect(setAnchorEl).toHaveBeenCalledWith(null));
  expect(body).toEqual({ task: { status: "completed" } });
});
