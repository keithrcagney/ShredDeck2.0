const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const shredController = require('../controllers/shredController.js');

router.use('*', authController.cookieCheck);

router.get('/', shredController.getShreds, (req, res) => {
  const { shreds } = res.locals;
  res.json({
    shreds,
    status: "success"
  });
});

router.post('/', shredController.addShred, (req, res) => {
  console.log('shredRouter: POST');
  res.json({status: "success"});
});

router.put('/', shredController.editShred, (req, res) => {
  console.log('shredRouter: PUT');
  res.json({status: "success"});
})

router.patch('/', shredController.completeShred, (req, res) => {
  console.log('shredRouter: PATCH');
  res.json({status: "success"});
})

router.delete('/', shredController.deleteShred, (req, res) => {
  console.log('shredRouter: DELETE');

  //@TODO = implement a delete stack server-side
  res.json({status: "success"});
});

module.exports = router;