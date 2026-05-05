import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const API_KEY = process.env.MAILCHIMP_API_KEY!;
  const LIST_ID = process.env.MAILCHIMP_AUDIENCE_ID!;
  const DC = API_KEY.split("-")[1];

  const firstName = name ? name.split(" ")[0] : "";
  const lastName = name ? name.split(" ").slice(1).join(" ") : "";

  try {
    const response = await fetch(
      `https://${DC}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`,
      {
        method: "POST",
        headers: {
          Authorization: `apikey ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
          merge_fields: { FNAME: firstName, LNAME: lastName },
        }),
      }
    );

    const data = await response.json();

    if (response.ok || data.title === "Member Exists") {
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: data.detail || "Subscription failed" });
  } catch (err) {
    console.error("Mailchimp error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
}
