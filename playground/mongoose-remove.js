const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/users');

// Todo.remove({}).then(function (result) {
//   console.log(result);
// }).catch(function (e) {
//   console.log(e);
// });

// Todo.findOneAndRemove()

// Todo.findOneAndRemove({_id: '5abe2c1c1fc754de03b8ee5c'}).then(function (todo) {
//   console.log(todo);
// });

Todo.findByIdAndRemove('5abe2c1c1fc754de03b8ee5c').then(function (todo) {
  console.log(todo);
});