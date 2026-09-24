/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createExpressApp } from "./app";
import { SERVER_CONFIG } from "./config";

const app = createExpressApp();

// Welcome / health discovery root route
app.get("/", (_req, res) => {
  res.json({
    service: "Volmo Electric Backend API",
    status: "online",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      leads: "/api/leads",
      config: "/api/config",
    },
  });
});

const server = app.listen(SERVER_CONFIG.PORT, SERVER_CONFIG.HOST, () => {
  console.log(
    `[Volmo Backend API] Server listening on http://${SERVER_CONFIG.HOST}:${SERVER_CONFIG.PORT} in ${SERVER_CONFIG.NODE_ENV} mode`
  );
  console.log(`[Volmo Backend API] Health check endpoint at http://${SERVER_CONFIG.HOST}:${SERVER_CONFIG.PORT}/api/health`);
});

export default server;
