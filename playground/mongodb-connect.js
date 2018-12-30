//first thing you need to do is to connect to mongodb in the terminal
// do so by finding /Users/trevornelson/mongo/bin and typing in terminal
// ./mongod --dbpath ~/mongo-data/
// this turns the thing on and connects to the mongo-data/ folder to
//use as the db folder. Obciously the path argument is going to changed

// const MongoClient = require('mongodb').MongoClient;
//
// MongoClient.connect(
//   'mongodb://localhost:27017/TodoApp',
//   (err, db) => {
//     if (err) {
//       return console.log('Unable to connect to databse server');
//     }
//     console.log('Connected to MongoDB server');
//
//     db.collection('ToDos').insertOne(
//       {
//         text: 'fuck kadie',
//         completed: false
//       },
//       (err, result) => {
//         if (err) {
//           return console.log('Unable to insert todo', err);
//         }
//         console.log(JSON.stringify(result.ops, undefined, 2));
//       }
//     );
//     db.close();
//   }
// );//
//first arugment is string - url where database lives
//second arg is a callback - fire after connection has suceeded or failed.
//if fails program stops, if suceeds will manipulate the database.

//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  (err, db) => {
    if (err) {
      return console.log("Unable to connect to databse server");
    }
    console.log("Connected to MongoDB server");

    db.collection("Users").insertOne(
      {
        name: "kadie",
        age: "21",
        location: "ct"
      },
      (err, result) => {
        if (err) {
          return console.log("Unable to insert new User", err);
        }
        console.log(result.ops[0]._id.getTimestamp());

        //.getTimestamp is a mongodb libarry function that uses the first 4 digets of the
        // _id to find the coded timestapm
      }
    );

    db.close();
  }
);
