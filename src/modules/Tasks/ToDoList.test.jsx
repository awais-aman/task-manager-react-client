import { expect, test } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { http, HttpResponse } from "msw/http";

import ToDoList from "./ToDoList";
import { makeStore } from "store/makeStore";
import { fetchTasks } from "store/slices/tasksSlice";
import { API, server } from "test/server";
import { demoTasks, demoUser, makeToken, serializeTask } from "test/fixtures";

const renderList = async () => {
  const store = makeStore({
    auth: { user: demoUser, token: makeToken(), status: "idle", error: null },
  });
  render(
    <Provider store={store}>
      <ToDoList />
    </Provider>
  );
  await store.dispatch(fetchTasks());
  return store;
};

test("lists tasks with status, priority and an overdue marker", async () => {
  const overdue = { ...demoTasks[1], id: 7, title: "Send invoice", deadline: "2020-01-02T00:00:00.000Z" };
  server.use(
    http.get(`${API}/api/v1/tasks`, () =>
      HttpResponse.json({ data: [...demoTasks, overdue].map(serializeTask) })
    )
  );
  await renderList();
  const items = await screen.findAllByRole("listitem");
  expect(items).toHaveLength(4);
  expect(within(items[0]).getByText("In progress")).toBeInTheDocument();
  expect(within(items[0]).getByText("High priority")).toBeInTheDocument();
  expect(within(items[3]).getByText(/Overdue · 2 Jan 2020/)).toBeInTheDocument();
  expect(screen.getByText("4 tasks · 3 open · 1 overdue")).toBeInTheDocument();
});

test("shows an empty state when there are no tasks", async () => {
  server.use(http.get(`${API}/api/v1/tasks`, () => HttpResponse.json({ data: [] })));
  await renderList();
  expect(await screen.findByText("No tasks yet")).toBeInTheDocument();
  expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
});

test("shows the API error and retries on request", async () => {
  let calls = 0;
  server.use(
    http.get(`${API}/api/v1/tasks`, () => {
      calls += 1;
      return calls === 1
        ? HttpResponse.json({ message: "Database is unavailable" }, { status: 503 })
        : HttpResponse.json({ data: [serializeTask(demoTasks[0])] });
    })
  );
  await renderList();
  expect(await screen.findByRole("alert")).toHaveTextContent("Database is unavailable");
  await userEvent.click(screen.getByRole("button", { name: "Retry" }));
  expect(await screen.findByText("Draft release notes")).toBeInTheDocument();
});
