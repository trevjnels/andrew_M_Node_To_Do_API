var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://127.0.0.1:27017/TodoApp');
mongoose.connect(process.env.MONGODB_URI);

module.exports = { mongoose };

// //heroku logs shows you server logs for the application
//  process.env.NODE_ENV === 'production'
//  //heroku
//  process.env.NODE_ENV === 'test'
//  //mocha
//  process.env.NODE_ENV === 'development'
//  //localhost:3000
