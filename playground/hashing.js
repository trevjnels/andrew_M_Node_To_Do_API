const { SHA256 } = require("crypto-js");
const jwt = require("jsonwebtoken");

var data = {
  id: 10
};

var token = jwt.sign(data, "SecretSalty");
//second arg is the secret
console.log("token", token);
//creats a Hash & creates token
var decoded = jwt.verify(token, "SecretSalty");
//second arg is the secret

console.log("----- - - - - - - -", decoded);
//takes data and makesure token not manipulated

//
//

//

//

//

// - - - -- - - - - - - - - - - -- - - - - - - - - - - -- - - - - -
//Below is a low level explain about how hashing/salting works
// - - - -- - - - - - - - - - - -- - - - - - - - - - - -- - - - - - - - - - - -- - - - - - - -
// var message = "I am a user number 3";
// var hash = SHA256(message).toString();
// console.log(`message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + "somesecret").toString()
// };
//
// // token.data.id = 5;
// // // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + "somesecret").toString();
//
// if (resultHash === token.hash) {
//   console.log("Data was not changed");
// } else {
//   console.log("somone b stealin");
// }
