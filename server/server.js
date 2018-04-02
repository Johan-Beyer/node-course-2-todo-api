require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/users');

var app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', function (req, res) {
  var todo = new Todo({
    text: req.body.text
  });
  
  todo.save().then(function (doc) {
    res.send(doc);
  }, function (e) {
    res.status(400).send(e);
  });
});

app.get('/todos', function (req, res) {
  Todo.find().then(function (todos) {
    res.send({todos});
  }, function (e) {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', function (req, res) {
  var id = req.params.id;
  
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  
  Todo.findById(id).then(function (todo) {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }, function (e) {
    res.status(400).send(e);
  });
});

app.delete('/todos/:id', function (req, res) {
  var id = req.params.id;
  
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  
  Todo.findByIdAndRemove(id).then(function (todo) {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }, function (e) {
    res.status(400).send(e);
  });
});

app.patch('/todos/:id', function (req, res) {
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
  
  Todo.findByIdAndUpdate(id, {
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

app.listen(port, function () {
  console.log(`Started on port ${port}`);
});

module.exports = {app};