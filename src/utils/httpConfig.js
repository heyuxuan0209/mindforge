function readTimeoutMs(envName, fallbackMs) {
  const raw = process.env[envName] ?? process.env.AI_API_TIMEOUT_MS;
  const parsed = Number.parseInt(raw ?? '', 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallbackMs;
  }
  return parsed;
}

module.exports = { readTimeoutMs };
