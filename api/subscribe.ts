import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { RegistrationPayload, RegistrationResponse } from "../src/types/registration";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" } satisfies RegistrationResponse);
  }

  const { firstName, email } = req.body as RegistrationPayload;

  if (!email) {
    return res.status(400).json({ success: false, error: "Email is required" } satisfies RegistrationResponse);
  }

  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const LIST_ID = process.env.MAILCHIMP_AUDIENCE_ID;

  if (!API_KEY || !LIST_ID) {
    console.error("Missing MAILCHIMP_API_KEY or MAILCHIMP_AUDIENCE_ID environment variables");
    return res.status(500).json({ success: false, error: "Server configuration error" } satisfies RegistrationResponse);
  }

  const DC = API_KEY.split("-")[1];

  if (!DC) {
    console.error("Malformed MAILCHIMP_API_KEY — could not extract datacenter");
    return res.status(500).json({ success: false, error: "Server configuration error" } satisfies RegistrationResponse);
  }

  try {
    const mcResponse = await fetch(
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
          merge_fields: {
            FNAME: firstName || "",
            LNAME: "",
          },
        }),
      }
    );

    const data = await mcResponse.json();

    // Member already exists — treat as success so the user isn't blocked
    if (mcResponse.ok || data.title === "Member Exists") {
      return res.status(200).json({ success: true } satisfies RegistrationResponse);
    }

    console.error("Mailchimp error response:", data);
    return res.status(400).json({
      success: false,
      error: data.detail || data.title || "Subscription failed",
    } satisfies RegistrationResponse);

  } catch (err) {
    console.error("Mailchimp fetch error:", err);
    return res.status(500).json({ success: false, error: "Server error. Please try again." } satisfies RegistrationResponse);
  }
}
