const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("./../server");
const { Todo } = require("./../models/todo");
const { User } = require("./../models/user");
const { todos, populateTodos, users, populateUsers } = require("./seed/seed");

beforeEach(populateUsers);
beforeEach(populateTodos);

describe("POST /todos", () => {
  it("should create a new todo", done => {
    var text = "Test todo text";

    request(app)
      .post("/todos")
      .send({ text }) //object gets converted to JSON by supertest
      .set("x-auth", users[0].tokens[0].token)
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

  it("should not create toDo with invalid body data", done => {
    //post request
    //send empty objects - which should be invalid
    //expect 400
    //check fo rerrors
    //same todo.find length is going to be 0
    request(app)
      .post("/todos")
      .send({})
      .set("x-auth", users[0].tokens[0].token)
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

describe("GET /todos", () => {
  it("should get all todos", done => {
    request(app)
      .get("/todos")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
    //you do not need a full end function with a err, res as this is not
    //an async function.
    //request is apart of supertest
  });
});

describe("GET /todos:id", () => {
  it("should return todo doc", done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it("should not return to-do doc created by other user", done => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it("should return 404 if todo not found", done => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      //make a req using real ObjectID
      //call tohexstring method
      //newobjectID will be called
      //wont be found in the collection.
      //expect status code is 404
      .end(done);
  });
  it("should return 404 for non-object ids", done => {
    //pass in a url /todos/123
    //expect 404 will be status code
    request(app)
      .get("/todos/123")
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe("DELETE /todos:id", () => {
  it("should remove a todo", done => {
    var hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set("x-auth", users[1].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(hexId)
          .then(todo => {
            expect(todo).toBeFalsy();
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });
  it("should not remove a todo that user does not own", done => {
    var hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set("x-auth", users[1].tokens[0].token)
      .expect(404)

      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(hexId)
          .then(todo => {
            expect(todo).toBeTruthy();
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });
  it("should return 404 if todo not found", done => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set("x-auth", users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
  it("should return 404 if object ID is invalid", done => {
    request(app)
      .delete(`/todos/1234`)
      .set("x-auth", users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe("PATCH /todos/id:", () => {
  //going to need to set xaught [0]
  //duplicate this test and try to update 1st todo as 2nd user with
  //404 back and that expect todo to hav enot changed.
  it("should b able to update the text, completed & set completedAt if true", done => {
    var hexId = todos[0]._id.toHexString();
    var text = "new test text";
    request(app)
      .patch(`/todos/${hexId}`)
      .set("x-auth", users[0].tokens[0].token)
      .send({
        text,
        completed: true
      })
      .expect(200)

      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe("number");
      })
      .end(done);
  });

  it("should be able to update the text, completed & set completedAt if true", done => {
    var hexId = todos[0]._id.toHexString();
    var text = "new test text";
    request(app)
      .patch(`/todos/${hexId}`)
      .set("x-auth", users[1].tokens[0].token)
      .send({
        text,
        completed: true
      })
      .expect(404)

      .end(done);
  });
  it("should set completedAt to null when todo is not compelted", done => {
    //set as xauth as user[1]
    var hexId = todos[1]._id.toHexString();
    var text = "this is the new text";
    request(app)
      .patch(`/todos/${hexId}`)
      .set("x-auth", users[1].tokens[0].token)
      .send({
        completed: false,
        text
      })
      .expect(200)

      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBe(null);
      })
      .end(done);
    //
  });
});

describe("GET /users/me", () => {
  it("should return user if authenticated", done => {
    request(app)
      .get("/users/me")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });
  //users/me route
  //do not supply an xauth tokens
  //expect 401 back
  //expect body to equal an empty object literal
  //.end(done)
  //must use toequal, not tobe when comparing objects
  it("should return a 401 if not authenticated", done => {
    request(app)
      .get("/users/me")
      // .set("x-auth", "")  //dont need this because omitting it is the same thing
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe("POST /users", () => {
  it("should create a user", done => {
    //
    var email = "example@example.com";
    var password = "123mnb!";

    request(app)
      .post("/users")
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.headers["x-auth"]).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end(err => {
        if (err) {
          return done(err);
        }
        User.findOne({ email })
          .then(user => {
            expect(user).toBeTruthy();
            expect(user.password).not.toBe(password);
            done();
          })
          .catch(e => done(e));
      });
  });
  it("should return validation errors if request invalid", done => {
    request(app)
      .post("/users")
      .send({ email: "fuckthisuserEmail.com", password: "bran" })
      .expect(400)
      // send invalid email & invalid Password
      //expect a 400
      .end(done);
  });
  it("should not create user if email in use", done => {
    // use one of the two emails from seed data
    //should 400
    request(app)
      .post("/users")
      .send({ email: "Jen@example.com", password: "This!sAstr0ngPassword..." })
      .expect(400)
      .end(done);
  });
});

describe("POST /user/login", () => {
  it("Should provide an // X-auth token when email & password correct", done => {
    request(app)
      .post("/users/login")
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect(res => {
        expect(res.header["x-auth"]).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[1]._id)
          .then(user => {
            expect(user.toObject().tokens[1]).toMatchObject({
              access: "auth",
              token: res.headers["x-auth"]
            });
            done();
          })
          .catch(e => done(e));
      });
  });
  it("Should return a 400 status when email or password are incorrect", done => {
    request(app)
      .post("/users/login")
      .send({ email: users[1].email, password: "dflkjdflk" })
      .expect(400)
      .expect(res => {
        expect(res.headers["x-auth"]).toBeFalsy();
      })
      .end(err => {
        if (err) {
          return done(err);
        }
        User.findById(users[1]._id)
          .then(user => {
            //console.log(user);
            expect(user.tokens.length).toBe(1);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe("DELETE /users/me/token", () => {
  it("should remove auth token on logout", done => {
    request(app)
      .delete("/users/me/token")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[0]._id)
          .then(user => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch(e => done(e));
      });
  });
});
