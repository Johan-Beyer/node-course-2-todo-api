// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');
  
  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5ab7b911f62c9e09acd43495')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then(function (result) {
  //   console.log(result)
  // });
  
  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5ab7af98442a050406ee29b5')
  }, {
    $set: {
      name: 'Johan'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then(function (result) {
    console.log(result)
  });
  
  // client.close();
});