const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  NOT_FOUND, SERVER_ERROR, BAD_REQUEST, UNAUTHORIZED, CONFLICT,
} = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Возникла серверная ошибка' }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Передан некорректный _id' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Возникла серверная ошибка' });
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      if (err.code === 11000) {
        res.status(CONFLICT).send({ message: 'Пользователь с таким email уже существует' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Возникла серверная ошибка' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      res.status(UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
    });
};

const getUserInfo = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Передан некорректный _id' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Возникла серверная ошибка' });
    });
};

const updateInfo = (req, res, data) => {
  User.findByIdAndUpdate(
    req.user._id,
    data,
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Возникла серверная ошибка' });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  updateInfo(req, res, { name, about });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  updateInfo(req, res, { avatar });
};

module.exports = {
  getUsers, getUserById, createUser, updateProfile, updateAvatar, login, getUserInfo,
};
