const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("workspace")); // Serve files from the workspace folder

// File storage directories
const directories = {
  localhost: "./workspace",
  "about:blank": "./workspace-about-blank",
};

// Ensure the directories exist
Object.values(directories).forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Handle "code on" commands
app.post("/code", (req, res) => {
  const { domain, files } = req.body;

  if (!directories[domain]) {
    return res.status(400).json({ error: "Unsupported domain" });
  }

  const targetDir = directories[domain];

  // Write files to the target directory
  for (const [filename, content] of Object.entries(files)) {
    const filePath = path.join(targetDir, filename);
    fs.writeFileSync(filePath, content, "utf8");
  }

  res.json({
    message: `Code successfully deployed to ${domain}`,
    url: `http://localhost:${PORT}`,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
