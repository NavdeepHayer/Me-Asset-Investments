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

    const emailPayload = {
      from: FROM_EMAIL,
      to: [FORWARD_TO_EMAIL],
      reply_to: email,
      subject: `[Contact Form] ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Date:</strong> ${new Date(created_at || Date.now()).toLocaleString()}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
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
