const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/dev.postgresDB.js');

const authController = {};
const secret = 'example secret';

authController.signupUser = (req, res, next) => {
  const { email, first_name, last_name, password } = req.body;

  // first check if user exists to redirect to login route
  const userExistQuery = "SELECT email FROM Users WHERE email=$1";
  const emailArr = [email];

  db.query(userExistQuery, emailArr, (err, result) => {
    if (err) {
      return next({
        log: err.stack,
        message: 'Error occurred checking if user exists.'
      })
    } else {
      if (result.rows.length) {
        if (result.rows[0].email === email) {
          res.locals.redirect = { email, password };
          next();
        }
      }
    }
  })

  const signupQuery = "INSERT INTO Users(email, first_name, last_name, password) VALUES ($1, $2, $3, $4) RETURNING _id";

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return next({
        log: err.stack,
        message: 'Error generating password hash.',
      });
    } else {
      //PostgreSQL parameterized queries inure against dB attack
      const values = [email, first_name, last_name, hash];

      db.query(signupQuery, values, (err, result) => {
        if (err) {
          return next({
            log: err.stack,
            message: 'Error signing user up.'
          })
        } else {
          //issue token using JWT authentication
          const { _id } = result.rows[0];
          const payload = { _id };
          const token = jwt.sign(payload, secret, {expiresIn: `1h`});
          res.cookie('token', token, { httpOnly: true });
          next();
        }
      })
    }
  });
};

authController.loginUser = (req, res, next) => {

  const { email, password } = req.body;
  const values = [email];
  const loginQuery = "SELECT _id, password FROM Users WHERE email=$1";

  db.query(loginQuery, values, (err, result) => {
    if (err) {
      return next({
        log: err.stack,
        message: 'Error logging user in.'
      });
    } else {
      if (result.rows.length === 0){
        res.locals.denied = true;
        next();
      }
      
      const hash = result.rows[0].password;
      const { _id } = result.rows[0];

      bcrypt.compare(password, hash, (err, response) => {
        if (err) {
          return next({
            log: err.stack,
            message: 'bCrypt comparison failed; server could not validate user.'
          });
        } else {
          //issue token using JWT authentication
          const payload = { _id };
          const token = jwt.sign(payload, secret, {expiresIn: `1h`});
          res.cookie('token', token, { httpOnly: true });
          next();
        }
      })
    }
  })
};

authController.cookieCheck = (req, res, next) => {

  const clearTokenAndNext = () => {
    res.clearCookie("token");
    next();
  }

  const { token } = req.cookies;
  
  if (!token) {
    return clearTokenAndNext();
  } else {
    jwt.verify(token, secret, (err, decoded) => {
      if (err){
        return next({
          log: err.stack,
          message: 'Error verifying cookie; try again.'
        })
      } else {
        console.log(decoded);
        const { _id } = decoded;
        res.locals.uid = _id;
        next();
      }
    });
  }
};

if (module.hot){
  module.hot.accept((err) => console.error(err));
}

module.exports = authController;
