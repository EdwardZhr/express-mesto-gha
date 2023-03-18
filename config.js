const mongoose = require('mongoose');
const path = require('path');

const { PORT = 3000, BASE_PATH } = process.env;

module.exports = {
  mongoose, path, PORT, BASE_PATH,
};
