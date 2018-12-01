const { ObjectID } = require('mongodb');
// going to use the ObjectID.isValid() method to ensure that jthe id
//we pass in below is kosher

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// var id = '5c027d03b271f1ef3d93f48811';
// //this id is from the first id in a todo list I made. will not work later. I pulled
// //THis from robomongo
//
var dot = () => {
  console.log('- - - - - - - - - - - - - - - - - - - -');
};
//
// if (!ObjectID.isValid(id)) {
//   dot();
//   console.log('ID not valid');
//
// }
//
// // if id is not found in the db, then it will throw an empty array for find()
// // or null if we are looking for a specific id
// Todo.find().then(todos => {
//   dot();
//   if (!todos) {
//     return console.log('ERROR! - document could not be found in db!', id);
//   }
//   console.log('Todos', todos);
//   //finds all todos. if you put any property in the as the param to the finds
//   //then it will filter by that property - exlucding anything that does
//   //not match
// });

// Todo.findOne({
//   _id: id
// }).then(todo => {
//   dot();
//   if (!todo) {
//     return console.log('ERROR! - document could not be found in db!', id);
//   }
//   console.log('Todo fadflkjfalkdjfound: ', todo);
// });
//
// Todo.findById(id)
//   .then(todo => {
//     dot();
//     if (!todo) {
//       return console.log('ERROR! - document could not be found in db!', id);
//     }
//     console.log('todo by Id:  ', todo);
//   })
//   .catch(e => console.log(e));
//the catch call above is for if the user somehow inputs an invalid object
//id I think the one situation where this may happen is if its too short or
//to long - or prehaps not a string? I guess it may coerce
// the object id is not hexadecmial but something like it that
//involves letters and nubmers that appear to be random but its actually
// a very long number.

//challenge:
//query users collection
//-load in users models
//User.findbyID()
//handle three cases -
//1 user not found
//2 user was found
// errors
const userID = '5c02cd40c382fbc643373bb6'; //6
if (!ObjectID.isValid(userID)) {
  dot();
  return console.log('Major Error: userID not valid  => ', userID);
} else {
  User.findById(userID)
    .then(user => {
      dot();
      if (!user) {
        return console.log('Error user not found!  =>  ', userID);
      }
      console.log('user by ID: ', JSON.stringify(user, undefined, 2));
    })
    .catch(e => console.log(e));
}
