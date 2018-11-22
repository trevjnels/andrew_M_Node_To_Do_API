const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect(
  'mongodb://localhost:27017/TodoApp',
  (err, db) => {
    if (err) {
      return console.log('Unable to connect to databse server');
    }
    console.log('Connected to MongoDB server');

    db.collection('Users')
      .findOneAndUpdate({ name: 'Kadie roberts' }, { $inc: { age: 1 } })
      .then(result => {
        console.log(result);
      });
    db.collection('Users')
      .findOneAndUpdate(
        { name: 'Kadie roberts' },
        { $set: { name: 'future Trevor' } },
        { returnOrginal: false }
      )
      .then(result => {
        console.log(result);
      });
    // db.collection('ToDos')
    //   .findOneAndUpdate(
    //     { _id: new ObjectID('5bf6a1a85bb40deca84be197') },
    //     { $set: { completed: false } },
    //     //$set is a mongodb update operator
    //
    //     { returnOrginal: false }
    //   )
    //   .then(result => {
    //     console.log(result);
    //   });
  }
);

//incremenet operator for the age and change the name from
// Trevor Nelson to kadie roberts
