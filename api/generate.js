// api/generate.js
// Vercel serverless function to proxy Chat + Image requests to OpenAI
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    const body = req.body || (req._body && JSON.parse(req._body)) || {};
    const prompt = body.prompt || '';
    const isChat = !!body.chat;

    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) return res.status(500).json({ error: 'Server missing OPENAI_API_KEY env variable' });

    if (isChat) {
      // Chat completion
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500
        })
      });
      const text = await r.text();
      if (!r.ok) return res.status(r.status).send(text);
      const data = JSON.parse(text);
      const reply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      return res.status(200).json({ reply });
    } else {
      // Image generation
      const r = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-image-1',
          prompt,
          n: 1,
          size: '1024x1024'
        })
      });
      const text = await r.text();
      if (!r.ok) return res.status(r.status).send(text);
      const data = JSON.parse(text);
      // normalize
      if (data.data && data.data[0]) {
        const item = data.data[0];
        if (item.url) return res.status(200).json({ image_url: item.url });
        if (item.b64_json) return res.status(200).json({ data: [{ b64_json: item.b64_json }] });
      }
      return res.status(200).json(data);
    }

  } catch (err) {
    console.error('Function error', err);
    return res.status(500).json({ error: String(err) });
  }
};
