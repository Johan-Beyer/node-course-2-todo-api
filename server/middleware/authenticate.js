const {User} = require('./../models/user');

const authenticate = function (req, res, next) {
  const token = req.header('x-auth');
  
  User.findByToken(token)
    .then(function (user) {
      if (!user) {
        return Promise.reject();
      }
      
      req.user = user;
      req.token = token;
      next();
    })
    .catch(function (e) {
      res.status(401).send();
    });
};

module.exports = {authenticate};
