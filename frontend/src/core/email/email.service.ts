interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // no-op when env var is absent

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Vehicle Service Manager <onboarding@resend.dev>",
        to: options.to,
        subject: options.subject,
        text: options.text,
      }),
    });
  } catch (err) {
    console.error("Email send failed (non-fatal):", err);
  }
}
