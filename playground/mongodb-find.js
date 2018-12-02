//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  (err, db) => {
    if (err) {
      return console.log("Unable to connect to databse server");
    }
    //
    console.log("Connected to MongoDB server");
    // db.collection('ToDos')
    //   .find()
    //   //i used .filter on docs in the JSON.stringify line to obtain the
    //   //same result as putting the object in find above.
    //   //You can leave.find empty for all results.
    //
    //   //using an object ID in the find will not work as as id as a
    //   //string or number. Look at how you do it below:
    //   //find({ _id: new ObjectID('5bf557145bb40deca84bd96e') })
    //
    //   .count()
    //   .then(
    //     count => {
    //       console.log('ToDos');
    //       console.log(`ToDos count: ${count}`);
    //     },
    //     err => {
    //       console.log('Unable to fetch todos', err);
    //     }
    //   );
    // db.collection('ToDos')
    //   .find()
    //  gives you all results
    //
    //   .toArray()
    //   .then(
    //     docs => {
    //       console.log('ToDos');
    //       console.log(JSON.stringify(docs, undefined, 2));
    //     },
    //     err => {
    //       console.log('Unable to fetch todos', err);
    //     }
    //   );

    // db.collection('ToDos')
    //   .find({ _id: new ObjectID('5bf557145bb40deca84bd96e') })
    //   //i used .filter on docs in the JSON.stringify line to obtain the
    //   //same result as putting the object in find above.
    //   //You can leave.find empty for all results.
    //
    //   //using an object ID in the find will not work as as id as a
    //   //string or number. Look at how you do it below:
    //   //find({ _id: new ObjectID('5bf557145bb40deca84bd96e') })
    //
    //   .toArray()
    //   .then(
    //     docs => {
    //       console.log('ToDos');
    //       console.log(JSON.stringify(docs, undefined, 2));
    //     },
    //     err => {
    //       console.log('Unable to fetch todos', err);
    //     }
    //   );
    //you can leave find empty to find all to-dos
    //find returns mongodb cursor.
    //toArray converts the obj to the array.
    //to array returns a promimse
    //db.close()

    db.collection("Users")
      .find({ name: "Trevor Nelson" })
      .toArray()
      .then(
        docs => {
          if (docs.length < 1) {
            return console.log("No records exist by that name");
          }
          console.log("kadie records");
          console.log(JSON.stringify(docs, undefined, 2));
        },
        err => {
          console.log("unable to fetch Users", err);
        }
      );
  }
);

//query users looking for the name with the name in the script
//look for all kadie records and print to screen.
//
