const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost:27017/TodoApp",
  (err, db) => {
    if (err) {
      return console.log("Unable to connect to databse server");
    }
    console.log("Connected to MongoDB server");

    db.collection("Users")
      .findOneAndDelete({ _id: ObjectID("5c013eaebd2f2d324313feb6") })
      .then(result => {
        console.log(result);
      });
    //
    //   //deleteMany
    // db.collection('ToDos')
    //   .deleteMany({ text: 'feed brandy' })
    //   .then(result => {
    //     console.log(result);
    //   });

    // //deleteone
    // db.collection('ToDos')
    //   .deleteOne({ text: 'feed brandy' })
    //   .then(result => {
    //     console.log(result);
    //   });

    //findoneAnd deleteone
    // db.collection('ToDos')
    //   .findOneAndDelete({ completed: false })
    //   .then(result => {
    //     console.log(result);
    //   });
  }
);

//duplicates - name set to the name of the other document. delete many kadies
// find one and delete  by ID
