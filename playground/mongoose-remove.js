const { ObjectID } = require('mongodb');
// going to use the ObjectID.isValid() method to ensure that jthe id
//we pass in below is kosher

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

//Todo.remove({}) - this pulls everything form the collection and delete
//cannot pass in an empty param. you need at least an empty object literal

// Todo.remove({}).then(result => {
//   console.log(result.result);
// });

//Todo.findOneAndRemove
//Todo.findByIdAndRemove
//^^^ both remove the document

Todo.findOneAndRemove({ _id: '5c030e308b8993cf033577df' });

Todo.findByIdAndRemove('5c030e308b8993cf033577df').then(todo => {
  console.log(todo);
});
//^again both do the same thing
