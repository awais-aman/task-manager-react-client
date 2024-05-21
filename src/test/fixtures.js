const base64url = (value) =>
  btoa(JSON.stringify(value)).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

// A devise-jwt shaped token; only the `exp` claim matters to the client.
export const makeToken = (secondsFromNow = 3600) =>
  `Bearer ${base64url({ alg: "HS256" })}.${base64url({
    sub: "1",
    jti: "demo",
    exp: Math.floor(Date.now() / 1000) + secondsFromNow,
  })}.signature`;

export const demoUser = {
  id: 1,
  first_name: "Ada",
  last_name: "Lovelace",
  email: "ada@example.com",
};

export const demoTasks = [
  {
    id: 3,
    title: "Draft release notes",
    description: "Summarise the sprint for the changelog",
    status: "In progress",
    priority: "high",
    deadline: "2026-11-14T00:00:00.000Z",
  },
  {
    id: 2,
    title: "Book venue",
    description: "Confirm the room for the team offsite",
    status: "pending",
    priority: "medium",
    deadline: "2026-11-20T00:00:00.000Z",
  },
  {
    id: 1,
    title: "Renew domain",
    description: "Pay the yearly renewal",
    status: "completed",
    priority: "low",
    deadline: "2026-11-02T00:00:00.000Z",
  },
];

export const serializeTask = (task) => ({
  id: String(task.id),
  type: "task",
  attributes: task,
});
