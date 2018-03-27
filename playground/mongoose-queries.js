const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/users');

// var id = '5ab9395474fc2008d2c22aa411';

// if(!ObjectID.isValid(id)){
//   console.log('ID not valid');
// }

// Todo.find({
//   _id: id
// }).then(function (todos) {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then(function (todo) {
//   console.log('Todo', todo);
// });
//
// Todo.findById(id).then(function (todo) {
//   if(!todo){
//     return console.log('Id not found');
//   }
//   console.log('Todo By Id', todo);
// }).catch(function (e) {
//   console.log(e);
// });

User.findById('5ab7c50cc72e0d0b44774a12').then(function (user) {
  if(!user){
    return console.log('User not found');
  }
  console.log('User By Id', user);
}).catch(function (e) {
  console.log(e);
});
