// Simple static website server for Render using Express 5.
// No account creation, login, registration, or database endpoints.

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;
const SITE_DIR = __dirname;

app.disable("x-powered-by");

// Basic security headers for a static site.
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  next();
});

// Render health check.
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Serve index.html, CSS, JavaScript, images, and other static assets.
app.use(express.static(SITE_DIR, {
  index: "index.html",
  extensions: ["html"],
  dotfiles: "ignore"
}));

// Express 5 catch-all: use middleware instead of app.get("*").
app.use((_req, res) => {
  const homepage = path.join(SITE_DIR, "index.html");
  res.sendFile(homepage, (err) => {
    if (err && !res.headersSent) {
      res.status(404).send("index.html was not found. Add it beside server.js.");
    }
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Website server listening on port ${PORT}`);
});
