import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const BASE_URL = "http://localhost:3000";

const VIEWPORTS = [
  // Desktop
  { name: "desktop-1920x1080", width: 1920, height: 1080 },
  { name: "desktop-1600x900",  width: 1600, height: 900  },
  { name: "desktop-1440x900",  width: 1440, height: 900  },
  { name: "desktop-1366x768",  width: 1366, height: 768  },
  { name: "desktop-1280x720",  width: 1280, height: 720  },
  // Tablet
  { name: "tablet-1024x1366",  width: 1024, height: 1366 },
  { name: "tablet-834x1194",   width: 834,  height: 1194 },
  { name: "tablet-768x1024",   width: 768,  height: 1024 },
  // Mobile
  { name: "mobile-430x932",    width: 430,  height: 932  },
  { name: "mobile-393x852",    width: 393,  height: 852  },
  { name: "mobile-390x844",    width: 390,  height: 844  },
  { name: "mobile-375x812",    width: 375,  height: 812  },
  { name: "mobile-360x800",    width: 360,  height: 800  },
  { name: "mobile-320x568",    width: 320,  height: 568  },
] as const;

const SCREENSHOT_DIR = path.join(process.cwd(), "tests", "screenshots");

test.beforeAll(() => {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
});

for (const vp of VIEWPORTS) {
  test(`visual QA — ${vp.name}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);

    // No horizontal scroll
    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollW, `Horizontal scroll at ${vp.width}px`).toBeLessThanOrEqual(vp.width + 2);

    // Hero does not force page beyond viewport height
    const mainH = await page.evaluate(() => {
      const el = document.querySelector("main");
      return el ? el.scrollHeight : 0;
    });
    expect(mainH, "Hero height").toBeLessThanOrEqual(vp.height * 1.08);

    // Screenshot
    const outPath = path.join(SCREENSHOT_DIR, `${vp.name}.png`);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`  ✓ ${vp.name} — ${outPath}`);

    if (consoleErrors.length > 0) {
      console.warn(`  ⚠ Console errors at ${vp.name}:`, consoleErrors);
    }
  });
}

test("mobile menu — opens and closes with ESC", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });

  const hamburger = page.locator("button[aria-label='Open navigation']");
  const mobileMenu = page.locator(".mobile-menu");

  await expect(hamburger).toBeVisible();

  // Initially closed (max-height: 0 → zero rendered height → not visible)
  await expect(mobileMenu).not.toBeVisible();

  await hamburger.click();
  await expect(mobileMenu).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(mobileMenu).not.toBeVisible({ timeout: 1000 });
});
