// Simple static website server for Render.
// Serves your site's files (for example, index.html) without accounts,
// registration, login, databases, or user-data endpoints.

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;
const SITE_DIR = __dirname;

// Basic security headers for a static site.
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  next();
});

// Render health-check endpoint.
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Serve static files from the same directory as this server.js.
// Put index.html, CSS, JS, images, etc. beside server.js.
app.use(express.static(SITE_DIR, {
  index: "index.html",
  extensions: ["html"],
  dotfiles: "ignore"
}));

// If a requested page isn't found, show the site's homepage.
app.get("*", (_req, res) => {
  res.sendFile(path.join(SITE_DIR, "index.html"), (err) => {
    if (err && !res.headersSent) {
      res.status(404).send("index.html was not found. Add it beside server.js.");
    }
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Static site server listening on port ${PORT}`);
});
