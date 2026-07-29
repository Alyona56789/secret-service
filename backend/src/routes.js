const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { encrypt, decrypt } = require('./crypto');
const db = require('./database');

router.post('/api/secrets', (req, res) => {
  const { content } = req.body;

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'Поле content обязательно и должно быть строкой' });
  }

  try {
    const id = uuidv4();
    const encryptedContent = encrypt(content);
    
    const stmt = db.prepare('INSERT INTO secrets (id, content) VALUES (?, ?)');
    stmt.run(id, encryptedContent);

    const DOMAIN = process.env.DOMAIN || 'http://localhost:3000';
    const link = `${DOMAIN}/${id}`;
    res.status(201).json({ link });
  } catch (err) {
    console.error('Ошибка при сохранении:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
}); 

router.get('/:hash', (req, res) => {
  const { hash } = req.params;

  try {
    const stmt = db.prepare('SELECT content FROM secrets WHERE id = ?');
    const row = stmt.get(hash);

    if (!row) {
      return res.status(404).json({ error: 'Секрет не найден' });
    }

    const decryptedContent = decrypt(row.content);
    res.json({ content: decryptedContent });
  } catch (err) {
    console.error('Ошибка при получении:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

module.exports = router;