const router = require('express').Router();
const { NOT_FOUND } = require('../utils/constants');
const {
  createUser, login,
} = require('../controllers/users');
const { auth } = require('../middlewares/auth');

router.use('/signup', createUser);
router.use('/signin', login);

router.use(auth);

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена' });
});

module.exports = router;
