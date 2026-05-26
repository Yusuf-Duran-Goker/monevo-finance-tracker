const express = require('express');
const router = express.Router();
const multer = require('multer');
const Anthropic = require('@anthropic-ai/sdk');
const { protect } = require('../middleware/auth');

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
const ALLOWED_MAGIC = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]],
  'image/gif': [[0x47, 0x49, 0x46, 0x38]],
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]],
};

function checkMagicBytes(buffer, mime) {
  const sigs = ALLOWED_MAGIC[mime];
  if (!sigs) return false;
  return sigs.some(sig => sig.every((byte, i) => buffer[i] === byte));
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    cb(null, ALLOWED_MIMES.includes(file.mimetype));
  }
});

const PROMPT = (today) => `You are a financial assistant. Extract all transactions from this document.

Return ONLY a valid JSON array, nothing else. No markdown, no explanation.

Format:
[{"description":"store or item name","amount":25.50,"type":"expense","category":"Food","date":"${today}"}]

Rules:
- type: "expense" or "income"
- category: one of: Food, Transport, Housing, Health, Entertainment, Shopping, Salary, Other
- amount: positive number only
- date: YYYY-MM-DD format, use ${today} if unclear
- Group items from same receipt into ONE transaction
- For bank statements, each row = one transaction

Return [] if nothing found.`;

router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    if (!checkMagicBytes(req.file.buffer, req.file.mimetype)) {
      return res.status(400).json({ message: 'Invalid file type' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(500).json({ message: 'Scan service not configured' });

    const client = new Anthropic({ apiKey });
    const today = new Date().toISOString().split('T')[0];
    const isPDF = req.file.mimetype === 'application/pdf';

    let responseText;

    if (isPDF) {
      const pdfParse = require('pdf-parse/lib/pdf-parse');
      let pdfText = '';
      try {
        const data = await pdfParse(req.file.buffer);
        pdfText = data.text;
      } catch (e) {
        pdfText = '';
      }

      if (!pdfText.trim()) {
        return res.json({ transactions: [], message: 'Could not extract text from PDF' });
      }

      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `${PROMPT(today)}\n\nDocument text:\n${pdfText.slice(0, 8000)}`
        }]
      });
      responseText = response.content[0].text.trim();

    } else {
      const mediaType = req.file.mimetype;
      const base64 = req.file.buffer.toString('base64');

      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
            { type: 'text', text: PROMPT(today) }
          ]
        }]
      });
      responseText = response.content[0].text.trim();
    }

    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return res.json({ transactions: [] });

    const transactions = JSON.parse(jsonMatch[0]);
    res.json({ transactions });

  } catch (err) {
    console.error('Scan error:', err.message);
    res.status(500).json({ message: 'Scan failed' });
  }
});

module.exports = router;
