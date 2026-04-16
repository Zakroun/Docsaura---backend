export const getUserTemplate = ({ name, message, lang }) => {
    const content = {
        en: {
            subject: "We received your message",
            greeting: `Hi ${name || "there"},`,
            title: "Thanks for reaching out 💬",
            body: "We’ve received your message and truly appreciate you taking the time to contact us. Our team will get back to you shortly.",
            footer: "We’re here for you — talk soon!",
        },
        fr: {
            subject: "Nous avons reçu votre message",
            greeting: `Bonjour ${name || ""},`,
            title: "Merci pour votre message 💬",
            body: "Nous avons bien reçu votre message et nous vous remercions de nous avoir contactés. Notre équipe vous répondra très bientôt.",
            footer: "Nous restons à votre écoute — à très vite !",
        },
        ar: {
            subject: "لقد توصلنا برسالتك",
            greeting: `مرحباً ${name || ""}،`,
            title: "شكراً لتواصلك معنا 💬",
            body: "لقد توصلنا برسالتك ونقدّر تواصلك معنا. سيقوم فريقنا بالرد عليك في أقرب وقت ممكن.",
            footer: "نحن هنا لمساعدتك — سنتحدث قريباً!",
        },
    };

    const t = content[lang] || content.en;

    return {
        subject: t.subject,
        html: `
        <div style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
            <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.05);">

                <!-- Header -->
                <div style="background:#0f172a;padding:25px;text-align:center;">
                    <h1 style="color:#ffffff;margin:0;font-size:20px;letter-spacing:0.5px;">
                        DocsAura
                    </h1>
                </div>

                <!-- Content -->
                <div style="padding:30px;">
                    <p style="margin:0 0 15px;color:#334155;font-size:15px;">
                        ${t.greeting}
                    </p>

                    <h2 style="margin:0 0 15px;color:#0f172a;font-size:20px;">
                        ${t.title}
                    </h2>

                    <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.6;">
                        ${t.body}
                    </p>

                    <!-- Message box -->
                    <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:15px;border-radius:10px;">
                        <p style="margin:0 0 8px;font-size:13px;color:#64748b;">
                            Your message:
                        </p>
                        <p style="margin:0;color:#0f172a;font-size:14px;line-height:1.5;">
                            ${message}
                        </p>
                    </div>

                    <p style="margin-top:25px;color:#475569;font-size:14px;">
                        ${t.footer}
                    </p>
                </div>

                <!-- Footer -->
                <div style="text-align:center;padding:15px;background:#f8fafc;font-size:12px;color:#94a3b8;">
                    © ${new Date().getFullYear()} DocsAura — All rights reserved
                </div>

            </div>
        </div>
        `,
    };
};


export const getAdminTemplate = ({ name, email, message }) => {
    return {
        subject: "📩 New Contact Message",
        html: `
        <div style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
            <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.05);">

                <!-- Header -->
                <div style="background:#0f172a;padding:20px;text-align:center;">
                    <h2 style="color:#ffffff;margin:0;font-size:18px;">
                        New Message Received
                    </h2>
                </div>

                <!-- Content -->
                <div style="padding:30px;">
                    <p style="margin:0 0 10px;color:#334155;">
                        <strong>Name:</strong> ${name}
                    </p>
                    <p style="margin:0 0 20px;color:#334155;">
                        <strong>Email:</strong> ${email}
                    </p>

                    <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:15px;border-radius:10px;">
                        <p style="margin:0 0 8px;font-size:13px;color:#64748b;">
                            Message:
                        </p>
                        <p style="margin:0;color:#0f172a;font-size:14px;line-height:1.5;">
                            ${message}
                        </p>
                    </div>
                </div>

                <!-- Footer -->
                <div style="text-align:center;padding:15px;background:#f8fafc;font-size:12px;color:#94a3b8;">
                    Contact form notification • DocsAura
                </div>

            </div>
        </div>
        `,
    };
};