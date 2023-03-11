const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const { PORT = 3000, BASE_PATH } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  app.listen(PORT, () => {
    console.log('Ссылка на сервер');
    console.log(BASE_PATH);
  }, (err) => {
    console.log(err);
  });
});

app.use((req, res, next) => {
  req.user = {
    _id: '6408636b2aeba47927aa2a78',
  };
  next();
});

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use((req, res) => {
  res.status('404').send({ message: 'Страница не найдена' });
});

app.use(express.static(path.join(__dirname, 'public')));
