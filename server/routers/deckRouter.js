const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const deckController = require('../controllers/deckController.js');

router.get('/', authController.cookieCheck, deckController.getDecks, (req, res) => {
  const {decks} = res.locals;
  res.json({
    decks,
    status: "success"
  });
});

router.post('/', authController.cookieCheck, deckController.addDeck, (req, res) => {
  res.json({success: `ShredDeck created successfully.`});
});

router.delete('/', authController.cookieCheck, deckController.deleteDeck, (req, res) => {
  res.json({success: `Deleted ShredDeck.`});
});

module.exports = router;