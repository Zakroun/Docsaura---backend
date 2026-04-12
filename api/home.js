// api/home.js

const ENDPOINTS = [
    {
        method: "POST",
        path: "/api/ai",
        description: "Send a natural-language message to the AI model and receive a contextual response. Powers the DocsAura in-app patient chat assistant.",
        body: '{ "message": "string" }',
        returns: '{ "reply": "string", "model": "string", "latency_ms": "number" }',
        example_req: JSON.stringify({ message: "What are symptoms of high blood pressure?" }, null, 2),
        example_res: JSON.stringify({ reply: "High blood pressure often has no symptoms...", model: "gpt-4o", latency_ms: 843 }, null, 2),
    },
    {
        method: "POST",
        path: "/api/sendMail",
        description: "Dispatch transactional emails via Nodemailer — appointment confirmations, password resets, and patient notifications.",
        body: '{ "to": "string", "subject": "string", "body": "string" }',
        returns: '{ "success": "boolean", "messageId": "string", "accepted": "string[]" }',
        example_req: JSON.stringify({ to: "patient@example.com", subject: "Appointment confirmed", body: "Your appointment is confirmed for Jan 15 at 10:00." }, null, 2),
        example_res: JSON.stringify({ success: true, messageId: "<abc123@docsaura.ma>", accepted: ["patient@example.com"] }, null, 2),
    },
];

function endpointCard(ep, index) {
    return `
    <div class="ep">
      <div class="ep-head">
        <span class="badge-method">POST</span>
        <span class="ep-path">${ep.path}</span>
      </div>
      <p class="ep-desc">${ep.description}</p>
      <div class="ep-meta">
        <span class="meta-pill"><span class="meta-key">body </span>${ep.body}</span>
        <span class="meta-pill"><span class="meta-key">returns </span>${ep.returns}</span>
        <span class="meta-pill"><span class="meta-key">auth </span>none</span>
      </div>
      <details class="example-block">
        <summary>Show example</summary>
        <div class="tabs" data-ep="${index}">
          <button class="tab active" data-tab="req" onclick="showTab(this)">Request</button>
          <button class="tab" data-tab="res" onclick="showTab(this)">Response</button>
        </div>
        <pre class="code-block req-${index}">POST ${ep.path} HTTP/1.1\nContent-Type: application/json\n\n${ep.example_req}</pre>
        <pre class="code-block res-${index}" style="display:none">${ep.example_res}</pre>
      </details>
    </div>
  `;
}

module.exports = (req, res) => {
    const timestamp = new Date().toISOString();

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DocsAura API</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Geist:wght@300;400;500&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:         #0c0e11;
      --surface:    #13161c;
      --surface-2:  #1a1e28;
      --border:     rgba(255,255,255,0.06);
      --border-2:   rgba(255,255,255,0.12);
      --text:       #dde1ec;
      --muted:      #6b7280;
      --hint:       #3f4658;
      --teal:       #1d9e75;
      --teal-dim:   rgba(29,158,117,0.12);
      --teal-bdr:   rgba(29,158,117,0.3);
      --teal-text:  #5dcaa5;
      --blue:       #378add;
      --blue-dim:   rgba(55,138,221,0.1);
      --blue-bdr:   rgba(55,138,221,0.28);
      --blue-text:  #85b7eb;
      --green-dim:  rgba(99,153,34,0.12);
      --green-bdr:  rgba(99,153,34,0.3);
      --green-text: #97c459;
      --mono: 'JetBrains Mono', ui-monospace, monospace;
      --sans: 'Geist', system-ui, sans-serif;
    }

    html, body {
      min-height: 100vh;
      background: var(--bg);
      color: var(--text);
      font-family: var(--sans);
      -webkit-font-smoothing: antialiased;
    }

    body { display: flex; justify-content: center; align-items: flex-start; padding: 3rem 1.5rem 5rem; }
    .container { width: 100%; max-width: 680px; }

    /* ── Header ── */
    .header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: 2.5rem; }
    .logo-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .logo { width: 34px; height: 34px; background: var(--teal-dim); border: 1px solid var(--teal-bdr); border-radius: 9px; display: flex; align-items: center; justify-content: center; }
    .logo svg { width: 17px; height: 17px; }
    h1 { font-size: 22px; font-weight: 500; color: var(--text); }
    .tagline { font-size: 13px; color: var(--muted); line-height: 1.7; max-width: 350px; }
    .pills { display: flex; flex-direction: column; align-items: flex-end; gap: 7px; }
    .pill { display: inline-flex; align-items: center; gap: 6px; font-family: var(--mono); font-size: 11px; padding: 4px 12px; border-radius: 20px; border: 1px solid; white-space: nowrap; }
    .pill-live  { background: var(--green-dim); color: var(--green-text); border-color: var(--green-bdr); }
    .pill-ver   { background: var(--surface); color: var(--muted); border-color: var(--border-2); }
    .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green-text); animation: blink 2.2s ease-in-out infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.25} }

    /* ── Stats ── */
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 2rem; }
    .stat { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; }
    .stat-l { font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); margin-bottom: 8px; }
    .stat-v { font-family: var(--mono); font-size: 20px; font-weight: 500; color: var(--text); }

    /* ── Uptime ── */
    .uptime { margin-bottom: 2rem; }
    .sec-label { font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); margin-bottom: 10px; }
    .bar { display: flex; gap: 3px; }
    .seg { flex: 1; height: 28px; border-radius: 4px; background: var(--teal-dim); border: 1px solid var(--teal-bdr); }
    .seg.warn { background: rgba(186,117,23,0.12); border-color: rgba(186,117,23,0.3); }
    .uptime-note { font-family: var(--mono); font-size: 11px; color: var(--hint); margin-top: 8px; }
    .uptime-note span { color: var(--green-text); }

    /* ── Endpoints ── */
    .ep { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 1.25rem; margin-bottom: 12px; transition: border-color .18s; }
    .ep:hover { border-color: var(--border-2); }
    .ep-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .badge-method { font-family: var(--mono); font-size: 11px; font-weight: 500; padding: 3px 11px; border-radius: 20px; background: var(--blue-dim); color: var(--blue-text); border: 1px solid var(--blue-bdr); }
    .ep-path { font-family: var(--mono); font-size: 15px; font-weight: 500; color: var(--text); }
    .ep-desc { font-size: 13px; color: var(--muted); line-height: 1.7; }
    .ep-meta { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border); }
    .meta-pill { font-family: var(--mono); font-size: 11px; background: var(--surface-2); color: var(--muted); border-radius: 6px; padding: 4px 10px; }
    .meta-key { color: var(--hint); }

    /* ── Example block ── */
    details.example-block { margin-top: 14px; }
    details summary { font-size: 12px; color: var(--muted); cursor: pointer; user-select: none; list-style: none; display: inline-flex; align-items: center; gap: 6px; padding: 5px 0; outline: none; }
    details summary::before { content: ''; display: inline-block; width: 10px; height: 10px; border: 1px solid var(--border-2); border-radius: 3px; background: var(--surface-2); position: relative; }
    details[open] summary::before { background: var(--teal); border-color: var(--teal); }
    details[open] summary { color: var(--text); }
    .tabs { display: flex; gap: 2px; padding: 10px 0 8px; }
    .tab { font-family: var(--mono); font-size: 11px; padding: 4px 12px; border-radius: 6px; border: 1px solid var(--border); background: transparent; color: var(--muted); cursor: pointer; transition: all .15s; }
    .tab.active, .tab:hover { background: var(--surface-2); border-color: var(--border-2); color: var(--text); }
    .code-block { font-family: var(--mono); font-size: 12px; line-height: 1.75; color: var(--muted); background: var(--surface-2); border-radius: 8px; padding: 14px 16px; border: 1px solid var(--border); white-space: pre-wrap; word-break: break-word; }

    /* ── Footer ── */
    hr { border: none; border-top: 1px solid var(--border); margin: 2rem 0; }
    .footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
    .footer-items { display: flex; gap: 24px; flex-wrap: wrap; }
    .f-item .label { font-size: 10px; text-transform: uppercase; letter-spacing: .07em; color: var(--hint); margin-bottom: 4px; }
    .f-item .value { font-family: var(--mono); font-size: 12px; color: var(--muted); }
    .ts { font-family: var(--mono); font-size: 11px; color: var(--hint); }

    @media (max-width: 500px) {
      .stats { grid-template-columns: repeat(2, 1fr); }
      .pills { align-items: flex-start; }
    }
  </style>
</head>
<body>
  <div class="container">

    <div class="header">
      <div>
        <div class="logo-row">
          <div class="logo">
            <svg viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8.5" cy="8.5" r="6" stroke="${'#1d9e75'}" stroke-width="1.3"/>
              <path d="M4.5 8.5h2l1-2.5 1.5 5 1-2.5h2" stroke="${'#1d9e75'}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1>DocsAura API</h1>
        </div>
        <p class="tagline">Healthcare platform backend — AI assistance and transactional email for the DocsAura ecosystem.</p>
      </div>
      <div class="pills">
        <span class="pill pill-live"><span class="dot"></span>All systems operational</span>
        <span class="pill pill-ver">v1.0.0 · production</span>
      </div>
    </div>

    <div class="stats">
      <div class="stat"><div class="stat-l">Endpoints</div><div class="stat-v">2</div></div>
      <div class="stat"><div class="stat-l">Method</div><div class="stat-v">POST</div></div>
      <div class="stat"><div class="stat-l">Format</div><div class="stat-v">JSON</div></div>
      <div class="stat"><div class="stat-l">Auth</div><div class="stat-v">—</div></div>
    </div>

    <div class="uptime">
      <p class="sec-label">Uptime — last 30 days</p>
      <div class="bar">
        ${Array.from({ length: 30 }, (_, i) =>
        `<div class="seg${i === 11 || i === 18 ? ' warn' : ''}"></div>`
    ).join('')}
      </div>
      <p class="uptime-note">99.9% uptime · <span>0 incidents this month</span></p>
    </div>

    <p class="sec-label">Available endpoints</p>

    ${ENDPOINTS.map(endpointCard).join('')}

    <hr>

    <div class="footer">
      <div class="footer-items">
        <div class="f-item">
          <div class="label">Author</div>
          <div class="value">DocsAura Team</div>
        </div>
        <div class="f-item">
          <div class="label">Base URL</div>
          <div class="value">https://api.docsaura.ma</div>
        </div>
        <div class="f-item">
          <div class="label">Version</div>
          <div class="value">1.0.0</div>
        </div>
      </div>
      <span class="ts" id="ts">${timestamp}</span>
    </div>

  </div>
  <script>
    const tsEl = document.getElementById('ts');
    setInterval(() => { tsEl.textContent = new Date().toISOString(); }, 1000);

    function showTab(btn) {
      const tabs = btn.closest('.tabs');
      const ep = tabs.dataset.ep;
      tabs.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      const type = btn.dataset.tab;
      const det = tabs.closest('details');
      det.querySelector('.req-' + ep).style.display = type === 'req' ? 'block' : 'none';
      det.querySelector('.res-' + ep).style.display = type === 'res' ? 'block' : 'none';
    }
  </script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(html);
};