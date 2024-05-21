import { http, HttpResponse } from "msw/http";
import { setupServer } from "msw/node";

import { demoTasks, demoUser, makeToken, serializeTask } from "./fixtures";

export const API = "http://localhost:3000";

export const handlers = [
  http.post(`${API}/login`, () =>
    HttpResponse.json(
      { data: { id: "1", type: "user", attributes: demoUser } },
      { headers: { Authorization: makeToken() } }
    )
  ),
  http.delete(`${API}/logout`, () =>
    HttpResponse.json({ status: 200, message: "logged out successfully" })
  ),
  http.get(`${API}/api/v1/tasks`, () =>
    HttpResponse.json({ data: demoTasks.map(serializeTask) })
  ),
];

export const server = setupServer(...handlers);
