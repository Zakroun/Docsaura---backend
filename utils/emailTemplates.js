export const getUserTemplate = ({ name, message, lang }) => {
    const content = {
        en: {
            subject: "We received your message",
            title: "Thank you for contacting us 👋",
            body: "We have received your message and will get back to you as soon as possible.",
        },
        fr: {
            subject: "Nous avons reçu votre message",
            title: "Merci de nous avoir contactés 👋",
            body: "Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.",
        },
        ar: {
            subject: "لقد توصلنا برسالتك",
            title: "شكراً لتواصلك معنا 👋",
            body: "لقد توصلنا برسالتك وسنقوم بالرد عليك في أقرب وقت ممكن.",
        },
    };

    const t = content[lang] || content.en;

    return {
        subject: t.subject,
        html: `
      <div style="font-family: Arial, sans-serif; background:#f9fafb; padding:20px;">
        <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:12px;box-shadow:0 5px 20px rgba(0,0,0,0.05)">
          
          <h2 style="color:#0f172a;">${t.title}</h2>
          
          <p style="color:#475569;font-size:15px;">
            ${t.body}
          </p>

          <div style="margin-top:20px;padding:15px;background:#f1f5f9;border-radius:8px;">
            <strong>Your message:</strong>
            <p style="margin-top:10px;">${message}</p>
          </div>

          <p style="margin-top:25px;font-size:13px;color:#94a3b8;">
            © ${new Date().getFullYear()} Your Platform
          </p>
        </div>
      </div>
    `,
    };
};


export const getAdminTemplate = ({ name, email, message }) => {
    return {
        subject: "📩 New Contact Message",
        html: `
      <div style="font-family: Arial, sans-serif; background:#f9fafb; padding:20px;">
        <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:12px;">
          
          <h2 style="color:#0f172a;">New Message Received</h2>

          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>

          <div style="margin-top:15px;padding:15px;background:#f1f5f9;border-radius:8px;">
            <strong>Message:</strong>
            <p>${message}</p>
          </div>

        </div>
      </div>
    `,
    };
};