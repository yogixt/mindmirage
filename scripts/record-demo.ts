import { chromium, type Page } from "playwright";
import { spawn, type ChildProcess } from "child_process";
import path from "path";
import fs from "fs";

const OUT_DIR = path.join(process.cwd(), "public", "video");
const DEMO_PORT = 3456;
const VIEWPORT = { width: 1920, height: 1080 };

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function smoothScroll(page: Page, y: number, duration = 1200) {
  const startY = await page.evaluate(() => window.scrollY);
  const diff = y - startY;
  const steps = Math.max(20, Math.round(duration / 40));
  const stepDelta = diff / steps;
  const stepMs = duration / steps;
  for (let i = 0; i < steps; i++) {
    await page.evaluate((d) => window.scrollBy(0, d), stepDelta);
    await sleep(stepMs);
  }
  await sleep(200);
}

async function hoverAndPause(page: Page, selector: string, pause = 800) {
  const el = page.locator(selector).first();
  await el.hover();
  await sleep(pause);
}

function startServer(): Promise<ChildProcess> {
  return new Promise((resolve, reject) => {
    const proc = spawn("npx", ["next", "start", "-p", String(DEMO_PORT)], {
      cwd: process.cwd(),
      stdio: "pipe",
      env: { ...process.env, NODE_ENV: "production" },
    });
    let ready = false;
    proc.stdout?.on("data", (d) => {
      const text = d.toString();
      if (text.includes("Ready") || text.includes("localhost")) {
        if (!ready) {
          ready = true;
          resolve(proc);
        }
      }
    });
    proc.stderr?.on("data", (d) => {
      const text = d.toString();
      if (text.includes("Ready") || text.includes("localhost")) {
        if (!ready) {
          ready = true;
          resolve(proc);
        }
      }
    });
    setTimeout(() => {
      if (!ready) resolve(proc);
    }, 15000);
    proc.on("error", reject);
  });
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Build first
  console.log("Building site…");
  const build = spawn("npx", ["next", "build"], {
    cwd: process.cwd(),
    stdio: "inherit",
    env: process.env,
  });
  await new Promise<void>((resolve, reject) => {
    build.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`Build exited ${code}`))));
  });

  // Start server
  console.log("Starting production server…");
  const server = await startServer();
  await sleep(3000);

  const baseUrl = `http://localhost:${DEMO_PORT}`;

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: {
      dir: OUT_DIR,
      size: VIEWPORT,
    },
  });

  const page = await context.newPage();

  // ============================================================
  // SCENE 1: Homepage hero
  // ============================================================
  console.log("Recording: Homepage…");
  await page.goto(baseUrl + "/", { waitUntil: "networkidle" });
  await sleep(1500);

  // Scroll through homepage sections
  await smoothScroll(page, 800, 1500);
  await smoothScroll(page, 1800, 1800);
  await smoothScroll(page, 3200, 2000);
  await smoothScroll(page, 4800, 2000);
  await smoothScroll(page, 6500, 2000);
  await smoothScroll(page, 0, 1000);
  await sleep(800);

  // ============================================================
  // SCENE 2: Programs page
  // ============================================================
  console.log("Recording: Programs…");
  await page.goto(baseUrl + "/programs", { waitUntil: "networkidle" });
  await sleep(1200);

  // Hover over first course card
  await hoverAndPause(page, "a[href^='/programs/']", 1200);
  await hoverAndPause(page, "a[href^='/programs/'] >> nth=1", 1200);
  await hoverAndPause(page, "a[href^='/programs/'] >> nth=2", 1200);

  await smoothScroll(page, 600, 1200);
  await sleep(600);

  // ============================================================
  // SCENE 3: Course detail page
  // ============================================================
  console.log("Recording: Course detail…");
  await page.goto(baseUrl + "/programs/bhagavad-gita", { waitUntil: "networkidle" });
  await sleep(1500);

  await smoothScroll(page, 700, 1200);
  await smoothScroll(page, 1600, 1500);
  await smoothScroll(page, 0, 1000);
  await sleep(600);

  // ============================================================
  // SCENE 4: Demo dashboard
  // ============================================================
  console.log("Recording: Dashboard…");
  await page.goto(baseUrl + "/demo", { waitUntil: "networkidle" });
  await sleep(1500);

  // Scroll through dashboard sections
  await smoothScroll(page, 600, 1200);
  await sleep(400);
  await smoothScroll(page, 1400, 1400);
  await sleep(400);
  await smoothScroll(page, 2400, 1600);
  await sleep(400);
  await smoothScroll(page, 3600, 1800);
  await sleep(400);
  await smoothScroll(page, 4800, 1800);
  await sleep(400);
  await smoothScroll(page, 6000, 1800);
  await sleep(400);
  await smoothScroll(page, 7200, 1800);
  await sleep(400);
  await smoothScroll(page, 0, 1200);
  await sleep(800);

  // ============================================================
  // SCENE 5: Vageshwari
  // ============================================================
  console.log("Recording: Vageshwari…");
  await page.goto(baseUrl + "/vageshwari", { waitUntil: "networkidle" });
  await sleep(1500);
  await smoothScroll(page, 500, 1000);
  await sleep(600);
  await smoothScroll(page, 0, 800);

  // ============================================================
  // FINISH
  // ============================================================
  await context.close();
  await browser.close();

  // Get the video file
  const files = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith(".webm"));
  if (files.length === 0) {
    console.error("No video file found!");
    server.kill();
    process.exit(1);
  }

  const rawPath = path.join(OUT_DIR, files[0]);
  const finalPath = path.join(OUT_DIR, "mind-mirage-demo.mp4");

  console.log("Post-processing video with ffmpeg…");

  // Convert webm to mp4, trim first/last slight blanks, stabilize
  const ffmpeg = spawn("ffmpeg", [
    "-y",
    "-i", rawPath,
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "22",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    "-an",
    "-vf", "fps=30,format=yuv420p",
    finalPath,
  ], { stdio: "inherit" });

  await new Promise<void>((resolve, reject) => {
    ffmpeg.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))));
  });

  // Clean up raw webm
  fs.unlinkSync(rawPath);

  console.log(`\n✅ Demo video saved to: ${finalPath}`);
  console.log(`   Size: ${(fs.statSync(finalPath).size / 1024 / 1024).toFixed(1)} MB`);

  server.kill();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
