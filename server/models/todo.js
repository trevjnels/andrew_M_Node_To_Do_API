var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  //this obj defines the properties of each storage objects
  text: {
    type: String,
    required: true,
    minlength: 1,
    //trim trims off any leading & trailing whitesapce
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
  //dont need the created at added in here because the timestamp has
  //this buit into the ObjectID property (first 4 digets)
});

module.exports = { Todo };
