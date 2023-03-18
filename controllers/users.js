const User = require('../models/user');

const { NOT_FOUND, SERVER_ERROR, BAD_REQUEST } = require('../utils/constants');

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
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Передан некорректный _id' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Возникла серверная ошибка' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Возникла серверная ошибка' });
    });
};

const updateInfo = (req, res, { name, about, avatar }) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name, about, avatar },
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
  getUsers, getUserById, createUser, updateProfile, updateAvatar,
};
