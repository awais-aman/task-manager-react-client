import { describe, expect, test } from "vitest";
import { http, HttpResponse } from "msw/http";
import { persistStore } from "redux-persist";

import { makeStore, migrations } from "store/makeStore";
import { authenticate, logout } from "store/slices/authSlice";
import { fetchTasks } from "store/slices/tasksSlice";
import { API, server } from "test/server";
import { demoUser, makeToken } from "test/fixtures";

const signedIn = (token = makeToken()) => ({
  auth: { user: demoUser, token, status: "idle", error: null },
});

const rehydrate = (store) =>
  new Promise((resolve) => {
    const persistor = persistStore(store, null, () => resolve(persistor));
  });

describe("session", () => {
  test("login keeps the user and the Authorization header token", async () => {
    const store = makeStore();
    await store.dispatch(
      authenticate({ credentials: { user: {} }, isLogin: true })
    );
    expect(store.getState().auth.user.email).toBe(demoUser.email);
    expect(store.getState().auth.token).toMatch(/^Bearer /);
  });

  test("API requests carry the token from the store", async () => {
    let header;
    server.use(
      http.get(`${API}/api/v1/tasks`, ({ request }) => {
        header = request.headers.get("Authorization");
        return HttpResponse.json({ data: [] });
      })
    );
    const token = makeToken();
    const store = makeStore(signedIn(token));
    await store.dispatch(fetchTasks());
    expect(header).toBe(token);
  });

  test("a 401 ends the session once, without a logout request loop", async () => {
    let logoutCalls = 0;
    server.use(
      http.get(`${API}/api/v1/tasks`, () =>
        HttpResponse.json({ error: "Signature has expired" }, { status: 401 })
      ),
      http.delete(`${API}/logout`, () => {
        logoutCalls += 1;
        return HttpResponse.json({}, { status: 401 });
      })
    );
    const store = makeStore(signedIn());
    await store.dispatch(fetchTasks());
    expect(store.getState().auth.token).toBeNull();
    expect(store.getState().tasks.items).toEqual([]);
    expect(logoutCalls).toBe(0);
  });

  test("an expired token is dropped before the request is sent", async () => {
    let requests = 0;
    server.use(
      http.get(`${API}/api/v1/tasks`, () => {
        requests += 1;
        return HttpResponse.json({ data: [] });
      })
    );
    const store = makeStore(signedIn(makeToken(-5)));
    const result = await store.dispatch(fetchTasks());
    expect(requests).toBe(0);
    expect(result.payload[0]).toMatch(/session has expired/i);
    expect(store.getState().auth.user).toBeNull();
  });

  test("logout clears the session even when the API refuses", async () => {
    server.use(
      http.delete(`${API}/logout`, () => HttpResponse.json({}, { status: 500 }))
    );
    const store = makeStore(signedIn());
    await store.dispatch(logout());
    expect(store.getState().auth.user).toBeNull();
    expect(store.getState().auth.token).toBeNull();
  });

  test("a failed task load ends in an error state, not a stuck loader", async () => {
    server.use(
      http.get(`${API}/api/v1/tasks`, () =>
        HttpResponse.json({ message: "boom" }, { status: 500 })
      )
    );
    const store = makeStore(signedIn());
    await store.dispatch(fetchTasks());
    expect(store.getState().tasks.status).toBe("failed");
    expect(store.getState().tasks.error).toEqual(["boom"]);
  });
});

describe("persisted state", () => {
  test("migrates the pre-toolkit shape and drops cached tasks", () => {
    const legacy = {
      authReducer: { user: demoUser, token: "Bearer x", isLoading: true, error: null },
      tasksReducer: { tasks: [{ id: 1 }], task: null, isLoading: true },
      _persist: { version: -1, rehydrated: true },
    };
    localStorage.setItem("authToken", "Bearer x");
    const migrated = migrations[1](legacy);
    expect(migrated.auth).toEqual({ user: demoUser, token: "Bearer x" });
    expect(migrated).not.toHaveProperty("tasksReducer");
    expect(localStorage.getItem("authToken")).toBeNull();
  });

  test("rehydrates a legacy session that is still valid", async () => {
    const token = makeToken();
    localStorage.setItem(
      "persist:persist-key",
      JSON.stringify({
        authReducer: JSON.stringify({ user: demoUser, token, isLoading: false }),
        tasksReducer: JSON.stringify({ tasks: [{ id: 9 }], isLoading: true }),
        _persist: JSON.stringify({ version: -1, rehydrated: true }),
      })
    );
    const store = makeStore();
    await rehydrate(store);
    expect(store.getState().auth.user).toEqual(demoUser);
    expect(store.getState().auth.token).toBe(token);
    expect(store.getState().auth.status).toBe("idle");
    expect(store.getState().tasks.items).toEqual([]);
    expect(store.getState()).not.toHaveProperty("authReducer");
  });

  test("does not restore an expired session", async () => {
    localStorage.setItem(
      "persist:persist-key",
      JSON.stringify({
        auth: JSON.stringify({ user: demoUser, token: makeToken(-60) }),
        _persist: JSON.stringify({ version: 1, rehydrated: true }),
      })
    );
    const store = makeStore();
    await rehydrate(store);
    expect(store.getState().auth.user).toBeNull();
  });

  test("stores only the user and token", async () => {
    const store = makeStore();
    const persistor = await rehydrate(store);
    await store.dispatch(
      authenticate({ credentials: { user: {} }, isLogin: true })
    );
    await persistor.flush();
    const saved = JSON.parse(localStorage.getItem("persist:persist-key"));
    expect(Object.keys(saved).sort()).toEqual(["_persist", "auth"]);
    expect(Object.keys(JSON.parse(saved.auth)).sort()).toEqual(["token", "user"]);
  });
});
