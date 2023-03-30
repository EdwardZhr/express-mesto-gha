const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const NotFoundError = require('../errors/not-found-err');
const {
  createUser, login,
} = require('../controllers/users');
const { auth } = require('../middlewares/auth');

router.use('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?/i),
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

router.use(() => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;
