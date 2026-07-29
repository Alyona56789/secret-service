const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Сервер Secret Service работает' });
});

const secretRoutes = require('./routes');
app.use('/api', secretRoutes);            

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});