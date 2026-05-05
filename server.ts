import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import mailchimp from "@mailchimp/mailchimp_marketing";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mailchimp API Route
  app.post("/api/register", async (req, res) => {
    const { firstName, email } = req.body;

    if (!firstName || !email) {
      return res.status(400).json({ error: "First name and email are required" });
    }

    const apiKey = process.env.MAILCHIMP_API_KEY;
    const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

    if (!apiKey || !serverPrefix || !audienceId) {
      console.error("Missing Mailchimp configuration");
      return res.status(500).json({ error: "Mailchimp integration is not configured yet." });
    }

    mailchimp.setConfig({
      apiKey: apiKey,
      server: serverPrefix,
    });

    try {
      await mailchimp.lists.addListMember(audienceId, {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
        },
      });

      res.status(200).json({ message: "Success" });
    } catch (error: any) {
      console.error("Mailchimp error:", error);
      
      // Handle "member already exists" as a success or specific message
      if (error.response?.body?.title === "Member Exists") {
        return res.status(200).json({ message: "Already registered" });
      }

      res.status(500).json({ 
        error: "Failed to register. Please try again later.",
        details: error.response?.body?.detail || error.message
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
