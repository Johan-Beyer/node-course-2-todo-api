// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');
  
  // db.collection('Todos').find({_id: new ObjectID('5ab7af1f5b114c03dc9dd7a2')}).toArray().then(function (docs) {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, function (err) {
  //   console.log('Unable to fetch todos', err);
  // });
  
  // db.collection('Todos').find().count().then(function (count) {
  //   console.log(`Todos count: ${count}`);
  // }, function (err) {
  //   console.log('Unable to fetch todos', err);
  // });

  db.collection('Users').find({name: 'Johan'}).toArray().then(function (docs) {
    console.log(JSON.stringify(docs, undefined, 2));
  }, function (err) {
    console.log('Unable to fetch users', err);
  });
  
  // client.close();
});