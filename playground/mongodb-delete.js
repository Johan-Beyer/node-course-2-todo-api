// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');
  
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then(function (result) {
  //   console.log(result);
  // });
  
  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then(function (result) {
  //   console.log(result);
  // });
  
  // db.collection('Todos').findOneAndDelete({completed: false}).then(function (result) {
  //   console.log(result);
  // });
  
  // db.collection('Users').deleteMany({name: 'Johan'});
  
  db.collection('Users').findOneAndDelete({
    _id: new ObjectID('5ab7b12bd18430047f1578b8')
  }).then(function (result) {
    console.log(JSON.stringify(result, undefined, 2));
  });
  
  
  // client.close();
});