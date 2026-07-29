const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { encrypt } = require('./crypto');
const db = require('./database');

router.post('/secrets', (req, res) => {
  const { content } = req.body;

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'Поле content обязательно и должно быть строкой' });
  }

  try {
    const id = uuidv4();

    const encryptedContent = encrypt(content);

    const stmt = db.prepare('INSERT INTO secrets (id, content) VALUES (?, ?)');
    stmt.run(id, encryptedContent);

    const link = `http://localhost:3000/${id}`;

    res.status(201).json({ link });
  } catch (err) {
    console.error('Ошибка при сохранении:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

module.exports = router;