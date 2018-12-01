const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const dummytodos = [
  {
    _id: new ObjectID(),
    text: 'first test todo'
  },
  {
    _id: new ObjectID(),
    text: 'second test todo'
  }
];

beforeEach(done => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(dummytodos);
    })
    .then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', done => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({ text }) //object gets converted to JSON by supertest
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should not create toDo with invalid body data', done => {
    //post request
    //send empty objects - which should be invalid
    //expect 400
    //check fo rerrors
    //same todo.find length is going to be 0
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', done => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
    //you do not need a full end function with a err, res as this is not
    //an async function.
    //request is apart of supertest
  });
});

describe('GET /todos:id', () => {
  it('should return todo doc', done => {
    request(app)
      .get(`/todos/${dummytodos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(dummytodos[0].text);
      })
      .end(done);
  });
  it('should return 404 if todo not found', done => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      //make a req using real ObjectID
      //call tohexstring method
      //newobjectID will be called
      //wont be found in the collection.
      //expect status code is 404
      .end(done);
  });
  it('should return 404 for non-object ids', done => {
    //pass in a url /todos/123
    //expect 404 will be status code
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  });
});
