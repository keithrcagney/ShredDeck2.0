const db = require('../models/dev.postgresDB.js');
const deckController = {};

deckController.getDecks = (req, res, next) => {
  const { uid } = res.locals;
  const values = [uid];
  const getDecksQuery = "SELECT * FROM Decks WHERE user_id=$1";

  db.query(getDecksQuery, values, (err, result) => {
    if (err){
      return next({
        log: err.stack,
        msg: 'Error retrieving decks from the database.'
      });
    } else {
      res.locals.decks = result.rows;
      next();
    }
  });
};

deckController.addDeck = (req, res, next) => {
  const { uid } = res.locals;
  const {title, project_type } = req.body;
  const values = [uid, title, project_type];
  const insertDeckQuery = 'INSERT INTO Decks(user_id, title, project_type) VALUES($1, $2, $3) RETURNING *';

  db.query(insertDeckQuery, values, (err, result) => {
    if (err){
      return next({
        log: err.stack,
        msg: 'Error posting deck to the database.'
      });
    };
    const {rows} = result;
    res.locals.post = rows;
    next();
  });
};

deckController.deleteDeck = (req, res, next) => {
  const { uid } = res.locals;
  const { _id } = req.body;
  const values = [ _id, uid];
  const deleteQuery = `DELETE FROM Decks WHERE _id=$1 && user_id=$2`;
  
  db.query(deleteQuery, values, (err, result) => {
    if (err){
      return next({
        log: err.stack,
        msg: 'Error deleting deck from the database.'
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

module.exports = deckController;