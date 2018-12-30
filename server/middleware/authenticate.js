var { User } = require("./../models/user");

var authenticate = (req, res, next) => {
  var token = req.header("x-auth");
  User.findByToken(token)
    .then(user => {
      if (!user) {
        return Promise.rejct();
      }

      req.user = user;
      req.token = token;
      next();
    })
    .catch(e => {
      res.status(401).send(e);
    });
};

module.exports = { authenticate };
