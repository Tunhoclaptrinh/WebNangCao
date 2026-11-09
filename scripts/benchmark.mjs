import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import { mkdir, writeFile } from "node:fs/promises";
import { cpus, platform, arch } from "node:os";

const port = process.env.PORT || "3100";
const output = "docs/lighthouse";
await mkdir(output, { recursive: true });

const chrome = await launch({
  chromePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-dev-shm-usage"],
});

const pages = [];
const targets = [
  ["home", "/"],
  ["subjects", "/subjects/lap-trinh-web-nang-cao"],
  ["deadlines", "/deadlines"],
];

try {
  for (const [label, route] of targets) {
    const url = `http://localhost:${port}${route}`;
    console.log(`Running Lighthouse benchmark for ${url}...`);

    const result = await lighthouse(url, {
      port: chrome.port,
      output: ["json", "html"],
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    });

    if (!result || result.lhr.runtimeError) {
      console.warn(`Lighthouse warning for ${route}:`, result?.lhr.runtimeError);
      continue;
    }

    const lhr = result.lhr;
    await writeFile(`${output}/${label}.html`, result.report[1]);

    const metrics = {
      route,
      performance: Math.round((lhr.categories.performance?.score || 0) * 100),
      accessibility: Math.round((lhr.categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((lhr.categories["best-practices"]?.score || 0) * 100),
      seo: Math.round((lhr.categories.seo?.score || 0) * 100),
      fcp: Math.round(lhr.audits["first-contentful-paint"]?.numericValue || 0),
      lcp: Math.round(lhr.audits["largest-contentful-paint"]?.numericValue || 0),
      cls: Number((lhr.audits["cumulative-layout-shift"]?.numericValue || 0).toFixed(3)),
    };

    pages.push(metrics);
    console.log(
      `✓ ${route} -> Perf: ${metrics.performance} | A11y: ${metrics.accessibility} | BP: ${metrics.bestPractices} | SEO: ${metrics.seo} | LCP: ${metrics.lcp}ms`
    );
  }

  await writeFile(
    `${output}/summary.json`,
    JSON.stringify(
      {
        benchmarkDate: new Date().toISOString(),
        node: process.version,
        cpu: cpus()[0].model,
        platform: `${platform()} ${arch()}`,
        pages,
      },
      null,
      2
    ) + "\n"
  );

  console.log("Lighthouse benchmark completed successfully!");
} finally {
  await chrome.kill();
}
