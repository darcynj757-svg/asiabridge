import app from "./app";
import { logger } from "./lib/logger";

const RENDER_URL = "https://asiabridge-1.onrender.com";
const PING_INTERVAL_MS = 14 * 60 * 1000;

function startKeepAlive() {
  const ping = async () => {
    try {
      const res = await fetch(RENDER_URL, { signal: AbortSignal.timeout(10000) });
      logger.info({ status: res.status }, `Keep-alive ping → ${RENDER_URL}`);
    } catch (err) {
      logger.warn({ err }, `Keep-alive ping failed → ${RENDER_URL}`);
    }
  };
  setInterval(ping, PING_INTERVAL_MS);
  logger.info(`Keep-alive started: pinging ${RENDER_URL} every 14 min`);
}

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err?: Error) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
  startKeepAlive();
});
