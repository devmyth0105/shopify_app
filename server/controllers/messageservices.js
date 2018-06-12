const db = require('../sequelize');

exports.create = (req, res) => {
  const userId = req.auth.id;
  const triggerName = req.body.triggerName;
  const messageSchedule = req.body.messageSchedule;
  const msgTemplate = req.body.msgTemplate;
  const category_id = req.body.category;

  db.Message.create({
    user_id: userId,
    trigger_name: triggerName,
    message_schedule: messageSchedule,
    message_content: msgTemplate,
    msg_notification: 0,
    category_id: category_id,
  })
  .then(() => {
    db.Message.findOne({
      where: { trigger_name: triggerName }
    })
    .then((msg) => {
      res.json(msg);
    })
  })
  .catch((err) => {
    res.status(404).send({error: err});
  })
}

exports.getAll = (req, res) => {
  const userId = req.auth.id;

  db.Message.findAll({
    where: {user_id: userId}
  })
  .then((msgs) => {
    res.json(msgs);
  })
  .catch((err) => {
    res.status(404).send({error: err});
  })
}

exports.getMessage = (req, res) => {
  const msgId = req.params.id;

  db.Message.findOne({
    where: { id: msgId }
  })
  .then((message) => {
    if (!message) {
      res.status(404).send({error: 'Not find message'});
    }
    res.json(message);
  })
  .catch((err) => {
    res.status(404).send({error: err});
  })
}

exports.updateMessage = (req, res) => {
  const msgId = req.params.id;
  const messageContent = req.body.messageContent;

  db.Message.update({
    message_content: messageContent,
  }, {
    where: {id: msgId}
  })
  .then((result) => {
    if (!result) {
      res.status(404).send({error: 'Not find user'});
    }
    res.json({status: 'success'});
  })
  .catch((err) => {
    res.status(404).send({error: err});
  })
}

exports.updateMessageStates = (req, res) => {
  const msgId = req.params.id;

  db.Message.update({
    msg_notification: req.body.status,
  }, {
    where: {id: msgId}
  })
  .then((result) => {
    if (!result) {
      res.status(404).send({error: 'Not find user'});
    }
    res.json({status: 'success'});
  })
  .catch((err) => {
    res.status(404).send({error: err});
  })
}

exports.deleteMessage = (req, res) => {
  const msgId = req.params.id;

  if (!msgId) {
    res.status(404).send({error: 'Missing Parameter'});
  }

  db.Message.destroy({
    where: {id: msgId}
  })
  .then(() => {
    res.json({status: 'success'});
  })
  .catch((err) => {
    res.status(404).send(err);
  })
}
