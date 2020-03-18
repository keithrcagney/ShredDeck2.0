const db = require('../models/dev.postgresDB');
const shredController = {};


shredController.getShreds = (req, res, next) => {
  //PostgreSQL parameterized queries inure against dB attack
  const {uid} = req.cookies;
  const getShredsQuery = "SELECT * FROM Shreds WHERE user_id= $1";
  const values = [1];

  db.query(getShredsQuery, values, (err, result) => {
    if (err){
      return next({
        log: 'Error encountered in shredsController.getShreds',
        msg: 'Error retrieving shreds from the database.'
      });
    } else {
      const {rows} = result;
      res.locals.shreds = rows;
      next();
    }
  });
};

shredController.addShred = (req, res, next) => {
  const {uid} = req.cookies;
  const {deck_id, time, location, characters, plot_action, learned } = req.body;
  const values = [uid, deck_id, time, location, characters, plot_action, learned];

  const insertShredQuery = 'INSERT INTO Shreds(user_id, deck_id, time, location, characters, plot_action, learned) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';

  db.query(insertShredQuery, values, (err, result) => {
    if (err){
      return next({
        log: 'Error encountered in shredController.addShred',
        msg: 'Error posting shred to the database.'
      });
    };
    const {rows} = result;
    res.locals.post = rows;
    next();
  });
};

shredController.editShred = (req, res, next) => {
  const {uid} = req.cookies;
  const {time, location, characters, plot_action, learned } = req.body;
  const values = [uid, deck_id, time, location, characters, plot_action, learned];

  const insertShredQuery = 'INSERT INTO Shreds(user_id, deck_id, time, location, characters, plot_action, learned) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';

  db.query(insertShredQuery, values, (err, result) => {
    if (err){
      return next({
        log: 'Error encountered in shredController.addShred',
        msg: 'Error posting shred to the database.'
      });
    };
    next();
  });
};

shredController.completeShred = (req, res, next) => {
  const {uid} = req.cookies;
  const {complete} = req.body;
  const values = [complete];

  //@TODO: configure UPDATE query syntax to parse additional edits
  const completeQuery = '';

  db.query(completeQuery, values, (err, result) => {
    if (err){
      return next({
        log: 'Error encountered in shredController.completeShred',
        msg: 'Error marking shred complete in the database.'
      });
    };
    next();
  })
}

shredController.deleteShred = (req, res, next) => {
  const {_id} = req.body;
  const deleteQuery = `DELETE FROM Shreds WHERE _id=${_id}`;
  
  db.query(deleteQuery, (err, result) => {
    if (err){
      return next({
        log: 'Error encountered in shredController.deleteShred',
        msg: 'Error deleting shred from the database.'
      });
    } else {
      console.log(`Deleted task ${_id} successfully`);
      next();
    }
  });
};

if (module.hot){
  module.hot.accept((err) => console.error(err));
}

module.exports = shredController;