const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    args: [
      // Required for Docker version of Puppeteer
      "--no-sandbox",
      "--disable-setuid-sandbox",
      // This will write shared memory files into /tmp instead of /dev/shm,
      // because Docker’s default for /dev/shm is 64MB
      "--disable-dev-shm-usage",
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
  await page.goto("https://strava.com/login");
  await page.type("#desktop-email", process.env.STRAVA_EMAIL);
  await page.click("#desktop-login-button");
  await page.type(
    "input[type=password][name=password]",
    process.env.STRAVA_PASSWORD,
  );
  await page.click("button[type=submit]");
  console.log("Logging in to Strava...");

  await page.waitForSelector("#progress-goals");
  const goalTabs = [
    { elementId: "tabs--1--tab--2", friendlyName: "ride-goals-tab" }, // ride-goals-tab
    { elementId: "tabs--1--tab--1", friendlyName: "run-goals-tab" }, // run-goals-tab
    { elementId: "tabs--1--tab--0", friendlyName: "relative-effort-goals-tab" },
  ];

  for (const { elementId, friendlyName } of goalTabs) {
    console.log(`Taking screenshot of ${goalTab}...`);
    await page.click(`#${elementId}`);
    await page.waitForSelector(`#tabs--1--panel--1`, {
      visible: true,
    });
    await progressGoal.screenshot({
      path: `./strava/strava-${friendlyName}.png`,
    });
  }

  await browser.close();
})();
