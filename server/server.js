const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/users');

var app = express();

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

app.listen(3000, function () {
  console.log('Started on port 3000');
});