const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const shredController = require('../controllers/shredController.js');

router.use('*', authController.cookieCheck);

router.get('/', authController.cookieCheck, shredController.getShreds, (req, res) => {
  const {shreds} = res.locals;
  res.status(200).json(data);
});

router.post('/', authController.cookieCheck, shredController.addShred, (req, res) => {
  res.status(200).json({success: `Shred added successfully.`});
});

router.put('/', authController.cookieCheck, shredController.editShred, (req, res) => {
  res.status(200).json({success: `Updated shred.`})
})

router.patch('/', authController.cookieCheck, shredController.completeShred, (req, res) => {
  res.status(200).json({success: `Shred completed.`});
})

router.delete('/', authController.cookieCheck, shredController.deleteShred, (req, res) => {
  res.status(200).json({success: `Deleted shred.`});
});

module.exports = router;