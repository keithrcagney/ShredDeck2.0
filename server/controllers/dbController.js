const db = require('../models/dev.postgresDB.js');
const dbController = {};

dbController.createUsers = (req, res, next) => {
  const userQuery = `CREATE TABLE IF NOT EXISTS Users(
    _id SERIAL PRIMARY KEY,
    email VARCHAR (50) not null UNIQUE,
    first_name VARCHAR (26) not null,
    last_name VARCHAR (26) not null,
    password VARCHAR (100) not null
  );`

  db.query(userQuery, null, (err, result) => {
    if (err){
      return next(err);
    } else {
      console.log(`Successfully created table 'Users' in database.`);
      return next();
    }
  })
};

dbController.createDecks = (req, res, next) => {
  const decksQuery = `CREATE TABLE IF NOT EXISTS Decks(
    _id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users (_id),
    title VARCHAR (50) not null UNIQUE,
    project_type VARCHAR(32) not null,
    created_at DATE not null default CURRENT_DATE,
    last_edit DATE not null default CURRENT_DATE
  );`

  db.query(decksQuery, null, (err, result) => {
    if (err){
      return next(err);
    } else {
      console.log(`Successfully created table 'Decks' in database.`);
      return next();
    }
  })
};

dbController.createShreds = (req, res, next) => {
  const shredsQuery = `CREATE TABLE IF NOT EXISTS Shreds(
    _id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users (_id),
    deck_id INTEGER REFERENCES Decks (_id) ON DELETE CASCADE,
    time VARCHAR (50) not null,
    location VARCHAR (50) not null,
    characters VARCHAR (75) not null,
    plot_action VARCHAR(255) not null,
    learned VARCHAR (255) not null,
    complete BOOLEAN not null default FALSE
  );`

  db.query(decksQuery, null, (err, result) => {
    if (err){
      return next(err);
    } else {
      console.log(`Successfully created table 'Shreds' in database.`);
      return next();
    }
  })
};

if (module.hot){
  module.hot.accept((err) => console.error(err));
}

module.exports = dbController;
