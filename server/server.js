require("./config/config");

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
const bcrypt = require("bcryptjs");

//local imports below, librarys above
var { mongoose } = require("./db/mongoose");
var { Todo } = require("./models/todo");
var { User } = require("./models/user");
var { authenticate } = require("./middleware/authenticate");

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
var dot = () => {
  console.log("- - - - - - - - - - - - - - - - - - - -");
};

app.post("/todos", authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  todo.save().then(
    doc => {
      res.send(doc);
      //automattically asigned status of 200 here
    },
    e => {
      res.status(400).send(e);
    }
  );
});
//post creates a resource

app.get("/todos", authenticate, (req, res) => {
  Todo.find({ _creator: req.user._id }).then(
    todos => {
      res.send({
        todos
        //you could just send the array back here but then you cant ad visiable properties
        // by making this an object with the first entry todos: [todos] we allow for other
        //properties example:
        //code: '400',
        //user: 'tnelson'
      });
    },
    e => {
      res.status(400).send(e);
    }
  );
});

//GET / todos/12329493034 (id)
app.get(`/todos/:id`, authenticate, (req, res) => {
  var id = req.params.id;
  //
  //
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
    //return console.log('Major Error: todoID not valid  => ', id);
  } else {
    Todo.findOne({
      _id: id,
      _creator: req.user._id
    })
      .then(todo => {
        if (!todo) {
          res.status(404).send();
          //return console.log('Error user not found!  =>  ', id);
        }
        res.send({ todo });
      })

      .catch(e => {
        res.status(400).send();
        //return console.log(JSON.stringify(e, undefined, 2));
      });
  }
});

app.delete(`/todos/:id`, authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  })
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch(e => {
      res.status(400).send();
    });
});

//patch updates
app.patch(`/todos/:id`, authenticate, (req, res) => {
  var id = req.params.id;

  var body = _.pick(req.body, ["text", "completed"]);
  //^this is the reason we installed lodash without lodash we can send along properties
  //to update that are not even on the object or that we (th user) are not supposed to updates
  //completed at would be a good example of a param. This allows us to set
  //the only two properties we want the usuer to updates
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  //checking completed value and using that value to set compelted at
  if (_.isBoolean(body.completed) && body.completed) {
    //if it is boolean and its true
    body.completedAt = new Date().getTime();
    //gettime returns a JS timestamp. This is the number of miliseconds
    //since midnight at january 1st 1970 (unix epic)
  } else {
    //not true or not boolean
    body.completed = false;
    body.completedAt = null;
    //if you want to clear a value from the database set it to null
  }

  Todo.findOneAndUpdate(
    {
      _id: id,
      _creator: req.user.id
    },
    { $set: body /*mongodb operator*/ },
    { new: true /*mongoose operator*/ }
  )
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch(e => {
      res.status(400).send();
    });
});

//get the ID like we do on line 68
//validate the ID -> return 404
//remove todBY // // ID
//sucess - todo was delted
//if no doc comes back send 404 (null)
//if(doc) send back 200.
//app.delete will still trigger a sucess case even if
//the todo has already been deleted.
//error (400) - empty body

//POST call /users

app.post("/users", (req, res) => {
  var body = _.pick(req.body, ["email", "password"]);
  body.email = body.email.toLowerCase();
  var user = new User(body);

  // var user = new User({
  //   email: req.body.email,
  //   password: req.body.password
  // });

  // User is a models
  // user is an instance

  user
    .save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then(token => {
      res.header("x-auth", token).send(user);
      //headers that start with x- are custom headers in jwt
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.get("/users/me", authenticate, (req, res) => {
  res.send(req.user);
});

app.post("/users/login", (req, res) => {
  var body = _.pick(req.body, ["email", "password"]);
  //see if email is in the DB
  body.email = body.email.toLowerCase();

  User.findByCredentials(body.email, body.password)
    .then(user => {
      //create new token
      return user.generateAuthToken().then(token => {
        res.header("x-auth", token).send(user);
      });
    })
    .catch(e => {
      res.status(400).send();
    });
});

app.delete("/users/me/token", authenticate, (req, res) => {
  req.user.removeToken(req.token).then(
    () => {
      res.status(200).send();
    },
    () => {
      res.status(400).send();
    }
  );
});
//
//bad code below - - - - - - - - - - - - - - - -
// User.find({ email: body.email }).then(user => {
//   var passwordCorrect = bcrypt
//     .compare(body.password, user[0].password, (err, res) => {
//       res.send(true);
//     })
//     .then(res.send(user))
//
//     //  if(passwordCorrect){
//     //   console.log("still true bro");
//     // }
//
//     .catch(e => {
//       res.status(404).send("User not found", e);
//     });
// bcrypt.compare(password, user.password, (err, res) => {
//   res.send({ email: email, password: password });
//bad code above - - - - - - - - - - - - - - - -
//

//

// if (User.find({ email })) {
//
// } else {
//   res.status(404).send("Error: user not found");
// }

// if email is in db, compare password to db(hashedPassword) using bcrypt.compare
//if fail return error -password is wrong
//if correct res.send user modle with email & pword

//hashed password = plain text password bcrypt.compare

//use lodash pick for this like in app.patch('todos/"id"')
// app.post("/todos", (req, res) => {
//   var todo = new Todo({
//     text: req.body.text
//   });
//   todo.save().then(
//     doc => {
//       res.send(doc);
//       //automattically asigned status of 200 here
//     },
//     e => {
//       res.status(400).send(e);
//     }
//   );
// });

app.listen(port, () => {
  console.log(`started on port ${port}`);
});

module.exports = { app };

//-----------------------notes and old code below this line---------
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//----------------------------------------------------------------------

// //promises orginally came froma  libary named bluebird
// //eventually this was added to ecma script
//
// mongoose.Promise = global.Promise;
// //^^^^^ this is how you add promises to mongoose
//
// mongoose.connect('mongodb://localhost:27017/TodoApp');
// //mongoose makes sure that we are connected in a smart way
// //with the standard mongodb library we have to time these connect statments
// //somehow so that the code runs in the right order??
// //I think this makes mongoose more moduler and less intra-dependent
//
// //mongoose likes to keep everyfeild in the storage objects predetermiend
// //with normal mongodb the objects could be random.
// //you could have {name: trevpr, age: 28} & {eyeColor: blue, farts: true}
// //in the same mongodb as two seperate entries.
// //mongoose would require that you have every single object have the same
// //4 properties[name, age, eyeColor, farts]
//
// var Todo = mongoose.model('Todo', {
//   //this obj defines the properties of each storage objects
//   text: {
//     type: String,
//     required: true,
//     minlength: 1,
//     //trim trims off any leading & trailing whitesapce
//     trim: true
//   },
//   completed: {
//     type: Boolean,
//     default: false
//   },
//   completedAt: {
//     type: Number,
//     default: null
//   }
//   //dont need the created at added in here because the timestamp has
//   //this buit into the ObjectID property (first 4 digets)
// });
//
// var User = mongoose.model('User', {
//   email: {
//     type: String,
//     required: true,
//     minlength: 1,
//     trim: true
//   }
// });
//
// var newUser = new User({
//   email: '    peeen '
// });
//
// newUser.save().then(
//   user => {
//     console.log('saved user', user);
//   },
//   e => {
//     console.log('Unable to save user', e);
//   }
// );
//
// // //below is uing this as a constructor function
// // var newTodo = new Todo({
// //   text: 'Cook dinner'
// // });
// //
// // newTodo.save().then(
// //   doc => {
// //     console.log('Saved todo', doc);
// //   },
// //   e => {
// //     console.log('Unable to save todo');
// //   }
// // );
// // //^this is the only way to add to the db.
//
// // var testToDo = new Todo({
// //   text: 'walk the dog'
// //   //if you set a number or a boolein into a string feild,
// //   //mongoose will coerce numbers or boolean into a string
// // });
// //
// // testToDo.save().then(
// //   doc => {
// //     console.log('Saved todo', JSON.stringify(doc, undefined, 2));
// //   },
// //   e => {
// //     console.log('Unable to save todo. Error:', e);
// //   }
// // );
//
// //text value, completed boolean (true), completedat (any number i like)
//
// //make a new user model
// //store a new user email, password, todos will be associated with a User
// //on the user the only property we need to set up is the email property
// //require email and trim it - set type to string - set min lenght 1.
