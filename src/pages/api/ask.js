export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Only POST method allowed' });
    }
  
    const { query } = req.body;
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  
    if (!OPENAI_API_KEY) {
      console.error('❌ No API key found.');
      return res.status(500).json({ error: 'Server misconfiguration.' });
    }
  
    try {
      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful healthcare AI assistant.' },
            { role: 'user', content: query },
          ],
          temperature: 0.7,
        }),
      });
  
      const data = await openaiRes.json();
  
      if (!openaiRes.ok) {
        console.error('OpenAI API error:', data);
        return res.status(500).json({ error: data.error?.message || 'OpenAI error' });
      }
  
      const reply = data.choices[0]?.message?.content || 'No assistant reply.';
      res.status(200).json({ reply });
    } catch (err) {
      console.error('❌ Unexpected Server Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  