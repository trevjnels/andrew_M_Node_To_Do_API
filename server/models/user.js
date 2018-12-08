const mongoose = require("mongoose");
const validator = require("validator");
// {
//   email: 'andrew@example.com',
//   password: 'myPass123',
//   tokens: [{
//     //tokens are going to remember each machine
//     access: 'auth',
//     token: 'poijasdpfoimasdfadfljkdaflj'
//   }]
// }

var User = mongoose.model("User", {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true, // verifies that the email is not already in use (false is default value)
    validate: {
      validator: validator.isEmail(value),
      message: "this is not a valid email"
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
  //not available in sql databases
});

module.exports = { User };
//
