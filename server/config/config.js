var env = process.env.NODE_ENV || "development";
console.log("env ****", env);
// heroku config:set JWT_SECRET="adjfloi3rfdf09304damfvnv"
if (env === "development" || env === "test") {
  var config = require("./config.json");
  var envConfig = config[env];

  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
    //this bascially loops over the thing below
  });
}

//
// var badDates = [
// '1/2', '1/21', '1/31', "2/8", '2/18', '2/20'
// ]
// if (env === "development") {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp";
// } else if (env === "test") {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppTest";
// }

//Heroku
// * Setting an environment variable in the terminal
//     * Heroku config:set Name=Trevo
//         * This makes a key value pare of {Name: “Trevo”}
//     * Heroku config:get Name
//         * Returns “Trevo"
//     * Heroku config:unset Name
//         * Removes Name object from the config.
//     * Heroku config
//         * Shows all configurations on the config object
