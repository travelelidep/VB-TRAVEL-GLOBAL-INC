export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.AUTOMATION_SELF_SCHEDULE === "false") return;

  const { startScheduler } = await import("./lib/agents/scheduler");
  startScheduler();
}
