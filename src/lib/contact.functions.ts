import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(10).max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data: ContactInput) => contactSchema.parse(data))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: row, error } = await supabaseAdmin
      .from("contact_messages")
      .insert({
        full_name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        status: "new",
      })
      .select("id, created_at")
      .single();

    if (error || !row) {
      console.error("contact insert failed", error);
      throw new Error("We couldn't save your message. Please try again.");
    }

    const { sendGmail } = await import("./gmail.server");

    const submittedAt = new Date(row.created_at).toUTCString();

    const userBody = `Hello ${data.name},

Thank you for contacting CareerOS! We have successfully received your message.

Subject: ${data.subject}

Our team will review your message and get back to you as soon as possible.

Best regards,
CareerOS Team`;

    const adminBody = `New contact form submission received.

Full Name: ${data.name}
Email Address: ${data.email}
Subject: ${data.subject}

Message:
${data.message}

Submitted At: ${submittedAt}`;

    const adminEmail = process.env["CONTACT_ADMIN_EMAIL"];

    const results = await Promise.allSettled([
      sendGmail({
        to: data.email,
        subject: "We received your message – CareerOS",
        body: userBody,
      }),
      adminEmail
        ? sendGmail({
            to: adminEmail,
            subject: "New Contact Form Submission – CareerOS",
            body: adminBody,
            replyTo: data.email,
          })
        : Promise.reject(new Error("CONTACT_ADMIN_EMAIL is not configured")),
    ]);

    for (const result of results) {
      if (result.status === "rejected") {
        console.error("contact email send failed", result.reason);
      }
    }

    if (results[0].status === "rejected") {
      throw new Error(
        "Your message was saved, but we couldn't send the confirmation email. Our team will still reach out.",
      );
    }

    return { ok: true };
  });
