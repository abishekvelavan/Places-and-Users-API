const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users')

router.get('/', usersController.getUsers);
router.get('/:uid', usersController.getUserById);
router.post('/signup', usersController.signUp);
router.post('/login', usersController.login);
module.exports = router;