var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://127.0.0.1:27017/TodoApp');
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp'
);

module.exports = { mongoose };

//heroku logs shows you server logs for the application
