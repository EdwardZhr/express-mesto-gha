const Card = require('../models/card');

const CodeError = {
  NOT_FOUND: '404',
  SERVER_ERROR: '500',
  BAD_REQUEST: '400',
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(CodeError.SERVER_ERROR).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(CodeError.BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(CodeError.SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(CodeError.NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(CodeError.BAD_REQUEST).send({ message: 'Передан некорректный _id' });
      }
      return res.status(CodeError.SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(CodeError.NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(CodeError.BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      }
      return res.status(CodeError.SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(CodeError.NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(CodeError.BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      }
      return res.status(CodeError.SERVER_ERROR).send({ message: err.message });
    });
};
