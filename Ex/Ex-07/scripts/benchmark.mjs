import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import { mkdir, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { cpus, platform, arch } from "node:os";
const phase = process.argv[2];
if (!["baseline", "optimized"].includes(phase))
  throw new Error("Usage: npm run benchmark -- baseline|optimized");
const output = `docs/evidence/lighthouse/${phase}`;
await mkdir(output, { recursive: true });
const chrome = await launch({
  chromePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-dev-shm-usage"],
});
const pages = [];
try {
  for (const [label, route] of [
    ["catalogue", "/products"],
    ["product", "/products/keychron-q1"],
  ]) {
    await fetch(`http://localhost:3000${route}`);
    const runs = [];
    for (let i = 1; i <= 3; i++) {
      const result = await lighthouse(`http://localhost:3000${route}`, {
        port: chrome.port,
        output: ["json", "html"],
        logLevel: "error",
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
      });
      if (!result || result.lhr.runtimeError)
        throw new Error(
          JSON.stringify(result?.lhr.runtimeError || "No Lighthouse result"),
        );
      const lhr = result.lhr;
      await writeFile(`${output}/${label}-${i}.json`, result.report[0]);
      const run = {
        run: i,
        performance: Math.round((lhr.categories.performance.score || 0) * 100),
        accessibility: Math.round(
          (lhr.categories.accessibility.score || 0) * 100,
        ),
        bestPractices: Math.round(
          (lhr.categories["best-practices"].score || 0) * 100,
        ),
        seo: Math.round((lhr.categories.seo.score || 0) * 100),
        fcp: lhr.audits["first-contentful-paint"].numericValue,
        lcp: lhr.audits["largest-contentful-paint"].numericValue,
        cls: lhr.audits["cumulative-layout-shift"].numericValue,
        tbt: lhr.audits["total-blocking-time"].numericValue,
        transferBytes: lhr.audits["total-byte-weight"].numericValue,
        fetchTime: lhr.fetchTime,
        html: result.report[1],
      };
      runs.push(run);
      console.log(
        `${phase} ${route} run ${i}: P${run.performance} A${run.accessibility} BP${run.bestPractices} SEO${run.seo} LCP=${Math.round(run.lcp)}ms CLS=${run.cls}`,
      );
    }
    const median = [...runs].sort((a, b) => a.performance - b.performance)[1];
    await writeFile(`${output}/${label}-median.html`, median.html);
    pages.push({
      route,
      medianRun: median.run,
      runs: runs.map((run) => ({ ...run, html: undefined })),
    });
  }
  await writeFile(
    `${output}/summary.json`,
    JSON.stringify(
      {
        phase,
        commit: execFileSync("git", ["rev-parse", "HEAD"], {
          encoding: "utf8",
        }).trim(),
        mode: "production; mobile simulated throttling; 3 runs/page; performance median",
        node: process.version,
        cpu: cpus()[0].model,
        platform: `${platform()} ${arch()}`,
        pages,
      },
      null,
      2,
    ) + "\n",
  );
} finally {
  await chrome.kill();
}
