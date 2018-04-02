const expect = require('expect');
const request = require('supertest');

const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}];

beforeEach(function (done) {
  Todo.remove({})
    .then(function () {
      return Todo.insertMany(todos);
    })
    .then(function () {
      done();
    })
});

describe('POST /todos', function () {
  it('should creat a new todo', function (done) {
    var text = 'Test todo text';
    
    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect(function (res) {
        expect(res.body.text).toBe(text);
      })
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        
        Todo.find({text})
          .then(function (todos) {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(function (e) {
            done(e);
          });
      });
  });
  
  it('should not create todo with invalid body data', function (done) {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        
        Todo.find()
          .then(function (todos) {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(function (e) {
            done(e);
          });
      });
  });
});

describe('GET /todos', function () {
  it('should get all todos', function (done) {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(function (res) {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', function () {
  it('should return todo doc', function (done) {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(function (res) {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });
  
  it('should return a 404 if todo not found', function (done) {
    var hexId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
    
  });
  
  it('should return a 404 for non-object ids', function (done) {
    request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done);
    
  });
});

describe('DELETE /todos/:id', function () {
  it('should remove a todo', function (done) {
    var hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect(function (res) {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        Todo.findById(hexId).then(function (todo) {
          expect(todo).toBeFalsy();
          done();
        }).catch(function (e) {
          done(e);
        });
      });
  });
  
  it('should return a 404 if todo not found', function (done) {
    var hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
    
  });
  
  it('should return a 404 for non-object ids', function (done) {
    request(app)
      .delete(`/todos/123`)
      .expect(404)
      .end(done);
    
  });
});

describe('PATCH /todos/:id', function () {
  it('should update the todo', function (done) {
    var hexId = todos[0]._id.toHexString();
    var text = 'This should be the new text';
    
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        text,
        completed: true
      })
      .expect(200)
      .expect(function (res) {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done);
  });
  
  it('should clear completedAt when todo is not completed', function (done) {
    var hexId = todos[1]._id.toHexString();
    var text = 'This should be the new text!!';
    
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        text,
        completed: false
      })
      .expect(200)
      .expect(function (res) {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeFalsy();
      })
      .end(done);
  });
});

