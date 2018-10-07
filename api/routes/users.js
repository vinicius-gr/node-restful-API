const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/authorization');

const UsersController = require('../controllers/users');

router.post('/signup', UsersController.signup);

router.post('/login', UsersController.login);

router.delete('/:userId', checkAuth, UsersController.delete);

module.exports = router;