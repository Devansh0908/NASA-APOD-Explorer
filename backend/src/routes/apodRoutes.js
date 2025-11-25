const express = require('express');
const apodController = require('../controllers/apodController');

const router = express.Router();

router.get('/today', (req, res) => apodController.getToday(req, res));
router.get('/by-date', (req, res) => apodController.getByDate(req, res));
router.get('/recent', (req, res) => apodController.getRecent(req, res));

module.exports = router;
