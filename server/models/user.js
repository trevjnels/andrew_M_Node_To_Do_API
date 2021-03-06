const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

//were going to use a mongoose schma because mongoose models cannot take methods

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true, // verifies that the email is not already in use (false is default value)
    validate: {
      validator: validator.isEmail,
      message: "this is not a valid email"
    }
  },
  password: {
    type: String,
    required: true,
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

UserSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ["_id", "email"]);
};
//we are using a normal (non arrow function becuase arrows dont store this)
UserSchema.methods.generateAuthToken = function() {
  var user = this;
  //this is the user document
  var access = "auth";
  var token = jwt
    .sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET)
    .toString();

  user.tokens = user.tokens.concat([{ access, token }]);
  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function(token) {
  var user = this;

  return user.update({
    //pull is a mongodb operator
    $pull: {
      tokens: {
        token: token
      }
    }
  });
};
//.statics kind of like UserSchema.methods everything is a model method as opposed to instance
//method

UserSchema.statics.findByCredentials = function(email, password) {
  var User = this;
  return User.findOne({ email }).then(user => {
    if (!user) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      //use bcrypt.compare()
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};
UserSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded;

  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": "auth"
  });
};

UserSchema.pre("save", function(next) {
  var user = this;

  if (user.isModified("password")) {
    //user.password

    bcrypt.genSalt(10, (err, salt) => {
      return bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });

    //user.password = hashed value
  } else {
    next();
  }
});

var User = mongoose.model("User", UserSchema);

module.exports = { User };
//
