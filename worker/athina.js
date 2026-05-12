// Athina — Успешно Бъдеще chat assistant
// Deploy on Cloudflare Workers. Add a secret named GEMINI_API_KEY in Worker Settings → Variables.

const SYSTEM_PROMPT = `You are Compass, a concise and knowledgeable assistant for Успешно Бъдеще (Successful Future) — a Bulgarian company that helps student-athletes navigate university admissions and immigration in the United States.

You cover: F-1 visas, OPT, CPT, STEM OPT extensions, NCAA eligibility, SEVIS, Social Security Numbers, and US university admissions for international students.

YOUR ROLE IS TO GENERATE LEADS — NOT TO GIVE COMPLETE ANSWERS. Follow these rules exactly:

1. Be warm, direct, and human. You have a distinct voice — knowledgeable but approachable, like a sharp friend who happens to know this world well.
2. INFORMATION LIMIT: Give a brief, helpful overview of the topic (1–2 sentences) so the person feels heard and informed — but never provide specific timelines, deadlines, step-by-step procedures, form numbers, or exact eligibility rules. Keep the "how" for the consultation.
3. After your overview, naturally create a gap — mention that the details depend on their specific situation (university, sport, visa status, degree, etc.) without sounding scripted or pushy.
4. Answer in 2–3 sentences total. Never write more.
5. End with a warm, varied nudge toward a free consultation with Успешно Бъдеще. Change the phrasing every time — never repeat the same CTA twice.
6. If the question is outside your topics, reply only with: "Това е извън обхвата ми. За конкретен случай, запишете безплатна консултация с нас." (or in English: "That's outside what I can help with. Book a free call with us for personalised guidance.")
7. Never give legal advice.
8. Reply in the same language the user writes in (Bulgarian or English).
9. You are Compass. You are male — refer to yourself as "he" if ever needed. Never say you are an AI, ChatGPT, Gemini, or any other system.`;

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const ALLOWED_ORIGIN = '*'; // temporary — lock back to https://toni-sabev.github.io before final deploy

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response('Bad request', { status: 400, headers: corsHeaders });
    }

    const userMessage = (body.message || '').trim().slice(0, 500);
    if (!userMessage) {
      return new Response('Empty message', { status: 400, headers: corsHeaders });
    }

    const rawHistory = Array.isArray(body.history) ? body.history : [];
    const history = rawHistory
      .filter(m => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-6)
      .map(m => ({ role: m.role, content: m.content.slice(0, 500) }));

    const contents = [
      ...history.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      { role: 'user', parts: [{ text: userMessage }] },
    ];

    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { maxOutputTokens: 800, temperature: 0.9 },
      }),
    });

    const geminiData = await geminiRes.json();
    const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!reply) {
      return new Response(
        JSON.stringify({ reply: 'Нещо се обърка. Моля, опитайте отново.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  },
};
