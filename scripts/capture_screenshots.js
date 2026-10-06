import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = path.resolve(process.cwd(), 'docs/screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function clickButtonByText(page, text) {
  return page.evaluate((targetText) => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find((b) => b.textContent && b.textContent.includes(targetText));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  }, text);
}

async function dismissFloatingOverlays(page) {
  await page.mouse.move(0, 0);
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.id = 'hide-overlays-style';
    style.innerHTML = '.ant-message, .ant-tooltip { display: none !important; }';
    document.head.appendChild(style);
  });
  await new Promise((r) => setTimeout(r, 300));
}

async function restoreFloatingOverlays(page) {
  await page.evaluate(() => {
    const style = document.getElementById('hide-overlays-style');
    if (style) style.remove();
  });
}

async function main() {
  console.log(`Launching browser from: ${CHROME_PATH}`);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // 1. Light Mode Default + Pin an item
  console.log('1. Setting Light Mode and Pinning...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    localStorage.setItem('student_deadline_theme_mode', 'light');
    localStorage.removeItem('student_deadline_pinned_ids');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  // Pin the 2nd item
  const pinBtns = await page.$$('button[aria-label="Ghim"]');
  if (pinBtns.length > 1) {
    await pinBtns[1].click();
    await new Promise((r) => setTimeout(r, 800));
  }
  await dismissFloatingOverlays(page);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_theme_light_and_pinned.png') });

  // 2. Lazy Loaded Stats Dashboard in Light Mode
  console.log('2. Capturing Stats Dashboard...');
  await clickButtonByText(page, 'Thống kê');
  await new Promise((r) => setTimeout(r, 1000));
  await dismissFloatingOverlays(page);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_lazy_stats_dashboard.png') });

  // 3. Dark Theme Mode
  console.log('3. Switching to Dark Theme Mode...');
  const themeToggle = await page.$('button[aria-label="Chuyển đổi giao diện Sáng / Tối"]');
  if (themeToggle) {
    await themeToggle.click();
    await new Promise((r) => setTimeout(r, 1000));
  }
  await dismissFloatingOverlays(page);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_theme_dark_mode.png') });

  // 4. Stress Test 10.000 Items & Virtualization
  console.log('4. Capturing 10k Stress Test & Virtualization...');
  // Close stats dashboard first to show virtualized list prominently
  await clickButtonByText(page, 'Thống kê');
  await new Promise((r) => setTimeout(r, 600));
  await clickButtonByText(page, '10.000 bài mẫu');
  await new Promise((r) => setTimeout(r, 3000));
  await dismissFloatingOverlays(page);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_stress_test_10k_virtualization.png') });

  await browser.close();
  console.log('All screenshots captured with crystal clarity!');
}

main().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
