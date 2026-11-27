// Ejecuta un tick de la célula de agentes desde un Render Cron Job.
// Uso local: AGENTS_BASE_URL=http://localhost:3000 node scripts/automation-tick.mjs

const baseUrl = (process.env.AGENTS_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
const secret = process.env.CRON_SECRET || "";

const url = `${baseUrl}/api/automation/tick`;

try {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(secret ? { Authorization: `Bearer ${secret}` } : {}),
    },
    body: JSON.stringify({ origen: "render-cron" }),
  });

  const text = await response.text();
  console.log(`[automation-tick] ${response.status} ${url}`);
  console.log(text.slice(0, 2000));

  if (!response.ok) process.exit(1);
} catch (error) {
  console.error("[automation-tick] Error:", error);
  process.exit(1);
}
