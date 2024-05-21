// Captures docs/screenshots/*.png from the production build with a mocked API.
// Run inside mcr.microsoft.com/playwright:v1.64.1-noble after
// `VITE_API_BASE_URL=http://api.test npm run build` (see README).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const DIST = path.resolve("dist");
const OUT = path.resolve(process.env.SCREENSHOT_DIR ?? "docs/screenshots");
const API = "http://api.test";
const PORT = 4173;

const day = (offset) => {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString();
};

const user = { id: 1, first_name: "Demo", last_name: "User", email: "demo@example.com" };
const tasks = [
  { id: 6, title: "Draft release notes", description: "Summarise the sprint's changes for the changelog", status: "In progress", priority: "high", deadline: day(2) },
  { id: 5, title: "Book offsite venue", description: "Confirm the room and catering for twelve people", status: "pending", priority: "medium", deadline: day(9) },
  { id: 4, title: "Send March invoice", description: "Invoice the client for the support retainer", status: "pending", priority: "high", deadline: day(-3) },
  { id: 3, title: "Review pull requests", description: "Two open PRs on the reporting module", status: "In progress", priority: "low", deadline: day(1) },
  { id: 2, title: "Renew domain", description: "Yearly renewal for the marketing site", status: "completed", priority: "low", deadline: day(-6) },
];
const asJsonApi = (task) => ({ id: String(task.id), type: "task", attributes: task });
const b64 = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
const token = `Bearer ${b64({ alg: "HS256" })}.${b64({ sub: "1", exp: Math.floor(Date.now() / 1000) + 86400 })}.demo`;

const types = { ".js": "text/javascript", ".css": "text/css", ".html": "text/html", ".json": "application/json", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2", ".woff": "font/woff" };
const server = http
  .createServer((req, res) => {
    let file = path.join(DIST, decodeURIComponent(req.url.split("?")[0]));
    if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      file = path.join(DIST, "index.html");
    }
    res.writeHead(200, { "content-type": types[path.extname(file)] ?? "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT);

const mockApi = async (page) => {
  await page.route(`${API}/**`, async (route) => {
    const request = route.request();
    const { pathname } = new URL(request.url());
    const json = (body, headers = {}) =>
      route.fulfill({ status: 200, contentType: "application/json", headers: { "access-control-expose-headers": "Authorization", ...headers }, body: JSON.stringify(body) });
    if (pathname === "/login") return json({ data: asJsonApi({ ...user }) }, { authorization: token });
    if (pathname === "/api/v1/tasks") return json({ data: tasks.map(asJsonApi) });
    const match = pathname.match(/^\/api\/v1\/tasks\/(\d+)$/);
    if (match) return json({ data: asJsonApi(tasks.find((task) => task.id === Number(match[1]))) });
    return route.fulfill({ status: 404, body: "{}" });
  });
};

const errors = [];
const browser = await chromium.launch();
fs.mkdirSync(OUT, { recursive: true });

const capture = async ({ name, width, height, signIn, after }) => {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  page.on("pageerror", (error) => errors.push(`${name}: ${error}`));
  page.on("console", (msg) => msg.type() === "error" && errors.push(`${name}: ${msg.text()}`));
  await mockApi(page);
  await page.goto(`http://localhost:${PORT}/${signIn ? "login" : signIn === false ? "sign-up" : "login"}`);
  if (signIn) {
    await page.getByLabel("Email address").fill(user.email);
    await page.getByLabel("Password").fill("demo-password");
    await page.getByRole("button", { name: "Log in" }).click();
    await page.getByText("Draft release notes").waitFor();
    await page.locator(".Toastify__close-button").first().click();
    await page.locator(".Toastify__toast").waitFor({ state: "detached" });
  }
  if (after) await after(page);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  if (overflow > 0) errors.push(`${name}: page is ${overflow}px wider than the viewport`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: Boolean(signIn) });
  console.log(`captured ${name}.png`);
  await page.close();
};

await capture({ name: "login-desktop", width: 1440, height: 900 });
await capture({ name: "signup-mobile", width: 390, height: 844, signIn: false });
await capture({ name: "tasks-desktop", width: 1440, height: 900, signIn: true });
await capture({
  name: "edit-task-desktop",
  width: 1440,
  height: 900,
  signIn: true,
  after: async (page) => {
    await page.getByRole("button", { name: "Edit Book offsite venue" }).click();
    await page.getByRole("heading", { name: "Edit task" }).waitFor();
    await page.getByRole("button", { name: "Change status of Draft release notes" }).click();
    await page.getByText("Mark as Completed").waitFor();
    await page.waitForTimeout(400); // popover fade-in
  },
});
await capture({ name: "tasks-mobile", width: 390, height: 844, signIn: true });

await browser.close();
server.close();
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
