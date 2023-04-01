const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const NotFoundError = require('../errors/not-found-err');
const {
  createUser, login,
} = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { regexLinkValidation } = require('../utils/constants');

router.use('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regexLinkValidation),
  }),
}), createUser);
router.use('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

router.use(auth);

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use((next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
