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
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto("https://strava.com/login");
  await page.type("#email", process.env.STRAVA_EMAIL);
  await page.type("#password", process.env.STRAVA_PASSWORD);
  await page.click("#login-button");
  console.log("Logging in to Strava...");

  await page.waitForSelector("#progress-goals");
  const goalTabs = [
    "#ride-goals-tab",
    "#run-goals-tab",
    "#relative-effort-goals-tab", // For some reason this select is never visible if it's first... 🤔
  ];

  for (const goalTab of goalTabs) {
    console.log(`Taking screenshot of ${goalTab}...`);
    await page.click(goalTab);
    await page.waitForSelector(`${goalTab.replace("-tab", "")}`, {
      visible: true,
    });
    const progressGoal = await page.$("#progress-goals > div.card");
    await progressGoal.screenshot({
      path: `./strava/strava-${goalTab}.png`,
    });
  }

  await browser.close();
})();
