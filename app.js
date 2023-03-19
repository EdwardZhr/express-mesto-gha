const express = require('express');
const mongoose = require('mongoose');

const { PORT, BASE_PATH } = require('./config');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use('/', require('./routes/index'));
