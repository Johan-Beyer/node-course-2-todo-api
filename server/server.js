require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

var app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', authenticate, function (req, res) {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  
  todo.save().then(function (doc) {
    res.send(doc);
  }, function (e) {
    res.status(400).send(e);
  });
});

app.get('/todos', authenticate, function (req, res) {
  Todo.find({
    _creator: req.user._id
  }).then(function (todos) {
    res.send({todos});
  }, function (e) {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', authenticate, function (req, res) {
  var id = req.params.id;
  
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then(function (todo) {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }, function (e) {
    res.status(400).send(e);
  });
});

app.delete('/todos/:id', authenticate, function (req, res) {
  var id = req.params.id;
  
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  
  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then(function (todo) {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }, function (e) {
    res.status(400).send(e);
  });
});

app.patch('/todos/:id', authenticate, function (req, res) {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);
  
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  
  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {
    $set: body
  }, {
    new: true
  }).then(function (todo) {
    if (!todo) {
      return res.status(404).send();
    }
    
    res.send({todo});
  }, function (e) {
    res.status(400).send(e);
  });
});

app.post('/users', function (req, res) {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);
  
  user.save()
    .then(function () {
      return user.generateAuthToken();
    })
    .then(function (token) {
      res.header('x-auth', token).send(user);
    })
    .catch(function (e) {
      res.status(400).send(e);
    });
});

app.get('/users/me', authenticate, function (req, res) {
  res.send(req.user);
});

app.post('/users/login', function (req, res) {
  var body = _.pick(req.body, ['email', 'password']);
  
  User.findByCredentials(body.email, body.password)
    .then(function (user) {
      return user.generateAuthToken()
        .then(function (token) {
          res.header('x-auth', token).send(user);
        })
    })
    .catch(function (e) {
      res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, function (req, res) {
  req.user.removeToken(req.token)
    .then(function () {
      res.status(200).send();
    })
    .catch(function () {
      res.status(200).send();
    });
});

app.listen(port, function () {
  console.log(`Started on port ${port}`);
});

module.exports = {app};