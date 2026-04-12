import Groq from "groq-sdk";
import cors from "../config/cors.js";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// ─── Language detection ───────────────────────────────────────────────────────

const LANG_PATTERNS = {
    ar: /[\u0600-\u06FF]/,
    darija: /\b(wach|fin|kif|bghit|kayn|mashi|zwina|daba|hna|nta|nti|khoya|lah|ewa|wakha|besah|mzyan|ghir|had|rah|ghi)\b/i,
};

function detectLanguage(text) {
    const hasArabicScript = LANG_PATTERNS.ar.test(text);
    const hasDarijaWords   = LANG_PATTERNS.darija.test(text);

    if (hasArabicScript && hasDarijaWords) return "darija";
    if (hasArabicScript)                   return "ar";

    const lower = text.toLowerCase();
    if (/\b(je|tu|il|elle|nous|vous|ils|bonjour|merci|oui|non|est|avec|pour|dans)\b/.test(lower)) return "fr";

    return "en";
}

// ─── System prompts per language ─────────────────────────────────────────────

const SYSTEM_PROMPTS = {
    en: `You are DocsAura AI, a professional and friendly healthcare assistant for DocsAura — Morocco's leading medical platform.

Your role:
- Help users find the right doctor, clinic, or laboratory in Morocco
- Explain symptoms clearly without making a diagnosis
- Describe medical tests, procedures, and what to expect
- Guide users through booking appointments on DocsAura
- Answer general health and wellness questions

Rules you must follow:
- NEVER diagnose a medical condition — always recommend consulting a licensed doctor
- Keep answers concise, warm, and easy to understand
- If a question is outside your scope, say so clearly and suggest calling DocsAura support
- Always respond in English unless the user writes in another language
- Sign off sensitive advice with: "For accurate diagnosis, please book an appointment on DocsAura."

Tone: professional yet warm — like a knowledgeable friend, not a clinical robot.`,

    fr: `Tu es DocsAura IA, un assistant médical professionnel et bienveillant de DocsAura — la première plateforme médicale du Maroc.

Ton rôle :
- Aider les utilisateurs à trouver le bon médecin, clinique ou laboratoire au Maroc
- Expliquer les symptômes clairement sans poser de diagnostic
- Décrire les analyses médicales, procédures et ce à quoi s'attendre
- Guider les utilisateurs pour prendre rendez-vous sur DocsAura
- Répondre aux questions générales de santé et bien-être

Règles à respecter :
- Ne jamais poser de diagnostic — toujours recommander de consulter un médecin agréé
- Réponses concises, chaleureuses et faciles à comprendre
- Terminer les conseils sensibles par : "Pour un diagnostic précis, veuillez prendre rendez-vous sur DocsAura."
- Répondre toujours en français si l'utilisateur écrit en français

Ton : professionnel mais chaleureux — comme un ami bien informé.`,

    ar: `أنت DocsAura AI، مساعد طبي محترف وودود من DocsAura — المنصة الطبية الرائدة في المغرب.

دورك:
- مساعدة المستخدمين في إيجاد الطبيب أو العيادة أو المختبر المناسب في المغرب
- شرح الأعراض بوضوح دون تشخيص الحالة
- وصف التحاليل الطبية والإجراءات وما يجب توقعه
- إرشاد المستخدمين لحجز مواعيد على منصة DocsAura
- الإجابة على أسئلة الصحة العامة والعافية

القواعد التي يجب اتباعها:
- لا تُشخّص أي حالة طبية — أنصح دائمًا باستشارة طبيب مرخص
- اجعل إجاباتك موجزة ودافئة وسهلة الفهم
- اختم النصائح الحساسة بـ: "للحصول على تشخيص دقيق، يُرجى حجز موعد عبر DocsAura."
- أجب دائمًا باللغة العربية الفصحى إذا كتب المستخدم بالعربية

الأسلوب: مهني ودافئ — كصديق مطلع لا كروبوت سريري.`,

    darija: `أنت DocsAura AI، مساعد طبي من DocsAura — أكبر منصة صحية فالمغرب.

دورك:
- تعاون مع المستخدمين باش يلقاو الطبيب أو العيادة أو المختبر المناسب
- تشرح الأعراض بكل وضوح بلا ما تعمل تشخيص
- تشرح التحاليل والإجراءات الطبية
- تعاونهم يحجزو موعد على DocsAura
- تجاوب على أسئلة الصحة العامة

القواعد:
- ما تعملش تشخيص أبدًا — دايمًا قل ليه يمشي يشوف طبيب
- اجاوب بطريقة قريبة وسهلة كيما كلام الدارجة الطبيعي
- كمّل النصايح الحساسة بـ: "باش تعرف أكثر، احجز موعد على DocsAura."
- اكتب بالدارجة المغربية دايمًا (ممكن تكتب بحروف عربية)

الأسلوب: قريب، واضح، ومفيد — كيما صاحب عنده خبرة طبية.`,
};

// ─── Fallback messages per language ──────────────────────────────────────────

const FALLBACKS = {
    en:     "I'm sorry, I couldn't process your request. Please try again or contact DocsAura support.",
    fr:     "Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer ou contacter le support DocsAura.",
    ar:     "عذرًا، لم أتمكن من معالجة طلبك. يرجى المحاولة مجددًا أو التواصل مع دعم DocsAura.",
    darija: "سماح ليا، ما قدرتش نعالج طلبك. عاود المحاولة أو تواصل مع فريق DocsAura.",
};

// ─── Input sanitization ───────────────────────────────────────────────────────

function sanitizeQuery(raw) {
    if (typeof raw !== "string") return null;
    return raw
        .replace(/<[^>]*>/g, "")
        .replace(/[^\p{L}\p{N}\s.,!?؟،؛:'\-]/gu, "")
        .trim()
        .slice(0, 1000);
}

// ─── Rate limiting (in-memory, per IP) ───────────────────────────────────────

const rateLimitStore = new Map();
const RATE_LIMIT     = { max: 15, windowMs: 60_000 };
function isRateLimited(ip) {
    const now   = Date.now();
    const entry = rateLimitStore.get(ip) || { count: 0, start: now };
    if (now - entry.start > RATE_LIMIT.windowMs) {
        rateLimitStore.set(ip, { count: 1, start: now });
        return false;
    }
    if (entry.count >= RATE_LIMIT.max) return true;
    entry.count++;
    rateLimitStore.set(ip, entry);
    return false;
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export default async function handler(req, res) {
    if (cors(req, res)) return;
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed",
        });
    }
    const clientIp = req.headers["x-forwarded-for"]?.split(",")[0] ?? req.socket?.remoteAddress ?? "unknown";
    if (isRateLimited(clientIp)) {
        return res.status(429).json({
            success: false,
            message: "Too many requests. Please wait a moment before trying again.",
        });
    }
    try {
        const raw = req.body?.query;
        if (!raw) {
            return res.status(400).json({
                success: false,
                message: "Query is required.",
            });
        }
        const query = sanitizeQuery(raw);
        if (!query || query.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Query is too short or contains invalid characters.",
            });
        }
        const lang         = detectLanguage(query);
        const systemPrompt = SYSTEM_PROMPTS[lang] ?? SYSTEM_PROMPTS.en;
        const fallback     = FALLBACKS[lang]       ?? FALLBACKS.en;
        const response = await groq.chat.completions.create({
            model:       "llama-3.3-70b-versatile",
            temperature: 0.65,
            max_tokens:  1024,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user",   content: query },
            ],
        });
        const answer = response.choices?.[0]?.message?.content?.trim();
        if (!answer) {
            return res.status(200).json({
                success: true,
                data:    fallback,
                lang,
            });
        }
        return res.status(200).json({
            success: true,
            data:    answer,
            lang,
            model:   response.model,
            usage:   response.usage,
        });
    } catch (error) {
        console.error("[DocsAura AI] Groq error:", error);
        const status  = error?.status  ?? 500;
        const message = error?.message ?? "Internal server error";
        return res.status(status >= 400 && status < 600 ? status : 500).json({
            success: false,
            message,
        });
    }
}