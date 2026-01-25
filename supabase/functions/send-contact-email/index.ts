import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FORWARD_TO_EMAIL = Deno.env.get("FORWARD_TO_EMAIL") || "verender@meassetmanagement.com";

// IMPORTANT: For production, set RESEND_FROM_EMAIL to your verified domain email
// e.g., "contact@meassetmanagement.com" or "noreply@meassetmanagement.com"
// The sandbox domain (onboarding@resend.dev) can ONLY send to the Resend account owner's email
const FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL") || "ME Asset Management <onboarding@resend.dev>";

serve(async (req) => {
  try {
    // Validate API key is present
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY environment variable is not set");
      return new Response(
        JSON.stringify({
          error: "Email service not configured",
          details: "RESEND_API_KEY is missing"
        }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }

    const body = await req.json();
    const { record } = body;

    // Validate record exists
    if (!record) {
      console.error("No record provided in request body:", JSON.stringify(body));
      return new Response(
        JSON.stringify({ error: "Invalid request", details: "No record provided" }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }

    const { name, email, subject, message, created_at } = record;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.error("Missing required fields:", { name: !!name, email: !!email, subject: !!subject, message: !!message });
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          details: { name: !!name, email: !!email, subject: !!subject, message: !!message }
        }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }

    const formattedDate = new Date(created_at || Date.now()).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const emailPayload = {
      from: FROM_EMAIL,
      to: [FORWARD_TO_EMAIL],
      reply_to: email,
      subject: `[Contact Form] ${subject}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #252e24; font-family: Georgia, 'Times New Roman', serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #252e24;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(180deg, #424f41 0%, #3A4539 100%); padding: 40px 40px 30px; border-radius: 8px 8px 0 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; font-size: 28px; font-weight: 600; color: #f5f0e8; letter-spacing: 1px;">
                      ME <span style="color: rgba(245, 240, 232, 0.5); font-weight: 300;">|</span> <span style="font-weight: 400; font-size: 20px; text-transform: uppercase; letter-spacing: 3px;">Asset Management</span>
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Title Bar -->
          <tr>
            <td style="background-color: #2d382c; padding: 20px 40px; border-bottom: 1px solid rgba(245, 240, 232, 0.1);">
              <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 3px; color: rgba(232, 230, 227, 0.5);">
                New Contact Form Submission
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="background-color: #2d382c; padding: 40px;">

              <!-- Sender Info -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px; background-color: rgba(255, 255, 255, 0.03); border-left: 3px solid rgba(245, 240, 232, 0.3); border-radius: 0 4px 4px 0;">
                    <p style="margin: 0 0 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: rgba(232, 230, 227, 0.4);">From</p>
                    <p style="margin: 0 0 4px; font-size: 20px; color: #f5f0e8; font-weight: 400;">${name}</p>
                    <p style="margin: 0; font-size: 15px; color: rgba(232, 230, 227, 0.6);">
                      <a href="mailto:${email}" style="color: rgba(232, 230, 227, 0.6); text-decoration: none;">${email}</a>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Subject -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: rgba(232, 230, 227, 0.4);">Subject</p>
                    <p style="margin: 0; font-size: 18px; color: #e8e6e3; font-weight: 400;">${subject}</p>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: rgba(232, 230, 227, 0.4);">Message</p>
                    <div style="padding: 24px; background-color: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                      <p style="margin: 0; font-size: 16px; line-height: 1.7; color: rgba(232, 230, 227, 0.85);">${message.replace(/\n/g, "<br>")}</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Reply Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="mailto:${email}?subject=Re: ${subject}" style="display: inline-block; padding: 14px 32px; background-color: rgba(245, 240, 232, 0.1); color: #f5f0e8; text-decoration: none; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; border: 1px solid rgba(245, 240, 232, 0.2); border-radius: 4px;">
                      Reply to ${name.split(' ')[0]}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #252e24; padding: 30px 40px; border-radius: 0 0 8px 8px; border-top: 1px solid rgba(245, 240, 232, 0.05);">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: rgba(232, 230, 227, 0.3);">
                      Received on ${formattedDate}
                    </p>
                    <p style="margin: 0; font-size: 11px; color: rgba(232, 230, 227, 0.2);">
                      ME Asset Management • meassetmanagement.com
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    };

    console.log("Sending email with payload:", JSON.stringify({
      ...emailPayload,
      html: "[HTML content]"
    }));

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend API error:", JSON.stringify({
        status: res.status,
        statusText: res.statusText,
        response: data
      }));
      return new Response(
        JSON.stringify({
          error: "Failed to send email",
          resend_error: data,
          hint: FROM_EMAIL.includes("@resend.dev")
            ? "You are using the Resend sandbox domain which can only send to the account owner's email. Set RESEND_FROM_EMAIL to a verified domain."
            : undefined
        }),
        { headers: { "Content-Type": "application/json" }, status: res.status }
      );
    }

    console.log("Email sent successfully:", JSON.stringify(data));
    return new Response(JSON.stringify({ success: true, data }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Unexpected error:", error.message, error.stack);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
});
